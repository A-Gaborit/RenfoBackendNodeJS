import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { colors } from "../theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SectionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}


export function SectionCard({ title, subtitle, icon, color, onPress }: SectionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.sectionCard}>
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <MaterialCommunityIcons name={icon as any} size={32} color={color} />
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
            <Text variant="bodyMedium" style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    sectionCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: colors.white,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        color: colors.text,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});