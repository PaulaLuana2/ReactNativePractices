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

import { User, onAuthStateChanged } from "firebase/auth";
import { ref, set, onValue, push } from "firebase/database";
import { auth, db } from "./services/firebaseConnection";

type itemProps = {
  key: string;
  name: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const [tasks, setTasks] = useState<Array<itemProps>>([]);

  const [newTask, setNewTask] = useState("");

  function handleAdd() {
    if (newTask === "") return;

    const dbReference = ref(db, `tarefas/${user?.uid}`);
    const newTaskRef = push(dbReference);

    set(newTaskRef, {
      name: newTask,
    }).then(() => {
      if (newTaskRef.key !== null) {
        const data: itemProps = {
          key: newTaskRef.key,
          name: newTask,
        };
        setTasks([...tasks, data]);
      }
    });

    Keyboard.dismiss();
    setNewTask("");
  }

  function handleDelete(key: string) {}

  function handleEdit(data: object) {}

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  if (!user) {
    return (
      <Login
        changeStatus={(user: SetStateAction<User | null>) => setUser(user)}
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
