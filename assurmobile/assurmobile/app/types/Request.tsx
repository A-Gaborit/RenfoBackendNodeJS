export interface Request {
  id: string;
  sinister_id: number;
  status: string;
  responsibility?: number;
  diagnostic?: "REPAIRABLE" | "UNREPAIRABLE";
  closed: boolean;
}