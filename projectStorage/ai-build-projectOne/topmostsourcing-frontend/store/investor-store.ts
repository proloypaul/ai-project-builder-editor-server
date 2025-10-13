import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InvestorData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  totalInvestment: string;
  totalReturns: string;
  pendingReturns: string;
  withdrawableAmount: string;
  publicId: string;
}

export interface InvestorStore {
  investorData: InvestorData | null;
  setInvestorData: (investorData: InvestorData | null) => void;
}

export const useInvestorStore = create<InvestorStore>()(
  persist<InvestorStore>(
    (set) => ({
      investorData: null,
      setInvestorData: (investorData: InvestorData | null) =>
        set(() => ({ investorData })),
    }),
    {
      name: "investor-store",
    }
  )
);
