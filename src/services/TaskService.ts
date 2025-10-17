import { Task } from '@/types/Task';

export class TaskService {
  private static readonly STORAGE_KEY = 'fl320-todo-v1';

  static getDefaultTasks(): Task[] {
    return [
      { id: 'fl320_form', label: 'Draft FL‑320 Responsive Declaration', link: '/fl320-checklist' },
      { id: 'mpa', label: 'Memo of Points and Authorities', hint: 'Attach legal argument brief', link: '/rfo-comparison' },
      { id: 'decl_counsel', label: 'Declaration by Counsel', hint: 'Signed attorney declaration' },
      { id: 'decl_party', label: 'Declaration by Respondent', hint: 'Signed personal declaration', link: '/final-distribution' },
      { id: 'signature', label: 'Signatures Collected', hint: 'E‑signature or wet signature on all declarations', link: '/final-distribution' },
      { id: 'exhibit_index', label: 'Exhibit Index Generated', hint: 'Auto‑numbered list', link: '/exhibits/packet' },
      { id: 'exhibits_ready', label: 'Exhibits Attached', hint: 'All exhibits linked to claims' },
      { id: 'proof_service', label: 'Proof of Service Prepared', hint: 'Serve opposing party' },
      { id: 'deadline_set', label: 'Deadline Set', hint: 'Track hearing/filing dates' },
      { id: 'final_packet', label: 'Assemble Filing Packet (PDF)', hint: 'Binder with exhibit tabs (optional next step)' },
    ];
  }

  static async checkTaskCompletion(taskId: string): Promise<boolean> {
    try {
      switch (taskId) {
        case 'exhibit_index':
          const ex = await fetch('/api/exhibits/list');
          if (ex.ok) {
            const j = await ex.json();
            return (j?.exhibits?.length || 0) > 0;
          }
          return false;
        case 'fl320_form':
          const lr = await fetch('/api/case-financials/ledger', { cache: 'no-store' });
          return lr.ok;
        default:
          return false;
      }
    } catch {
      return false;
    }
  }
}
