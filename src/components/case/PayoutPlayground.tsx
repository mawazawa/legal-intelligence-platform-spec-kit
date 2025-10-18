"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Adjustment {
  id: string;
  label: string;
  respondentDelta: number;
  petitionerDelta: number;
}

interface PayoutPlaygroundProps {
  defaultNetProceeds: number;
  defaultArrears: number;
  defaultRespondentShare?: number;
  defaultPetitionerShare?: number;
}

export function PayoutPlayground({
  defaultNetProceeds,
  defaultArrears,
  defaultRespondentShare = 0.65,
  defaultPetitionerShare = 0.35,
}: PayoutPlaygroundProps) {
  const [netProceeds, setNetProceeds] = useState(defaultNetProceeds);
  const [arrears, setArrears] = useState(defaultArrears);
  const [respondentShare, setRespondentShare] = useState(defaultRespondentShare);
  const [petitionerShare, setPetitionerShare] = useState(defaultPetitionerShare);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    {
      id: 'watts-sym',
      label: 'Watts symmetry credit (6.7 mo × $4,500 × 65%)',
      respondentDelta: 19665,
      petitionerDelta: -19665,
    },
    {
      id: 'household-flip',
      label: 'Household items flip (+$7,500 Respondent)',
      respondentDelta: 7500,
      petitionerDelta: -7500,
    },
  ]);

  const computed = useMemo(() => {
    const constructiveNet = netProceeds + arrears;
    const baseRespondent = constructiveNet * respondentShare;
    const basePetitioner = constructiveNet * petitionerShare;
    const arrearsEach = arrears / 2;

    const respondentAfterArrears = baseRespondent - arrearsEach;
    const petitionerAfterArrears = basePetitioner - arrearsEach;

    const respondentAdjustments = adjustments.reduce((sum, adj) => sum + adj.respondentDelta, 0);
    const petitionerAdjustments = adjustments.reduce((sum, adj) => sum + adj.petitionerDelta, 0);

    const finalRespondent = respondentAfterArrears + respondentAdjustments;
    const finalPetitioner = petitionerAfterArrears + petitionerAdjustments;

    return {
      constructiveNet,
      arrearsEach,
      baseRespondent,
      basePetitioner,
      finalRespondent,
      finalPetitioner,
    };
  }, [netProceeds, arrears, respondentShare, petitionerShare, adjustments]);

  const addAdjustment = () => {
    const newAdjustment: Adjustment = {
      id: `adj-${crypto.randomUUID()}`,
      label: 'Custom adjustment',
      respondentDelta: 0,
      petitionerDelta: 0,
    };
    setAdjustments(prev => [...prev, newAdjustment]);
  };

  const updateAdjustment = (id: string, patch: Partial<Adjustment>) => {
    setAdjustments(prev => prev.map(adj => (adj.id === id ? { ...adj, ...patch } : adj)));
  };

  const removeAdjustment = (id: string) => {
    setAdjustments(prev => prev.filter(adj => adj.id !== id));
  };

  const resetShares = () => {
    setRespondentShare(0.65);
    setPetitionerShare(0.35);
  };

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Scenario Playground</CardTitle>
        <p className="text-xs text-slate-500">
          Adjust key inputs to explore alternative payout scenarios without rewriting the ledger.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField
            label="Net proceeds (closing statement)"
            value={netProceeds}
            onChange={val => setNetProceeds(val)}
          />
          <NumberField label="Mortgage arrears already paid" value={arrears} onChange={val => setArrears(val)} />
          <NumberField
            label="Respondent share"
            value={respondentShare}
            onChange={val => setRespondentShare(val)}
            step={0.01}
          />
          <NumberField
            label="Petitioner share"
            value={petitionerShare}
            onChange={val => setPetitionerShare(val)}
            step={0.01}
            trailing={
              <button type="button" className="text-[11px] text-blue-600 underline" onClick={resetShares}>
                reset 65/35
              </button>
            }
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Adjustments after arrears</h3>
            <Button size="sm" variant="secondary" onClick={addAdjustment}>
              <Plus className="h-4 w-4 mr-1" />
              Add adjustment
            </Button>
          </div>
          <div className="space-y-2">
            {adjustments.map(adj => (
              <div key={adj.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <input
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  value={adj.label}
                  onChange={event => updateAdjustment(adj.id, { label: event.target.value })}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NumberField
                    label="Respondent Δ"
                    value={adj.respondentDelta}
                    onChange={val => updateAdjustment(adj.id, { respondentDelta: val })}
                  />
                  <NumberField
                    label="Petitioner Δ"
                    value={adj.petitionerDelta}
                    onChange={val => updateAdjustment(adj.id, { petitionerDelta: val })}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => removeAdjustment(adj.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryTile title="Constructive net" value={computed.constructiveNet} caption="Net + arrears" />
          <SummaryTile title="Arrears per party" value={computed.arrearsEach} caption="Arrears ÷ 2" />
          <SummaryTile title="Respondent payout" value={computed.finalRespondent} caption="After adjustments" accent />
          <SummaryTile title="Petitioner payout" value={computed.finalPetitioner} caption="After adjustments" accent />
        </section>
      </CardContent>
    </Card>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  trailing?: React.ReactNode;
}

function NumberField({ label, value, onChange, step = 100, trailing }: NumberFieldProps) {
  return (
    <label className="text-xs font-semibold text-slate-600 space-y-1">
      {label}
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        step={step}
        onChange={event => onChange(Number(event.target.value))}
        className="bg-white"
      />
      {trailing}
    </label>
  );
}

interface SummaryTileProps {
  title: string;
  value: number;
  caption: string;
  accent?: boolean;
}

function SummaryTile({ title, value, caption, accent }: SummaryTileProps) {
  const formatted = Number.isFinite(value)
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '—';
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm',
        accent && 'border-blue-200 bg-blue-50'
      )}
    >
      <p className="text-xs text-slate-500 uppercase tracking-wide">{title}</p>
      <p className="text-lg font-semibold text-slate-800">{formatted}</p>
      <p className="text-[11px] text-slate-400">{caption}</p>
    </div>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
