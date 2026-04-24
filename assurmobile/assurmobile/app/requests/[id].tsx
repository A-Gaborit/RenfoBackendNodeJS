import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Request } from "../types/Request";
import { AppButton } from "../components/AppButton";
import { getRequestStatusConfig } from "../components/ui/RequestStatusConfig";
import { InfoCard } from "../components/ui/InfoCard";
import { InfoRow } from "../components/ui/InfoRow";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatDate } from "../components/ui/DateFormatter";
import { ErrorState } from "../components/ui/ErrorState";

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(`/request/${id}`, 'GET', {}, true)
        .then(response => {
          setRequest(response.request);
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }, [id]);

  if (error || !request) {
    return (
      <ErrorState 
        title="Le dossier est introuvable !"
        message={error || undefined}
        onBack={() => router.push('/requests' as RelativePathString)}
        backText="Retour"
      />
    );
  }

  const statusConfig = getRequestStatusConfig(request.status);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="file-document" size={28} color={colors.primary} />
            <Text variant="headlineMedium" style={styles.title}>
              Dossier #{request.id}
            </Text>
          </View>
          <StatusBadge 
            label={statusConfig.label}
            color={statusConfig.color}
            bgColor={statusConfig.bgColor}
          />
        </View>
        <Text variant="bodySmall" style={styles.statusDescription}>
          {statusConfig.description}
        </Text>
      </View>

      <InfoCard title="Informations générales">
        <InfoRow 
          icon="link"
          label="Sinistre associé"
          value={`#${request.sinister_id}`}
        />
        {request.diagnostic && (
          <InfoRow 
            icon="car-wrench"
            label="Diagnostic"
            value={request.diagnostic === "REPAIRABLE" ? "Réparable" : "Non réparable"}
          />
        )}
        {request.responsibility !== undefined && (
          <InfoRow 
            icon="percent"
            label="Responsabilité"
            value={`${request.responsibility}%`}
          />
        )}
        <InfoRow 
          icon="check-circle"
          label="État du dossier"
          value={request.closed ? "Clôturé" : "En cours"}
          iconColor={request.closed ? colors.error : colors.primary}
        />
      </InfoCard>
      
      <AppButton
        onPress={() => router.push(`/sinisters/${request.sinister_id}` as RelativePathString)}
      >
        Voir le sinistre associé
      </AppButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: colors.text,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
