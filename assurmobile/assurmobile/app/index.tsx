import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [value, onChangeTitle] = useState("test");
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>To edit this value: { value }</Text>
      <Pressable onPress={() => onChangeTitle("New title")}> 
        <Text>Press on this link</Text>
      </Pressable>
      <Button 
        mode="contained"
        onPress={() => router.navigate("/login")}
      >
        Se connecter
      </Button>
    </View>
  );
}
