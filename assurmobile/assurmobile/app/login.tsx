import { Text, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import { useState } from "react";

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
        } catch (error: any) {
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

