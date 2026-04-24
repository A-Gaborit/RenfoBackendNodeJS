import { Stack, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { UserProvider, useCurrentUser } from "@/contexts/UserContext";
import { colors } from "./theme";
import { Redirect } from "expo-router";

function AuthGuard({ children }: { children: React.ReactNode }) {
  // On passe par AuthGuard car si je met directement dans RootLayout, le user n'est pas encore initialisé via UserProvider
  const { user } = useCurrentUser();
  const pathname = usePathname();

  if (!user && pathname !== '/login') {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
        <AuthGuard>
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
        </AuthGuard>
      </UserProvider>
    </PaperProvider>
  );
}