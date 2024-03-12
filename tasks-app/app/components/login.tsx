import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebaseConnection";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export function Login({ changeStatus }: any) {
  const [type, setType] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (type === "login") {
      const user = signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((error) => {
          alert("ops, deu erro!");
          console.log(error);
          return;
        });
    } else {
      const user = createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((error) => {
          alert("ops, deu erro!");
          console.log(error);
          return;
        });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Seu email"
        style={styles.input}
        value={email}
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        placeholder="********"
        style={styles.input}
        value={password}
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity
        style={[
          styles.handleLogin,
          { backgroundColor: type === "login" ? "#3ea6f2" : "#141414" },
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>
          {type === "login" ? "Acessar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setType((type) => (type === "login" ? "cadastrar" : "login"))
        }
      >
        <Text style={{ textAlign: "center" }}>
          {type === "login" ? "Criar uma conta" : "Já possuo uma conta"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: "#F2f6fc",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "#bbbbbb",
  },
  handleLogin: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#141414",
    height: 45,
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
  },
});
