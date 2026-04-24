
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RelativePathString, useRouter } from "expo-router";

import { colors } from "../theme";
import { Sinister } from "../types/Sinister";
import { StatusBadge } from "./ui/StatusBadge";
import { getValidationConfig } from "./ui/StatusConfig";
import { formatDateTime } from "./ui/DateFormatter";


export function SinisterCard({ sinister }: { sinister: Sinister }) {
  const statusConfig = getValidationConfig(sinister.validated);
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/sinisters/${sinister.id}` as RelativePathString)}
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
            <StatusBadge 
              label={statusConfig.label}
              color={statusConfig.color}
              bgColor={statusConfig.bgColor}
            />
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
                {formatDateTime(sinister.sinister_datetime)}
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
