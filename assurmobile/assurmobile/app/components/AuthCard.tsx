import { ReactNode } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Card, Text, HelperText } from "react-native-paper";

import { colors } from "../theme";
import { AppButton } from "./ui/AppButton";

export function AuthCard({ 
    title, 
    subtitle, 
    description, 
    error,
    success,
    primaryButton,
    secondaryButton,
    children 
}: { 
    title: string; 
    subtitle?: string; 
    description?: string;
    error?: string | null;
    success?: string | null;
    primaryButton?: { label: string; onPress: () => void };
    secondaryButton?: { label: string; onPress: () => void };
    children?: ReactNode;
}) {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo-assurmoi.png')} style={styles.logo} />
            {subtitle && <Text variant="bodyMedium" style={styles.subtitle}>{subtitle}</Text>}
            <Card style={styles.card}>
                <Card.Content style={{ gap: 12 }}>
                    <Text variant="headlineSmall" style={styles.title}>{title}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                    {children}
                    {error && 
                        <HelperText type="error" visible={true} style={{ color: colors.error }}>
                            {error}
                        </HelperText>
                    }
                    {success && 
                        <HelperText type="info" visible={true} style={{ color: colors.success }}>
                            {success}
                        </HelperText>
                    }     
                    {primaryButton && (
                        <AppButton onPress={primaryButton.onPress}>
                            {primaryButton.label}
                        </AppButton>
                    )}
                    {secondaryButton && (
                        <AppButton onPress={secondaryButton.onPress} mode="outlined">
                            {secondaryButton.label}
                        </AppButton>
                    )}
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    logo: {
        marginBottom: 12,
        height: 80,
        resizeMode: 'contain',
    },
    subtitle: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 16,
        marginBottom: 32,
    },
    card: {
        borderRadius: 16,
        elevation: 4,
        backgroundColor: colors.white,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        textAlign: 'center',
        color: colors.primary,
        fontWeight: '600',
    },
    description: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 16,
    },
});
