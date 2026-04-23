import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { colors } from "../theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Request } from "../types/Request";

function getStatusConfig(status: Request["status"]) {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    INITIATE: { label: "Initialisé", color: "#6B7280", bgColor: "#F3F4F6" },
    REQUEST_EXPERTISE: { label: "Expertise demandée", color: "#FFA500", bgColor: "#FFF4E6" },
    EXPERTISE_PLANNED: { label: "Expertise planifiée", color: "#3B82F6", bgColor: "#EFF6FF" },
    EXPERTISE_DONE: { label: "Expertise effectuée", color: "#8B5CF6", bgColor: "#F5F3FF" },
    INTERVENTION_WAITING_PICKUP_SCHEDULE: { label: "Attente planification enlèvement", color: "#F59E0B", bgColor: "#FEF3C7" },
    CLOSED: { label: "Clôturé", color: "#22C55E", bgColor: "#DCFCE7" },
  };
  return statusMap[status] || { label: status.replace(/_/g, " "), color: colors.textSecondary, bgColor: colors.background };
}

export function RequestCard({ request }: { request: Request }) {
  const statusConfig = getStatusConfig(request.status);
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/requests/${request.id}` as any)}
      activeOpacity={0.8}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="file-document" size={24} color={colors.primary} />
              </View>
              <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                Dossier #{request.id}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 6 }} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="link" size={16} color={colors.textSecondary} />
              <Text variant="bodyMedium" style={styles.detailText}>
                Sinistre #{request.sinister_id}
              </Text>
            </View>
            {request.diagnostic && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="car-wrench" size={16} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {request.diagnostic === "REPAIRABLE" ? "Réparable" : "Non réparable"}
                </Text>
              </View>
            )}
            {request.responsibility !== undefined && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="percent" size={16} color={colors.textSecondary} />
                <Text variant="bodyMedium" style={styles.detailText}>
                  Responsabilité: {request.responsibility}%
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontWeight: "600",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: colors.textSecondary,
  },
});