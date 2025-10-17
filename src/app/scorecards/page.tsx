import { DashboardLayout } from '@/components/DashboardLayout';
import { participants } from '@/data/participants';

const formatDate = (value: string) =>
  new Date(value + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatHours = (hours?: number) => {
  if (hours === undefined) {
    return '—';
  }
  return `${hours.toFixed(1)} h`;
};

const formatCurrency = (value?: number) => {
  if (value === undefined) {
    return '—';
  }
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function ScorecardsPage() {
  return (
    <DashboardLayout>
    <main className="space-y-8 bg-slate-50 p-8 text-slate-900">
      <header className="max-w-4xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Litigation Moneyball: Evidence Touchpoint Scoreboard
        </h1>
        <p className="text-base text-slate-600">
          Quantifies who moves the ball forward across filings FDI-21-794666, FDV-24-817888, and
          A171270 by weighing message volume, response cadence, and direct case leverage.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {participants.map((person) => (
          <article
            key={person.email}
            className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold leading-snug">{person.name}</h2>
                <p className="text-sm text-slate-500">
                  {person.role}
                  {person.organization ? ` · ${person.organization}` : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">Leverage Score</p>
                <p className="text-3xl font-black text-emerald-600">{person.leverageScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 py-5 text-sm sm:grid-cols-3">
              <Stat label="Touches" value={person.touches} highlight />
              <Stat label="Sent" value={person.sent} />
              <Stat label="Received" value={person.received} />
              <Stat label="Threads" value={person.uniqueThreads} />
              <Stat label="Median Response" value={formatHours(person.medianResponseHours)} />
              <Stat label="Financial Impact" value={formatCurrency(person.financialImpactUsd)} />
              <Stat label="First Seen" value={formatDate(person.firstSeen)} />
              <Stat label="Last Seen" value={formatDate(person.lastSeen)} />
              <Stat label="Signal Boost" value={person.signalBoost} isWide />
            </div>

            <div className="mt-auto border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Case Hooks
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {person.caseHooks.map((hook) => (
                  <li key={`${person.email}-${hook.caseId}`} className="leading-snug">
                    <span className="font-medium text-slate-700">{hook.caseId}:</span> {hook.hook}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
    </DashboardLayout>
  );
}

interface StatProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  isWide?: boolean;
}

function Stat({ label, value, highlight = false, isWide = false }: StatProps) {
  const className = [
    'flex flex-col rounded-lg border border-slate-200 bg-white/70 p-3',
    highlight ? 'ring-1 ring-emerald-500/30 shadow-[0_10px_25px_-15px_rgba(16,185,129,0.65)]' : '',
    isWide ? 'col-span-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="mt-1 text-base font-medium text-slate-800">{value}</span>
    </div>
  );
}
