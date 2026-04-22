import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "@/contexts/UserContext";
import { colors } from "./theme";

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.white,
            headerTitleStyle: {
              fontWeight: '600',
            },
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Accueil" }} />
          <Stack.Screen name="login" options={{ title: "Connexion", headerShown: false }} />
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}