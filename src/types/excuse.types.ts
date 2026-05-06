import { Timestamp } from "firebase/firestore";

export type ExcuseType = "late" | "early";

export type ExcuseStatus = "pending" | "approved" | "rejected";

export interface Excuse {
  id: string;
  userId: string;
  companyId: string;
  type: ExcuseType;
  description: string;
  date: Date;
  createdAt: Date;
  status: ExcuseStatus;
}

export type ExcuseDoc = {
  userId: string;
  type: ExcuseType;
  description: string;
  date: Timestamp;
  createdAt: Timestamp;
  status: ExcuseStatus;
};

export type CreateExcuseInput = {
  userId: string;
  type: ExcuseType;
  description: string;
};
