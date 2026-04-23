export interface Request {
  id: string;
  sinister_id: number;
  status: string;
  responsibility?: number;
  diagnostic?: "REPAIRABLE" | "UNREPAIRABLE";
  closed: boolean;
  created_at?: string;
  updated_at?: string;
}