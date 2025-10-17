export interface Task {
  id: string;
  label: string;
  hint?: string;
  link?: string;
  done?: boolean;
}

export interface ChecklistData {
  tasks: Task[];
  deadline: string;
}
