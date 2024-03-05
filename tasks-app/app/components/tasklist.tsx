import { Text, View } from "react-native";

export function TaskList({ data }: any) {
  return (
    <View>
      <Text>{data.nome}</Text>
    </View>
  );
}
