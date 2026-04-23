import { useContext, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Card, HelperText, Text, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

import { colors } from "./theme";

import { AppButton } from "./components/AppButton";
import { AppInput } from "./components/AppInput";

import { UserContext } from "@/contexts/UserContext";

export default function LoginScreen() {
    const router = useRouter(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useContext(UserContext)!;

    const login = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (!response.ok) {
                setError("Identifiants incorrects");
                return;
            }
            const { token } = await response.json();
            await AsyncStorage.setItem('token', token); 
            const { user } = jwtDecode(token);
            setUser(user);
            router.push('/');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/logo-assurmoi.png')} style={styles.logo} />
            <Text variant="bodyMedium" style={styles.subtitle}>Connectez-vous pour accéder à votre espace</Text>
            <Card style={styles.card}>
                <Card.Content style={{ gap: 12 }}>
                    <Text variant="headlineSmall" style={styles.title}>Connexion</Text>
                    <AppInput
                        placeholder="Email"
                        onChangeText={setEmail}
                        icon="email"
                    />
                    <AppInput
                        placeholder="Mot de passe"
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        icon="lock"
                        rightIcon={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                color={colors.textSecondary}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />
                    <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: colors.primaryDark, fontSize: 14 }}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                    {error && 
                        <HelperText type="error" visible={Boolean(error)} style={{ color: colors.error }}>
                            {error}
                        </HelperText>
                    }
                    <AppButton onPress={login}>Se connecter</AppButton>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    },
    title: {
        textAlign: 'center',
        color: colors.primary,
        fontWeight: '600',
    },
});