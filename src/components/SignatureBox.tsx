"use client";

import React, { useState } from 'react';
import { Upload, Trash2, PenLine, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDragDrop, fileToBase64 } from '@/hooks/useDragDrop';
import { typography, tx, textColors } from '@/styles/typography';

interface SignatureBoxProps {
  name: string; // e.g., "Respondent (Mathieu Wauters)"
  onSignatureChange: (signatureData: {
    image: string | null;
    typedName: string;
    signedAt: string | null;
  }) => void;
  initialImage?: string | null;
  initialTypedName?: string;
  initialSignedAt?: string | null;
}

export function SignatureBox({
  name,
  onSignatureChange,
  initialImage = null,
  initialTypedName = '',
  initialSignedAt = null,
}: SignatureBoxProps) {
  const [sigImage, setSigImage] = useState<string | null>(initialImage);
  const [typedName, setTypedName] = useState(initialTypedName);
  const [signedAt, setSignedAt] = useState<string | null>(initialSignedAt);
  const [error, setError] = useState<string | null>(null);

  // Drag-drop hook for signature images
  const { isDragging, getRootProps, getInputProps, open } = useDragDrop({
    onDrop: async (files) => {
      try {
        setError(null);
        const file = files[0];
        const base64 = await fileToBase64(file);
        setSigImage(base64);
        setSignedAt(new Date().toISOString());
        onSignatureChange({
          image: base64,
          typedName,
          signedAt: new Date().toISOString(),
        });
      } catch (err) {
        setError('Failed to process image. Please try again.');
      }
    },
    accept: ['image/*'],
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onError: (msg) => setError(msg),
  });

  const signTyped = () => {
    if (!typedName.trim()) {
      setError('Please enter your name before signing');
      return;
    }

    const timestamp = new Date().toISOString();
    setSignedAt(timestamp);
    onSignatureChange({
      image: null,
      typedName: typedName.trim(),
      signedAt: timestamp,
    });
    setError(null);
  };

  const clearSignature = () => {
    setSigImage(null);
    setTypedName('');
    setSignedAt(null);
    onSignatureChange({
      image: null,
      typedName: '',
      signedAt: null,
    });
    setError(null);
  };

  const hasSignature = sigImage || (signedAt && typedName);

  return (
    <div className="space-y-3">
      {/* Name label */}
      <div className={tx(typography.label.medium, textColors.secondary)}>
        {name}
      </div>

      {/* Signature drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl border-2 border-dashed
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : hasSignature
              ? 'border-green-400 bg-green-50/50'
              : 'border-slate-300 bg-slate-50'
          }
          p-6 min-h-[180px]
          flex items-center justify-center text-center
          transition-all duration-200 ease-out
          hover:border-slate-400 hover:bg-slate-100
          cursor-pointer group
        `}
      >
        <input {...getInputProps()} />

        {/* Signature content */}
        {sigImage ? (
          // Uploaded image signature
          <img
            src={sigImage}
            alt={`${name} signature`}
            className="max-h-32 object-contain animate-in fade-in duration-300"
          />
        ) : signedAt && typedName ? (
          // Typed signature with handwriting font
          <div className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div
              className="text-4xl md:text-5xl leading-tight text-slate-900"
              style={{
                fontFamily: '"Brush Script MT", "Lucida Handwriting", "Snell Roundhand", cursive'
              }}
            >
              {typedName}
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className={typography.caption.medium}>Signed</span>
            </div>
          </div>
        ) : (
          // Empty state
          <div className={`text-slate-500 group-hover:text-slate-700 transition-colors ${isDragging ? 'text-blue-600' : ''}`}>
            <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragging ? 'animate-bounce' : ''}`} />
            <div className={typography.body.medium}>
              {isDragging ? (
                <span className="text-blue-600 font-semibold">Drop your signature here!</span>
              ) : (
                <>
                  <div className="font-semibold mb-1">Drag & drop signature</div>
                  <div className={typography.caption.medium}>
                    or click to upload • Max 5MB
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action buttons overlay (no-print) */}
        {hasSignature && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between no-print">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
            >
              <Upload className="h-3 w-3 mr-1.5" />
              Replace
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearSignature();
              }}
              className="bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 shadow-sm"
            >
              <Trash2 className="h-3 w-3 mr-1.5" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Typed signature input (no-print) */}
      <div className="no-print">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <PenLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && signTyped()}
              placeholder={`Type full name (e.g., ${name.split('(')[1]?.replace(')', '') || 'John Doe'})`}
              className={`
                w-full rounded-lg border border-slate-300
                pl-10 pr-3 py-2.5
                ${typography.body.medium}
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition-all duration-150
              `}
            />
          </div>
          <Button
            onClick={signTyped}
            disabled={!typedName.trim()}
            className="px-6"
          >
            <PenLine className="h-4 w-4 mr-2" />
            Sign
          </Button>
        </div>
        <div className={tx(typography.caption.small, textColors.tertiary, 'mt-2')}>
          💡 Tip: Type your name or drag an image of your signature above
        </div>
      </div>

      {/* Print-friendly signature line */}
      <div className="mt-4 pt-3 border-t border-slate-300">
        <div className={`flex items-center justify-between ${typography.caption.medium} ${textColors.secondary}`}>
          <span className="font-semibold">/s/ {typedName || '________________'}</span>
          <span>
            Date: {signedAt ? new Date(signedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '__________'}
          </span>
        </div>
      </div>
    </div>
  );
}
