import { View, Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
  label: string;
  color: string;
  bgColor: string;
}

export function StatusBadge({ label, color, bgColor }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  text: {
    fontWeight: "600",
    fontSize: 12,
  },
});
