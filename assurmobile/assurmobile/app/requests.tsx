import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
import { fetchData } from "@/hooks/fetchData";
import { colors } from "./theme";
import { RequestCard } from "./components/RequestCard";
import { ErrorState } from "./components/ui/ErrorState";

export default function RequestsListScreen() {
  const router = useRouter();
  const { sinister } = useLocalSearchParams<{ sinister?: string }>();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const endpoint = sinister ? `/request?sinister=${sinister}` : '/request';
      fetchData(endpoint, 'GET', {}, true)
        .then(response => {
          setRequests(response.requests);
        })
        .catch(error => {
          setError(error.message);
        });
    }, [sinister]);

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
      {sinister && (
        <Text variant="titleMedium" style={{ marginBottom: 8, color: colors.primary }}>
          Dossiers du sinistre n°{sinister}
        </Text>
      )}
      {requests && requests.length > 0 ? (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          {requests.length} dossier{requests.length > 1 ? "s" : ""} de prise en charge
        </Text>
      ) : (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          {sinister ? "Aucun dossier pour ce sinistre" : "Vous n'avez aucun dossier de prise en charge"}
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
