import { colors } from "../../theme";
import { Request } from "../../types/Request";

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export function getRequestStatusConfig(status: Request["status"]): StatusConfig {
  const statusMap: Record<string, StatusConfig> = {
    INITIATE: { label: "Initialisé", color: "#443d3dbe", bgColor: "#b1b0b09d", description: "Le dossier vient d'être créé" },
    REQUEST_EXPERTISE: { label: "Expertise demandée", color: "#FFA500", bgColor: "#FFF4E6", description: "Une expertise a été demandée" },
    EXPERTISE_PLANNED: { label: "Expertise planifiée", color: "#3B82F6", bgColor: "#EFF6FF", description: "L'expertise est planifiée" },
    EXPERTISE_DONE: { label: "Expertise effectuée", color: "#8B5CF6", bgColor: "#F5F3FF", description: "L'expertise a été réalisée" },
    INTERVENTION_WAITING_PICKUP_SCHEDULE: { label: "Attente planification enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de l'enlèvement" },
    WAITING_PICKUP_SCHEDULE: { label: "Attente planification enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de l'enlèvement" },
    PICKUP_PLANNED: { label: "Enlèvement planifié", color: "#10B981", bgColor: "#D1FAE5", description: "L'enlèvement du véhicule est planifié" },
    INTERVENTION_IN_PROGRESS: { label: "Intervention en cours", color: "#3B82F6", bgColor: "#EFF6FF", description: "L'intervention est en cours" },
    RESTITUTION_WAITING_SCHEDULE: { label: "Attente planification restitution", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la planification de la restitution" },
    RESTITUTION_IN_PROGRESS: { label: "Restitution en cours", color: "#3B82F6", bgColor: "#EFF6FF", description: "La restitution du véhicule est en cours" },
    INVOICE_WAITING: { label: "Attente facturation", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente de la facturation" },
    INVOICE_PAID_WAITING_WARRANTY: { label: "Facture payée - Attente garantie", color: "#8B5CF6", bgColor: "#F5F3FF", description: "La facture a été payée, attente de la garantie" },
    CLOSURE_DECISION: { label: "Décision de clôture", color: "#6B7280", bgColor: "#F3F4F6", description: "Décision de clôture en cours" },
    INVOICE_THIRD_PARTY_PENDING_CASE1: { label: "Facture tiers en attente", color: "#F59E0B", bgColor: "#FEF3C7", description: "Facture tiers en attente (cas 1)" },
    VALUATION_SENT: { label: "Évaluation envoyée", color: "#8B5CF6", bgColor: "#F5F3FF", description: "L'évaluation a été envoyée" },
    PICKUP_SCHEDULE_WAITING_RIB: { label: "Attente RIB pour enlèvement", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente du RIB pour planifier l'enlèvement" },
    PICKUP_PLANNED_CASE2: { label: "Enlèvement planifié", color: "#10B981", bgColor: "#D1FAE5", description: "L'enlèvement est planifié (cas 2)" },
    COMPENSATION_WAITING_PAYMENT: { label: "Attente paiement indemnisation", color: "#F59E0B", bgColor: "#FEF3C7", description: "En attente du paiement de l'indemnisation" },
    CLOSURE_DECISION_CASE2: { label: "Décision de clôture", color: "#6B7280", bgColor: "#F3F4F6", description: "Décision de clôture (cas 2)" },
    INVOICE_THIRD_PARTY_PENDING_CASE2: { label: "Facture tiers en attente", color: "#F59E0B", bgColor: "#FEF3C7", description: "Facture tiers en attente (cas 2)" },
    CLOSED: { label: "Clôturé", color: "#22C55E", bgColor: "#DCFCE7", description: "Le dossier est clôturé" },
  };
  return statusMap[status] || { label: status.replace(/_/g, " "), color: colors.textSecondary, bgColor: colors.background, description: "Statut inconnu" };
}
