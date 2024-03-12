import {
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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

import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set, push, query, get, remove, update } from "firebase/database";
import { auth, db } from "../services/firebaseConnection";
import { Feather } from "@expo/vector-icons";

type itemProps = {
  key: string;
  name: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const inputRef = useRef<TextInput>(null);
  const [tasks, setTasks] = useState<Array<itemProps>>([]);

  const [newTask, setNewTask] = useState("");
  const [key, setKey] = useState("");

  function handleAdd() {
    if (newTask === "") return;

    if (key != "") {
      const dbReference = ref(db, `tarefas/${user?.uid}/${key}`);
      set(dbReference, {
        name: newTask,
      }).then(() => {
        const taskIndex = tasks.findIndex((item) => item.key === key);
        const taskClone = tasks;
        taskClone[taskIndex].name = newTask;

        setTasks([...taskClone]);
      });

      Keyboard.dismiss();
      setNewTask("");
      setKey("");
      return;
    }

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
        setTasks([data, ...tasks]);
        Keyboard.dismiss();
        setNewTask("");
      }
    });
  }

  function handleDelete(data: itemProps) {
    const dbReference = ref(db, `tarefas/${user?.uid}/${data.key}`);
    remove(dbReference).then(() => {
      const filtered = tasks.filter((item) => item.key !== data.key);
      setTasks(filtered);
    });
  }

  function handleEdit(data: itemProps) {
    setKey(data.key);
    setNewTask(data.name);
    inputRef.current!.focus();
  }

  function searchTasks() {
    const queryTasks = query(ref(db, `tarefas/${user?.uid}`));
    get(queryTasks).then((snapshot) => {
      snapshot.forEach((child) => {
        const dataTask: itemProps = {
          key: child.key,
          name: child.val().name,
        };
        if (tasks.findIndex((value) => value.key == child.key) === -1) {
          setTasks((oldTasks) => [dataTask, ...oldTasks]);
        }
      });
    });
  }

  function cancelEdit() {
    setKey("");
    setNewTask("");
    Keyboard.dismiss();
  }

  function logout() {
    signOut(auth);
    setUser(null);
    setTasks([]);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    if (user) {
      searchTasks();
    }
  }, [user]);

  if (!user) {
    return (
      <Login
        changeStatus={(user: SetStateAction<User | null>) => setUser(user)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {key.length > 0 && (
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name="x-circle" size={20} color="#FF0000" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, color: "#FF0000" }}>
            Você está editanto uma tarefa
          </Text>
        </View>
      )}
      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="O que vai fazer hoje?"
          value={newTask}
          onChangeText={(text) => setNewTask(text)}
          ref={inputRef}
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
      <View
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: "#FF0000", fontSize: 18, marginRight: 2 }}>
            Sair
          </Text>
          <Feather name="log-out" color="#FF0000" size={40} />
        </TouchableOpacity>
      </View>
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
