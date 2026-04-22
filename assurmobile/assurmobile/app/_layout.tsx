import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout() {
  return( 
  <PaperProvider>
    <UserProvider>
    <Stack>
      <Stack.Screen name="index" options={{ title: "Homepage" }}/>
      <Stack.Screen name="login" options={{ title: "Login" }}/>
    </Stack>
    </UserProvider>
  </PaperProvider>
  );
}
