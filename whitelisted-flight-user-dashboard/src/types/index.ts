export interface Airline {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface WhitelistedEmail {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  enabledAirlines: string[]; // Array of airline IDs
}

export interface EmailFormData {
  email: string;
  name: string;
  enabledAirlines: string[];
}

