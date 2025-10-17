"use client"
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function SourceBadge({ label = 'source', hint }: { label?: string, hint: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger className="text-[10px] leading-none px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          {label}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

