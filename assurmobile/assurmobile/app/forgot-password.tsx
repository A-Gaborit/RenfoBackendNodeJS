import { useState } from "react";
import { useRouter } from "expo-router";

import { AuthCard } from "./components/AuthCard";
import { AppInput } from "./components/ui/AppInput";
import { fetchData } from "../hooks/fetchData";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const forgotPassword = async () => {
        try {
            setError(null);
            setSuccess(null);
            
            if (!email) {
                setError("Veuillez entrer votre email");
                return;
            }

            await fetchData('/auth/forgot-password', 'POST', { email }, false);
            setSuccess("Un email de réinitialisation a été envoyé");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <AuthCard 
            title="Mot de passe oublié" 
            subtitle="Réinitialisez votre mot de passe"
            description="Entrez votre email pour recevoir un lien de réinitialisation"
            error={error}
            success={success}
            primaryButton={{ label: "Envoyer le lien", onPress: forgotPassword }}
            secondaryButton={{ label: "Retour à la connexion", onPress: () => router.push('/login') }}
        >
            <AppInput
                placeholder="Email"
                onChangeText={setEmail}
                icon="email"
            />
        </AuthCard>
    );
}