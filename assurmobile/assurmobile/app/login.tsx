import { Text, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const login = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            console.log('login',response);
            if (response.ok) setError("Echec de connexion");
            setError(null);
            const { token } = await response.json();
            await AsyncStorage.setItem('token', token);
        } catch (error: any) {
            console.log('Login error', error);
            setError(error.message);
        }
    };

    return (
        <View>
            <Card>
                <Card.Content>
                    <Text>Connexion</Text>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <HelperText type="error" visible={Boolean(error)}>
                        {error}
                    </HelperText>
                    <Button 
                        mode="contained" 
                        onPress={login}
                    >
                        Se connecter
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

