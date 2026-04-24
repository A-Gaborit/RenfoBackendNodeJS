import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme";
import { AppButton } from "../ui/AppButton";

interface ErrorStateProps {
  title: string;
  message?: string;
  onBack?: () => void;
  backText?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
}

export function ErrorState({ 
  title, 
  message, 
  onBack, 
  backText = "Réessayer", 
  icon = "alert-circle", 
  iconColor = colors.error 
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={35} color={iconColor} />
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      {message && (
        <Text variant="bodyMedium" style={styles.message}>{message}</Text>
      )}
      {onBack && (
        <AppButton onPress={onBack} style={styles.button}>
          {backText}
        </AppButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 12,
    color: colors.textSecondary,
  },
  button: {
    marginTop: 12,
  },
});
