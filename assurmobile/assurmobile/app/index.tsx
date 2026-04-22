import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { useCurrentUser } from "@/contexts/UserContext";

export default function Index() {
  const [value, onChangeTitle] = useState("test");
  const router = useRouter();
  const user = useCurrentUser();
  
 
  // useEffect(() => {
    if (!user) {
      return <Redirect href="/login" />;
    }
  // }, [user]);

  
  
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
