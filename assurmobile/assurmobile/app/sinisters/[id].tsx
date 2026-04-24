import { fetchBlob, fetchData, fetchDocument } from "@/hooks/fetchData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, ScrollView, StyleSheet, Platform, TouchableOpacity,Linking } from "react-native";
import { Text, HelperText} from "react-native-paper";
import { useEffect, useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";

import { colors } from "../theme";
import { Sinister } from "../types/Sinister";

import { getValidationConfig, getResponsibilityConfig } from "../components/ui/StatusConfig";
import { InfoCard } from "../components/ui/InfoCard";
import { InfoRow } from "../components/ui/InfoRow";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatDate } from "../components/ui/DateFormatter";
import { ErrorState } from "../components/ui/ErrorState";
import { AppButton } from "../components/ui/AppButton";

type DocumentType = 'CNI_DRIVER' | 'VEHICLE_REGISTRATION' | 'INSURANCE_CERTIFICATE';

type DocumentState = {
  type: DocumentType;
  label: string;
  file: DocumentPicker.DocumentPickerAsset | null;
}

export default function SinisterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sinister, setSinister] = useState<Sinister | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentState[]>([
    { type: 'CNI_DRIVER', label: "Pièce d'identité du conducteur", file: null },
    { type: 'VEHICLE_REGISTRATION', label: "Carte grise du véhicule", file: null },
    { type: 'INSURANCE_CERTIFICATE', label: "Attestation d'assurance", file: null },
  ]);

  const existingDocMap: Record<any, any> = {
      CNI_DRIVER: sinister?.cniDriver,
      VEHICLE_REGISTRATION: sinister?.vehicleRegistrationCertificate,
      INSURANCE_CERTIFICATE: sinister?.insuranceCertificate,
  };

  const pickDocument = async (index: number) => {
    const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
    })
    if(result.canceled) {
        return;
    }
    const newDocuments = [...documents];
    newDocuments[index].file = result.assets[0];
    setDocuments(newDocuments);
  }

  const refreshSinister = () => {
    if (id) {
    fetchData(`/sinister/${id}`, 'GET', {}, true)
      .then(response => {
          setSinister(response.sinister);
      })
      .catch(error => {
          setUploadError(error.message);
      });
    }
  };

  const submitDocument = (index: number) => {
    const doc = documents[index];
    const formData = new FormData();
    formData.append("type", doc.type);
    if(doc.file) {
        if(Platform.OS === "web") {
            const webfile = (doc.file as DocumentPicker.DocumentPickerAsset & {file?: File}).file;
            if (webfile) formData.append("file", webfile)
        } else {
            formData.append("file", {
                uri: doc.file.uri,
                name: doc.file.name,
                type: doc.file.mimeType || 'application/octet-stream'
            } as unknown as Blob)
        }
        setUploadError(null);
        fetchDocument('/sinister/'+id+'/document', 'POST', formData, true)
            .then(response => {
                const newDocuments = [...documents];
                newDocuments[index].file = null;
                setDocuments(newDocuments);
                refreshSinister();
            })
            .catch(error => {
                setUploadError(error.message)
            })
    } else {
        setUploadError('Pas de fichier sélectionné');
    }
  }

  useEffect(() => {
    if (id) {
      fetchData(`/sinister/${id}`, 'GET', {}, true)
        .then(response => {
          setSinister(response.sinister);
        })
        .catch(error => {
          setError(error.message);
        });
    }
  }, [id]);

  if (error || !sinister) {
    return (
      <ErrorState 
        title="Le sinistre est introuvable !"
        message={error || undefined}
        onBack={() => router.push('/sinisters' as RelativePathString)}
        backText="Retour"
      />
    );
  }
  const viewDocument = async (path: string) => {
    try {
        const blob = await fetchBlob(`/sinister/download-docs/${path}`, true);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error: any) {
        setUploadError(error.message);
    }
  };

  const statusConfig = getValidationConfig(sinister.validated);
  const responsibilityConfig = getResponsibilityConfig(sinister.driver_responsability, sinister.driver_engaged_responsability);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="car" size={28} color={colors.primary} />
            <Text variant="headlineMedium" style={styles.title}>
              {sinister.license_plate}
            </Text>
          </View>
          <StatusBadge 
            label={statusConfig.label}
            color={statusConfig.color}
            bgColor={statusConfig.bgColor}
          />
        </View>
        <Text variant="bodySmall" style={styles.statusDescription}>
          {statusConfig.description}
        </Text>
      </View>

      <InfoCard title="Informations conducteur">
        <InfoRow 
          icon="account"
          label="Nom complet"
          value={`${sinister.driver_firstname} ${sinister.driver_lastname}`}
        />
        <InfoRow 
          icon="shield-check"
          label="Statut d'assurance"
          value={sinister.driver_is_insured ? "Assuré" : "Non assuré"}
          iconColor={sinister.driver_is_insured ? "#22C55E" : colors.error}
        />
        <InfoRow 
          icon="gavel"
          label="Responsabilité"
          value={responsibilityConfig.label}
          description={responsibilityConfig.description}
          iconColor={responsibilityConfig.color}
        />
      </InfoCard>

      <InfoCard title="Détails du sinistre">
        <InfoRow 
          icon="phone"
          label="Date de l'appel"
          value={formatDate(sinister.call_datetime)}
        />
        <InfoRow 
          icon="calendar-alert"
          label="Date du sinistre"
          value={formatDate(sinister.sinister_datetime)}
          iconColor={colors.error}
        />
        {sinister.context && (
          <InfoRow 
            icon="text-box"
            label="Contexte"
            value={sinister.context}
          />
        )}
      </InfoCard>

     <InfoCard title="Documents requis">
        {documents.map((doc, index) => {
            const existing = existingDocMap[doc.type];
            return (
                <View key={doc.type} style={[
                    styles.documentRow,
                    existing?.validated && styles.documentRowSuccess
                ]}>
                    <View style={styles.documentLabelRow}>
                        <Text variant="bodyMedium" style={styles.documentLabel}>{doc.label}</Text>
                        {existing && (
                            <StatusBadge
                                label={existing.validated ? "Reçu ✓" : "En attente"}
                                color={existing.validated ? "#15803D" : "#B45309"}
                                bgColor={existing.validated ? "#86EFAC" : "#FEF3C7"}
                            />
                        )}
                    </View>
                    <View style={styles.documentUploadRow}>
                        {existing?.validated ? (
                            <TouchableOpacity
                                style={styles.viewDocumentButton}
                                onPress={() => viewDocument(existing.path)}
                            >
                                <MaterialCommunityIcons name="file-check" size={20} color="#15803D" />
                                <Text variant="bodySmall" style={styles.viewDocumentText}>
                                    Document reçu - Cliquez pour visualiser
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[
                                        styles.fileSelector,
                                        existing && styles.fileSelectorPending
                                    ]}
                                    onPress={() => pickDocument(index)}
                                >
                                    <MaterialCommunityIcons
                                        name={existing ? "file-sync" : "cloud-upload-outline"}
                                        size={20}
                                        color={existing ? "#B45309" : colors.primary}
                                    />
                                    <Text
                                        variant="bodySmall"
                                        style={[
                                            styles.fileNameText,
                                            existing && { color: "#B45309" }
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="middle"
                                    >
                                        {doc.file ? doc.file.name : (existing ? 'Remplacer le fichier' : 'Choisir un fichier')}
                                    </Text>
                                </TouchableOpacity>
                                {doc.file && (
                                    <TouchableOpacity
                                        style={styles.sendButton}
                                        onPress={() => submitDocument(index)}
                                    >
                                        <MaterialCommunityIcons name="send" size={18} color={colors.white} />
                                    </TouchableOpacity>
                                )}
                                {existing && !doc.file && (
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={() => viewDocument(existing.path)}
                                    >
                                        <MaterialCommunityIcons name="eye" size={18} color="#B45309" />
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </View>
                </View>
            );
        })}
        <HelperText type="error" visible={Boolean(uploadError)}>
          {uploadError}
        </HelperText>
      </InfoCard>

      {sinister.validated && <AppButton
        onPress={() => router.push(`/requests?sinister=${sinister.id}` as any)}
      >
        Voir les dossiers associés
      </AppButton>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: colors.text,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  documentRow: {
    gap: 8,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  documentRowSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  documentLabel: {
    fontWeight: '500',
    color: colors.text,
  },
  documentUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  fileSelectorPending: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  fileNameText: {
    flex: 1,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 46,
  },
  documentLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 46,
  },
  viewDocumentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 10,
  },
  viewDocumentText: {
    flex: 1,
    color: '#15803D',
    fontWeight: '500',
  },
});
