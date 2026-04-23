
import { Card, Text, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { colors } from "../theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Sinister } from "../types/Sinister";

function getValidationConfig(validated: boolean) {
  if (validated) return { label: "Validé", color: "#22C55E", bgColor: "#DCFCE7" };
  return { label: "En attente", color: "#FFA500", bgColor: "#FFF4E6" };
}


export function SinisterCard({ sinister }: { sinister: Sinister }) {
  const statusConfig = getValidationConfig(sinister.validated);
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/sinisters/${sinister.id}` as any)}
      activeOpacity={0.8}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.vehicleInfo}>
              <MaterialCommunityIcons name="car" size={20} color={colors.primary} />
              <Text variant="titleMedium" style={styles.vehiclePlate}>
                {sinister.license_plate}
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
              <MaterialCommunityIcons name="account" size={16} color={colors.textSecondary} />
              <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                {sinister.driver_firstname} {sinister.driver_lastname}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="shield-check" size={16} color={colors.textSecondary} />
              <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                {sinister.driver_is_insured ? "Assuré" : "Non assuré"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
              <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                {sinister.sinister_datetime}
              </Text>
            </View>
          </View>

          {sinister.context && (
            <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
              {sinister.context}
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 2,
    backgroundColor: colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vehiclePlate: {
    color: colors.text,
    fontWeight: "600",
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
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  description: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});
