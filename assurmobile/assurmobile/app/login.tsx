import { useContext, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

import { colors } from "./theme";

import { AuthCard } from "./components/AuthCard";
import { AppInput } from "./components/ui/AppInput";

import { UserContext } from "@/contexts/UserContext";
import { fetchData } from "@/hooks/fetchData";

type JwtPayload = {
    user: {}
}

export default function LoginScreen() {
    const router = useRouter(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useContext(UserContext)!;

    const login = async () => {
        try {
            const { token } = await fetchData('/auth/login', 'POST', {
                email,
                password,
            }, false)
            await AsyncStorage.setItem('token', token)
            const { user } = jwtDecode<JwtPayload>(token)
            setUser(user)
            setError(null)
            router.push({ pathname: '/' })
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <AuthCard 
            title="Connexion" 
            subtitle="Connectez-vous pour accéder à votre espace"
            error={error}
            primaryButton={{ label: "Se connecter", onPress: login }}
        >
            <AppInput
                placeholder="Email"
                onChangeText={setEmail}
                icon="email"
            />
            <AppInput
                placeholder="Mot de passe"
                onChangeText={setPassword}
                secureTextEntry={true}
                icon="lock"
                showPasswordToggle={true}
            />
            <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => router.push('/forgot-password' as any)}>
                <Text style={{ color: colors.primaryDark, fontSize: 14 }}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
        </AuthCard>
    );
}