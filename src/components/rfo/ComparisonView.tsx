"use client";

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  MessageCircle,
  XCircle
} from 'lucide-react';

interface ComparisonPoint {
  id: string;
  title: string;
  presentedBy: 'Petitioner' | 'Attorney';
  petitionerClaim: string;
  respondentRebuttal: string;
  evidence: string[];
  feedback: string[];
  status: 'disputed' | 'conceded' | 'neutral';
  pageRefs: {
    petitioner: string;
    respondent: string;
  };
  clarifyingPrompts?: string[];
}

interface ComparisonViewProps {
  comparisonPoints: ComparisonPoint[];
}

const ComparisonView = React.memo<ComparisonViewProps>(({ comparisonPoints }) => {
  const initialPointId = useMemo(
    () => comparisonPoints[0]?.id ?? null,
    [comparisonPoints]
  );
  const [activePointId, setActivePointId] = useState<string | null>(initialPointId);
  const [feedbackPointId, setFeedbackPointId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState('');
  const [loggedQuestions, setLoggedQuestions] = useState<Record<string, string[]>>({});

  const activePoint =
    comparisonPoints.find(point => point.id === activePointId) ?? comparisonPoints[0] ?? null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disputed':
        return <Badge variant="destructive" className="text-xs">DISPUTED</Badge>;
      case 'conceded':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">CONCEDED</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">NEUTRAL</Badge>;
    }
  };

  const getPresentedByClass = (presentedBy: ComparisonPoint['presentedBy']) =>
    presentedBy === 'Attorney'
      ? 'text-purple-600 border-purple-200 bg-purple-50'
      : 'text-rose-600 border-rose-200 bg-rose-50';

  const getStatusIcon = (status: string) => {
    if (status === 'disputed') return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === 'conceded') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const handleSubmitQuestion = () => {
    if (!activePoint) return;
    const trimmed = questionDraft.trim();
    if (!trimmed) return;

    setLoggedQuestions(prev => {
      const existing = prev[activePoint.id] ?? [];
      return {
        ...prev,
        [activePoint.id]: [...existing, trimmed]
      };
    });
    setQuestionDraft('');
  };

  const feedbackPoint = feedbackPointId
    ? comparisonPoints.find(point => point.id === feedbackPointId)
    : null;

  return (
    <div
      role="tabpanel"
      id="comparison-tabpanel"
      aria-labelledby="comparison-tab"
      className="space-y-6"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <section
          className="relative bg-white border border-rose-200 shadow-sm rounded-xl p-6 overflow-hidden flex flex-col gap-4"
          style={{ aspectRatio: '8.5 / 11' }}
        >
          <header className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-rose-700 font-semibold text-lg leading-tight">
                Petitioner & Counsel Claims
              </h3>
              <p className="text-xs text-slate-500">
                Select a row to load the counter sheet. Feedback bubbles hold strategy notes.
              </p>
            </div>
            <Badge variant="outline" className="border-rose-300 text-rose-600">
              {comparisonPoints.length} Issues
            </Badge>
          </header>

          <div className="flex-1 overflow-y-auto pr-2">
            <ol className="space-y-3">
              {comparisonPoints.map(point => {
                const isActive = point.id === activePoint?.id;
                return (
                  <li
                    key={point.id}
                    className={`rounded-lg border p-3 text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'border-rose-400 bg-rose-50 shadow-sm'
                        : 'border-rose-100 hover:border-rose-200 hover:bg-rose-50/70'
                    }`}
                    onClick={() => setActivePointId(point.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${getPresentedByClass(point.presentedBy)}`}
                        >
                          {point.presentedBy}
                        </span>
                        <span className="font-semibold text-slate-800">{point.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(point.status)}
                        {getStatusBadge(point.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-600 hover:text-rose-700"
                          onClick={event => {
                            event.stopPropagation();
                            setFeedbackPointId(point.id);
                          }}
                          aria-label={`Feedback on ${point.title}`}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-rose-400" />
                      </div>
                    </div>
                    <p className="mt-2 text-slate-700 leading-relaxed">{point.petitionerClaim}</p>
                     <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                       <span className="font-semibold text-slate-600">Source:</span>
                       <button 
                         className="text-blue-600 hover:text-blue-800 underline"
                         onClick={() => {
                           // Navigate to document in case workspace
                           window.open('/case-workspace', '_blank');
                         }}
                       >
                         {point.pageRefs.petitioner}
                       </button>
                     </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section
          className="relative bg-white border border-blue-200 shadow-sm rounded-xl p-6 flex flex-col gap-4"
          style={{ aspectRatio: '8.5 / 11' }}
        >
          {activePoint ? (
            <>
              <header className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-blue-700 font-semibold text-lg leading-tight">
                    Respondent Counter Sheet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track the rebuttal, supporting evidence, and follow-up asks one issue at a time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(activePoint.status)}
                  <Badge variant="outline" className="border-blue-300 text-blue-600">
                    {activePoint.presentedBy} Issue
                  </Badge>
                </div>
              </header>

              <article className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700 leading-relaxed space-y-2">
                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Core Rebuttal
                </h4>
                <p>{activePoint.respondentRebuttal}</p>
                 <div className="text-xs text-slate-500">
                   <strong>Reference:</strong> 
                   <button 
                     className="text-blue-600 hover:text-blue-800 underline ml-1"
                     onClick={() => {
                       // Navigate to document in case workspace
                       window.open('/case-workspace', '_blank');
                     }}
                   >
                     {activePoint.pageRefs.respondent}
                   </button>
                 </div>
              </article>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Suggested Follow-Ups
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {(activePoint.clarifyingPrompts ?? []).map((prompt, index) => (
                    <li key={index}>{prompt}</li>
                  ))}
                  {(activePoint.clarifyingPrompts ?? []).length === 0 && (
                    <li>Add your own clarifying prompt to drive discovery.</li>
                  )}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 text-xs space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-1">Evidence Targets</h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    {activePoint.evidence.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <label htmlFor="clarifying-question" className="block text-slate-700 font-semibold">
                    Draft Clarifying Question
                  </label>
                  <textarea
                    id="clarifying-question"
                    value={questionDraft}
                    onChange={event => setQuestionDraft(event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Example: Please confirm whether escrow issued any post-closing arrears invoices."
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <Button size="sm" onClick={handleSubmitQuestion} className="bg-blue-600 hover:bg-blue-700">
                      Log Question
                    </Button>
                    <span className="text-[11px] text-slate-500">
                      Logged: {(loggedQuestions[activePoint.id] ?? []).length}
                    </span>
                  </div>
                  {(loggedQuestions[activePoint.id] ?? []).length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 space-y-1">
                      {(loggedQuestions[activePoint.id] ?? []).map((entry, index) => (
                        <div key={index} className="text-slate-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{entry}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <p>Select a claim on the left to load the counter sheet.</p>
            </div>
          )}
        </section>
      </div>

      {feedbackPoint && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setFeedbackPointId(null)}
        >
          <div
            className="bg-white max-w-lg w-full rounded-xl shadow-lg border border-slate-200 p-6 space-y-4"
            onClick={event => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Feedback Notes</p>
                <h4 className="text-lg font-semibold text-slate-800">{feedbackPoint.title}</h4>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFeedbackPointId(null)}>
                Close
              </Button>
            </header>
            <div className="space-y-3">
              {feedbackPoint.feedback.map((note, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-slate-700">{note}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Use these notes to guide mbox searches and exhibit pulls before drafting FL‑320 sections.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
ComparisonView.displayName = 'ComparisonView';

export default ComparisonView;
