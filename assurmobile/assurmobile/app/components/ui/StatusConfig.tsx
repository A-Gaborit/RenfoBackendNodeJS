export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  description?: string;
}

export function getValidationConfig(validated: boolean): StatusConfig {
  if (validated) {
    return { 
      label: "Validé", 
      color: "#22C55E", 
      bgColor: "#DCFCE7",
      description: "Le sinistre a été validé par l'assurance"
    };
  }
  return { 
    label: "En attente", 
    color: "#FFA500", 
    bgColor: "#FFF4E6",
    description: "Le sinistre est en attente de validation"
  };
}

export function getResponsibilityConfig(responsible: boolean, engaged: number): StatusConfig {
  if (responsible) {
    return {
      label: "Responsable",
      color: "#DC2626",
      bgColor: "#FEE2E2",
      description: `Responsabilité engagée à ${engaged}%`
    };
  }
  return {
    label: "Non responsable",
    color: "#22C55E",
    bgColor: "#DCFCE7",
    description: "Aucune responsabilité engagée"
  };
}
