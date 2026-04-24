import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { AuthCard } from "./components/AuthCard";
import { AppInput } from "./components/ui/AppInput";
import { fetchData } from "../hooks/fetchData";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetPassword = async () => {
        try {
            setError(null);
            setSuccess(null);

            if (!password || !confirmPassword) {
                setError("Veuillez remplir tous les champs");
                return;
            }

            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas");
                return;
            }

            if (password.length < 6) {
                setError("Le mot de passe doit contenir au moins 6 caractères");
                return;
            }

            await fetchData('/auth/reset-password', 'POST', {
                token,
                password,
            }, false);

            setSuccess("Mot de passe réinitialisé avec succès");
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <AuthCard 
            title="Nouveau mot de passe" 
            subtitle="Réinitialisez votre mot de passe"
            description="Choisissez votre nouveau mot de passe"
            error={error}
            success={success}
            primaryButton={{ label: "Réinitialiser le mot de passe", onPress: resetPassword }}
            secondaryButton={{ label: "Retour à la connexion", onPress: () => router.push('/login') }}
        >
            <AppInput
                placeholder="Nouveau mot de passe"
                onChangeText={setPassword}
                secureTextEntry={true}
                icon="lock"
                showPasswordToggle={true}
                value={password}
            />
            <AppInput
                placeholder="Confirmer le mot de passe"
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                icon="lock"
                showPasswordToggle={true}
                value={confirmPassword}
            />
        </AuthCard>
    );
}
