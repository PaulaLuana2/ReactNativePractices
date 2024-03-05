import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Login } from "./components/login";

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>DENTRO DA TELA</Text>
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
});
