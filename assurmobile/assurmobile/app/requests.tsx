import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, RelativePathString } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { RequestCard } from "./components/RequestCard";
import { ErrorState } from "./components/ui/ErrorState";

export default function RequestsListScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetchData('/request', 'GET', {}, true)
        .then(response => {
          setRequests(response.requests);
        })
        .catch(error => {
          setError(error.message);
        });
    }, []);

  if (error) {
    return (
      <ErrorState 
        title="Erreur de chargement"
        message={error}
        onBack={() => router.push('/' as RelativePathString)}
        backText="Retour à l'accueil"
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {requests && requests.length > 0 ? (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          {requests.length} dossier{requests.length > 1 ? "s" : ""} de prise en charge
        </Text>
      ) : (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          Vous n'avez aucun dossier de prise en charge
        </Text>
      )}

      <View style={{ gap: 16 }}>
        {requests && requests.map((request: any) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </View>
    </ScrollView>
  );
}
