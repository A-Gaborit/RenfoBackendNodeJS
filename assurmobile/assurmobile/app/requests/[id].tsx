import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Divider, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import { Request } from "../types/Request";

function getStatusConfig(status: Request["status"]) {
  const statusMap: Record<string, { label: string; color: string; bgColor: string; description: string }> = {
    INITIATE: { label: "Initialisé", color: "#6B7280", bgColor: "#F3F4F6", description: "Le dossier vient d'être créé" },
    REQUEST_EXPERTISE: { label: "Expertise demandée", color: "#FFA500", bgColor: "#FFF4E6", description: "Une expertise a été demandée" },
    EXPERTISE_PLANNED: { label: "Expertise planifiée", color: "#3B82F6", bgColor: "#EFF6FF", description: "L'expertise est planifiée" },
    EXPERTISE_DONE: { label: "Expertise effectuée", color: "#8B5CF6", bgColor: "#F5F3FF", description: "L'expertise a été réalisée" },
    INTERVENTION_WAITING_PICKUP_SCHEDULE: { label: "Attente planification enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de l'enlèvement" },
    WAITING_PICKUP_SCHEDULE: { label: "Attente planification enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de l'enlèvement" },
    PICKUP_PLANNED: { label: "Enlèvement planifié", color: "#10B981", bgColor: "#D1FAE5", description: "L'enlèvement du véhicule est planifié" },
    INTERVENTION_IN_PROGRESS: { label: "Intervention en cours", color: "#3B82F6", bgColor: "#EFF6FF", description: "L'intervention est en cours" },
    RESTITUTION_WAITING_SCHEDULE: { label: "Attente planification restitution", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de la restitution" },
    RESTITUTION_IN_PROGRESS: { label: "Restitution en cours", color: "#3B82F6", bgColor: "#EFF6FF", description: "La restitution du véhicule est en cours" },
    INVOICE_WAITING: { label: "Attente facturation", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la facturation" },
    INVOICE_PAID_WAITING_WARRANTY: { label: "Facture payée - Attente garantie", color: "#8B5CF6", bgColor: "#F5F3FF", description: "La facture a été payée, attente de la garantie" },
    CLOSURE_DECISION: { label: "Décision de clôture", color: "#6B7280", bgColor: "#F3F4F6", description: "Décision de clôture en cours" },
    INVOICE_THIRD_PARTY_PENDING_CASE1: { label: "Facture tiers en attente", color: "#F59E0B", bgColor: "#FEF3C7", description: "Facture tiers en attente (cas 1)" },
    VALUATION_SENT: { label: "Évaluation envoyée", color: "#8B5CF6", bgColor: "#F5F3FF", description: "L'évaluation a été envoyée" },
    PICKUP_SCHEDULE_WAITING_RIB: { label: "Attente RIB pour enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente du RIB pour planifier l'enlèvement" },
    PICKUP_PLANNED_CASE2: { label: "Enlèvement planifié", color: "#10B981", bgColor: "#D1FAE5", description: "L'enlèvement est planifié (cas 2)" },
    COMPENSATION_WAITING_PAYMENT: { label: "Attente paiement indemnisation", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente du paiement de l'indemnisation" },
    CLOSURE_DECISION_CASE2: { label: "Décision de clôture", color: "#6B7280", bgColor: "#F3F4F6", description: "Décision de clôture (cas 2)" },
    INVOICE_THIRD_PARTY_PENDING_CASE2: { label: "Facture tiers en attente", color: "#F59E0B", bgColor: "#FEF3C7", description: "Facture tiers en attente (cas 2)" },
    CLOSED: { label: "Clôturé", color: "#22C55E", bgColor: "#DCFCE7", description: "Le dossier est clôturé" },
  };
  return statusMap[status] || { label: status.replace(/_/g, " "), color: colors.textSecondary, bgColor: colors.background, description: "Statut inconnu" };
}

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(`/requests/${id}`, 'GET', {}, true)
        .then(response => {
          setRequest(response.request);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setError("Impossible de charger les détails du dossier");
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

  if (error || !request) {
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

  const statusConfig = getStatusConfig(request.status);

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
          <Text variant="titleMedium" style={styles.cardTitle}>Informations générales</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="link" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>Sinistre associé</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>#{request.sinister_id}</Text>
              </View>
            </View>

            {request.diagnostic && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="car-wrench" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text variant="labelSmall" style={styles.infoLabel}>Diagnostic</Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {request.diagnostic === "REPAIRABLE" ? "Réparable" : "Non réparable"}
                  </Text>
                </View>
              </View>
            )}

            {request.responsibility !== undefined && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="percent" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text variant="labelSmall" style={styles.infoLabel}>Responsabilité</Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>{request.responsibility}%</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="check-circle" size={20} color={request.closed ? colors.error : colors.primary} />
              <View style={styles.infoContent}>
                <Text variant="labelSmall" style={styles.infoLabel}>État du dossier</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {request.closed ? "Clôturé" : "En cours"}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {request.created_at && (
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
                    {new Date(request.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>

              {request.updated_at && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-edit" size={20} color={colors.textSecondary} />
                  <View style={styles.infoContent}>
                    <Text variant="labelSmall" style={styles.infoLabel}>Dernière modification</Text>
                    <Text variant="bodyMedium" style={styles.infoValue}>
                      {new Date(request.updated_at).toLocaleDateString('fr-FR', {
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
          mode="outlined" 
          onPress={() => router.push(`/sinisters/${request.sinister_id}` as any)}
          style={styles.actionButton}
        >
          Voir le sinistre associé
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
    alignItems: 'center',
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
  actionsContainer: {
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
});
