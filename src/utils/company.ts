import { useAuthStore } from "../store/auth.store";

export function getCompanyId(): string {
  const companyId = useAuthStore.getState().user?.companyId;

  if (!companyId) {
    throw new Error("CompanyId bulunamadı");
  }

  return companyId;
}
