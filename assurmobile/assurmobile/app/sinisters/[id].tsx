import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Divider, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Sinister } from "../types/Sinister";
import { getValidationConfig, getResponsibilityConfig } from "../components/ui/StatusConfig";
import { InfoCard } from "../components/ui/InfoCard";
import { InfoRow } from "../components/ui/InfoRow";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatDate } from "../components/ui/DateFormatter";
import { ErrorState } from "../components/ui/ErrorState";
import { AppButton } from "../components/AppButton";

export default function SinisterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sinister, setSinister] = useState<Sinister | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(`/sinister/${id}`, 'GET', {}, true)
        .then(response => {
          setSinister(response.sinister);
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }, [id]);

  if (error || !sinister) {
    return (
      <ErrorState 
        title="Le sinistre est introuvable !"
        message={error || undefined}
        onBack={() => router.push('/sinisters' as RelativePathString)}
        backText="Retour"
      />
    );
  }

  const statusConfig = getValidationConfig(sinister.validated);
  const responsibilityConfig = getResponsibilityConfig(sinister.driver_responsability, sinister.driver_engaged_responsability);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="car" size={28} color={colors.primary} />
            <Text variant="headlineMedium" style={styles.title}>
              {sinister.license_plate}
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

      <InfoCard title="Informations conducteur">
        <InfoRow 
          icon="account"
          label="Nom complet"
          value={`${sinister.driver_firstname} ${sinister.driver_lastname}`}
        />
        <InfoRow 
          icon="shield-check"
          label="Statut d'assurance"
          value={sinister.driver_is_insured ? "Assuré" : "Non assuré"}
          iconColor={sinister.driver_is_insured ? "#22C55E" : colors.error}
        />
        <InfoRow 
          icon="gavel"
          label="Responsabilité"
          value={responsibilityConfig.label}
          description={responsibilityConfig.description}
          iconColor={responsibilityConfig.color}
        />
      </InfoCard>

      <InfoCard title="Détails du sinistre">
        <InfoRow 
          icon="phone"
          label="Date de l'appel"
          value={formatDate(sinister.call_datetime)}
        />
        <InfoRow 
          icon="calendar-alert"
          label="Date du sinistre"
          value={formatDate(sinister.sinister_datetime)}
          iconColor={colors.error}
        />
        {sinister.context && (
          <InfoRow 
            icon="text-box"
            label="Contexte"
            value={sinister.context}
          />
        )}
      </InfoCard>

      {sinister.created_at && (
        <InfoCard title="Historique">
          <InfoRow 
            icon="calendar-plus"
            label="Date de création"
            value={formatDate(sinister.created_at)}
          />
          {sinister.updated_at && (
            <InfoRow 
              icon="calendar-edit"
              label="Dernière modification"
              value={formatDate(sinister.updated_at)}
            />
          )}
        </InfoCard>
      )}

      <AppButton
        onPress={() => router.push(`/requests?sinister=${sinister.id}` as any)}
      >
        Voir les dossiers associés
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
  }
});
