import { View, StyleSheet } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { ReactNode } from "react";
import { colors } from "../../theme";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
        <Divider style={styles.divider} />
        <View style={styles.content}>
          {children}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  content: {
    gap: 16,
  },
});
