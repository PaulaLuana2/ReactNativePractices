import { SetStateAction, useEffect, useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard,
} from "react-native";

import { Login } from "./components/login";
import { TaskList } from "./components/tasklist";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/database";

type itemProps = {
  key: string;
  name: string;
};

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [tasks, setTasks] = useState<Array<itemProps>>([]);

  const [newTask, setNewTask] = useState("");

  const reference = firebase
    .app()
    .database("https://reactnativecourse-a7383-default-rtdb.firebaseio.com/");

  function handleAdd() {
    if (newTask === "") return;

    let tarefas = reference.ref(`tarefas/${user?.uid}`);
    let chave = tarefas.push().key;

    if (chave !== null) {
      tarefas
        .child(chave)
        .set({
          name: newTask,
        })
        .then(() => {
          const data: itemProps = {
            key: chave === null ? "1" : chave,
            name: newTask,
          };
          setTasks([...tasks, data]);
        });

      Keyboard.dismiss();
      setNewTask("");
    }
  }

  function handleDelete(key: string) {}

  function handleEdit(data: object) {}

  useEffect(() => {
    auth().onAuthStateChanged((userState) => {
      setUser(userState);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (!loading) {
    return (
      <Login
        changeStatus={(user: SetStateAction<FirebaseAuthTypes.User | null>) =>
          setUser(user)
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="O que vai fazer hoje?"
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TaskList
            data={item}
            deleteItem={handleDelete}
            editItem={handleEdit}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: "#F2f6fc",
  },
  containerTask: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#141414",
    height: 45,
  },
  buttonAdd: {
    backgroundColor: "#141414",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
  },
});
