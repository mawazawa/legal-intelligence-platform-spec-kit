import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ChecklistEditorProps {
  markdownContent: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export const ChecklistEditor = React.memo<ChecklistEditorProps>(({
  markdownContent,
  onChange,
  onSave,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="markdown-content" className="text-sm font-semibold text-slate-700">
        Edit Checklist (Markdown Format)
      </Label>
      <textarea
        id="markdown-content"
        value={markdownContent}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[600px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter markdown checklist content..."
      />
      <div className="flex gap-2">
        <Button onClick={onSave}>Save Changes</Button>
        <Button variant="outline" onClick={onReset}>
          Reset to Template
        </Button>
      </div>
    </div>
  );
});

ChecklistEditor.displayName = 'ChecklistEditor';
