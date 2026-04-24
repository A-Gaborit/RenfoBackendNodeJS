import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useRouter, RelativePathString } from "expo-router";
import { fetchData } from "../hooks/fetchData";
import { SinisterCard } from "./components/SinisterCard";
import { ErrorState } from "./components/ui/ErrorState";

export default function SinistersListScreen() {
  const router = useRouter();
  const [sinisters, setSinisters] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData('/sinister', 'GET', {}, true)
      .then(response => {
        setSinisters(response.sinisters);
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
      {sinisters && sinisters.length > 0 ? (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          Vous avez {sinisters.length} sinistre{sinisters.length > 1 ? "s" : ""} déclaré{sinisters.length > 1 ? "s" : ""}
        </Text>
      ) : (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          Vous n'avez déclaré aucun sinistre
        </Text>
      )}

      <View style={{ gap: 16 }}>
        {sinisters && sinisters.map((sinister: any) => (
          <SinisterCard key={sinister.id} sinister={sinister} />
        ))}
      </View>
    </ScrollView>
  );
}