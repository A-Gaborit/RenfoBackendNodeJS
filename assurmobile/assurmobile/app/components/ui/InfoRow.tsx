import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme";

interface InfoRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  description?: string;
  iconColor?: string;
}

export function InfoRow({ 
  icon, 
  label, 
  value, 
  description, 
  iconColor = colors.textSecondary 
}: InfoRowProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      <View style={styles.content}>
        <Text variant="labelSmall" style={styles.label}>{label}</Text>
        <Text variant="bodyMedium" style={styles.value}>{value}</Text>
        {description && (
          <Text variant="bodySmall" style={styles.description}>{description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    color: colors.text,
    fontWeight: '500',
  },
  description: {
    color: colors.textSecondary,
    marginTop: 2,
  },
});
