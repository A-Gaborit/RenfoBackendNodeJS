import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { fetchData } from "../hooks/fetchData";
import { SinisterCard } from "./components/SinisterCard";

export default function SinistersListScreen() {
  const [sinisters, setSinisters] = useState([]);

  useEffect(() => {
    fetchData('/sinister', 'GET', {}, true)
      .then(response => {
        setSinisters(response.sinisters);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        {sinisters.length} sinistre{sinisters.length > 1 ? "s" : ""} déclaré{sinisters.length > 1 ? "s" : ""}
      </Text>

      <View style={{ gap: 16 }}>
        {sinisters.map((sinister: any) => (
          <SinisterCard key={sinister.id} sinister={sinister} />
        ))}
      </View>
    </ScrollView>
  );
}