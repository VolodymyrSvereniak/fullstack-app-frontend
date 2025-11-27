export interface Client {
  id?: number;
  name: string;
  email: string;
  job: string;
  rate: number | string;
  is_active: boolean;
}

export type Mode = "add" | "edit";
