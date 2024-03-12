import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

type itemProps = {
  key: string;
  name: string;
};

type taskProps = {
  data: itemProps;
  deleteItem: Function;
  editItem: Function;
};

export function TaskList({ data, deleteItem, editItem }: taskProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => deleteItem(data)}
      >
        <Feather name="trash" color={Colors.white} size={20} />
      </TouchableOpacity>

      <View style={{ paddingRight: 10, flex: 1 }}>
        <TouchableOpacity onPress={() => editItem(data)}>
          <Text style={{ color: "#fff", paddingRight: 10 }}>{data.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#121212",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
  },
});
