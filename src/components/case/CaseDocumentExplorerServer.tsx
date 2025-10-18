import { CaseDocumentExplorer } from './CaseDocumentExplorer';
import { loadCaseDocumentRegistry } from '@/lib/documents/registry';

export async function CaseDocumentExplorerServer() {
  const groups = await loadCaseDocumentRegistry();
  return <CaseDocumentExplorer groups={groups} />;
}
