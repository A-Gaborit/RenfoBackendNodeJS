import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { fetchData } from "@/hooks/fetchData";
import { RequestCard } from "./components/RequestCard";

export default function RequestsListScreen() {
  const [requests, setRequests] = useState([]);
  
    useEffect(() => {
      fetchData('/request', 'GET', {}, true)
        .then(response => {
          setRequests(response.requests);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        {requests.length} dossier{requests.length > 1 ? "s" : ""} de prise en charge
      </Text>

      <View style={{ gap: 16 }}>
        {requests.map((request: any) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </View>
    </ScrollView>
  );
}
