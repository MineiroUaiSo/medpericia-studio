import React, { createContext, useContext } from 'react';

export const TEST_CASE_ID = 'teste';

const CaseContext = createContext<string>(TEST_CASE_ID);

export const CaseProvider = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <CaseContext.Provider value={id}>{children}</CaseContext.Provider>
);

export const useCaseId = () => useContext(CaseContext);

export const caseKey = (caseId: string, field: string) => `medpericia:${caseId}:${field}`;

/** Remove todos os dados salvos de um caso. */
export function clearCaseData(caseId: string): void {
  try {
    const prefix = caseKey(caseId, '');
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // storage indisponível
  }
}
