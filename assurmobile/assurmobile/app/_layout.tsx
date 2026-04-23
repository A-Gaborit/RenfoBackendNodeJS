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
          <Stack.Screen name="sinisters" options={{ title: "Mes Sinistres" }} />
          <Stack.Screen name="sinisters/[id]" options={{ title: "Détails d'un sinistre" }} />
          <Stack.Screen name="requests" options={{ title: "Mes Dossiers" }} />
          <Stack.Screen name="requests/[id]" options={{ title: "Détails d'un dossier" }} />
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}