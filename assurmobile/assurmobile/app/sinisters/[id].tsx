import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Divider, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Sinister } from "../types/Sinister";

function getValidationConfig(validated: boolean) {
  if (validated) {
    return { 
      label: "Validé", 
      color: "#22C55E", 
      bgColor: "#DCFCE7",
      description: "Le sinistre a été validé par l'assurance"
    };
  }
  return { 
    label: "En attente", 
    color: "#FFA500", 
    bgColor: "#FFF4E6",
    description: "Le sinistre est en attente de validation"
  };
}

function getResponsibilityConfig(responsible: boolean, engaged: number) {
  if (responsible) {
    return {
      label: "Responsable",
      color: colors.error,
      bgColor: "#FEE2E2",
      description: `Responsabilité engagée à ${engaged}%`
    };
  }
  return {
    label: "Non responsable",
    color: "#22C55E",
    bgColor: "#DCFCE7",
    description: "Aucune responsabilité engagée"
  };
}

export default function SinisterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sinister, setSinister] = useState<Sinister | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(`/sinister/${id}`, 'GET', {}, true)
        .then(response => {
          setSinister(response.sinister);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setError("Impossible de charger les détails du sinistre");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyMedium">Chargement...</Text>
      </View>
    );
  }

  if (error || !sinister) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={colors.error} />
        <Text variant="titleMedium" style={styles.errorTitle}>Erreur</Text>
        <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.backButton}>
          Retour
        </Button>
      </View>
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
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
        <Text variant="bodySmall" style={styles.statusDescription}>
          {statusConfig.description}
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Informations conducteur</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Nom complet</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {sinister.driver_firstname} {sinister.driver_lastname}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="shield-check" size={20} color={sinister.driver_is_insured ? "#22C55E" : colors.error} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Statut d'assurance</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {sinister.driver_is_insured ? "Assuré" : "Non assuré"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="gavel" size={20} color={responsibilityConfig.color} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Responsabilité</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {responsibilityConfig.label}
                </Text>
                <Text variant="bodySmall" style={styles.infoDescription}>
                  {responsibilityConfig.description}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Détails du sinistre</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Date de l'appel</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {new Date(sinister.call_datetime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar-alert" size={20} color={colors.error} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Date du sinistre</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {new Date(sinister.sinister_datetime).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>

            {sinister.context && (
              <View style={styles.contextContainer}>
                <MaterialCommunityIcons name="text-box" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text variant="labelSmall" style={styles.infoLabel}>Contexte</Text>
                  <Text variant="bodyMedium" style={styles.contextText}>
                    {sinister.context}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {sinister.created_at && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Historique</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-plus" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text variant="labelSmall" style={styles.infoLabel}>Date de création</Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {new Date(sinister.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>

              {sinister.updated_at && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-edit" size={20} color={colors.textSecondary} />
                  <View style={styles.infoContent}>
                    <Text variant="labelSmall" style={styles.infoLabel}>Dernière modification</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                      {new Date(sinister.updated_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.actionsContainer}>
        <Button 
          mode="contained" 
          onPress={() => router.push(`/requests?sinister=${sinister.id}` as any)}
          style={styles.actionButton}
        >
          Voir les dossiers associés
        </Button>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textSecondary,
  },
  backButton: {
    paddingHorizontal: 24,
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
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  divider: {
    marginBottom: 16,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    color: colors.text,
    fontWeight: '500',
  },
  infoDescription: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  contextText: {
    color: colors.text,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
});
