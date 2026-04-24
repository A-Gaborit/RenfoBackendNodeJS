import { Document } from "./Document";
import { Request } from "./Request";

export interface Sinister {
  id: string;
  license_plate: string;
  driver_firstname: string;
  driver_lastname: string;
  driver_is_insured: boolean;
  call_datetime: string;
  sinister_datetime: string;
  context?: string;
  driver_responsability: boolean;
  driver_engaged_responsability: number;
  validated: boolean;
  cni_driver?: Document;
  vehicle_registration_certificate?: Document;
  insurance_certificate?: Document;
  request?: Request;
}
