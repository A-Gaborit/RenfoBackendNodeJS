import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useRootNavigationState, useRouter } from "expo-router";
import { useCurrentUser } from "@/contexts/UserContext";
import { Redirect } from "expo-router";
import { colors } from "./theme";
import { useState } from "react";
import { SectionCard } from "./components/SectionCard";

export default function Index() {
  const [value, onChangeTitle] = useState("test");
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { user } = useCurrentUser();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if(rootNavigationState?.key) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineSmall" style={styles.pageTitle}>
          Bonjour {user?.firstname || user?.email?.split('@')[0]} 👋
        </Text>
        <Text variant="bodyLarge" style={styles.pageSubtitle}>
          Que souhaitez-vous consulter aujourd'hui ?
        </Text>

        <View style={styles.sectionsContainer}>
          <SectionCard
            title="Mes Sinistres"
            subtitle="Consulter l'historique de vos sinistres déclarés"
            icon="car-crash"
            color={colors.error}
            onPress={() => router.push('/sinisters' as any)}
          />

          <SectionCard
            title="Mes Dossiers de Prise en Charge"
            subtitle="Accéder à vos dossiers et documents médicaux"
            icon="file-document-outline"
            color={colors.primary}
            onPress={() => router.push('/requests' as any)}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  pageTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  pageSubtitle: {
    color: colors.textSecondary,
    marginBottom: 32,
  },
  sectionsContainer: {
    gap: 16,
  },

});
