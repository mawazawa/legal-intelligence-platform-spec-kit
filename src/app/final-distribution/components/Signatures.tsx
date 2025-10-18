import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Upload, Trash2 } from 'lucide-react';
import { SignatureType } from '../hooks/useSignatures';

interface SignaturesProps {
  respSigImage: string | null;
  petSigImage: string | null;
  respTypedName: string;
  petTypedName: string;
  respSignedAt: string | null;
  petSignedAt: string | null;
  setRespTypedName: (name: string) => void;
  setPetTypedName: (name: string) => void;
  preventDefaults: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, type: SignatureType) => void;
  handlePick: (e: React.ChangeEvent<HTMLInputElement>, type: SignatureType) => void;
  signTyped: (type: SignatureType) => void;
  clearSignature: (type: SignatureType) => void;
}

export const Signatures = React.memo(({
  respSigImage,
  petSigImage,
  respTypedName,
  petTypedName,
  respSignedAt,
  petSignedAt,
  setRespTypedName,
  setPetTypedName,
  preventDefaults,
  handleDrop,
  handlePick,
  signTyped,
  clearSignature
}: SignaturesProps) => (
  <div className="court-calculation mb-12">
    <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
      <PenLine className="h-5 w-5 mr-2 text-blue-600" />
      SIGNATURES (Electronic)
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Respondent signature */}
      <div>
        <div className="text-sm text-slate-600 font-medium mb-2">Respondent (Mathieu Wauters)</div>
        <div
          className="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 min-h-[160px] flex items-center justify-center text-center"
          onDragEnter={preventDefaults}
          onDragOver={preventDefaults}
          onDrop={(e) => handleDrop(e, 'resp')}
        >
          {respSigImage ? (
            <img src={respSigImage} alt="Respondent signature" className="max-h-32 object-contain" />
          ) : respSignedAt && respTypedName ? (
            <div className="w-full">
              <div className="text-3xl md:text-4xl leading-tight" style={{ fontFamily: 'cursive' }}>
                {respTypedName}
              </div>
            </div>
          ) : (
            <div className="text-slate-500">
              <Upload className="h-6 w-6 mx-auto mb-2" />
              <div className="mb-1">Drag & drop a signature image here</div>
              <div className="text-xs">or use the typed signature below</div>
            </div>
          )}
          <input className="hidden" type="file" accept="image/*" id="resp-sig-input" onChange={(e) => handlePick(e, 'resp')} />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between no-print">
            <label htmlFor="resp-sig-input" className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 cursor-pointer hover:bg-white">
              Upload Image
            </label>
            {(respSigImage || respSignedAt) && (
              <button onClick={() => clearSignature('resp')} className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 hover:bg-white flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 no-print">
          <input
            type="text"
            value={respTypedName}
            onChange={(e) => setRespTypedName(e.target.value)}
            placeholder="Type full name (e.g., Mathieu Wauters)"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <Button size="sm" onClick={() => signTyped('resp')}>Sign</Button>
        </div>
        <div className="mt-4 text-xs text-slate-600">
          <div className="border-t border-slate-300 pt-1"></div>
          <div className="flex items-center justify-between">
            <span className="font-medium">/s/ {respTypedName || '________________'}</span>
            <span>Date: {respSignedAt ? new Date(respSignedAt).toLocaleDateString() : '__________'}</span>
          </div>
        </div>
      </div>

      {/* Petitioner signature */}
      <div>
        <div className="text-sm text-slate-600 font-medium mb-2">Petitioner (Rosanna Alvero)</div>
        <div
          className="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 min-h-[160px] flex items-center justify-center text-center"
          onDragEnter={preventDefaults}
          onDragOver={preventDefaults}
          onDrop={(e) => handleDrop(e, 'pet')}
        >
          {petSigImage ? (
            <img src={petSigImage} alt="Petitioner signature" className="max-h-32 object-contain" />
          ) : petSignedAt && petTypedName ? (
            <div className="w-full">
              <div className="text-3xl md:text-4xl leading-tight" style={{ fontFamily: 'cursive' }}>
                {petTypedName}
              </div>
            </div>
          ) : (
            <div className="text-slate-500">
              <Upload className="h-6 w-6 mx-auto mb-2" />
              <div className="mb-1">Drag & drop a signature image here</div>
              <div className="text-xs">or use the typed signature below</div>
            </div>
          )}
          <input className="hidden" type="file" accept="image/*" id="pet-sig-input" onChange={(e) => handlePick(e, 'pet')} />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between no-print">
            <label htmlFor="pet-sig-input" className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 cursor-pointer hover:bg-white">
              Upload Image
            </label>
            {(petSigImage || petSignedAt) && (
              <button onClick={() => clearSignature('pet')} className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 hover:bg-white flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 no-print">
          <input
            type="text"
            value={petTypedName}
            onChange={(e) => setPetTypedName(e.target.value)}
            placeholder="Type full name (e.g., Rosanna Alvero)"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <Button size="sm" onClick={() => signTyped('pet')}>Sign</Button>
        </div>
        <div className="mt-4 text-xs text-slate-600">
          <div className="border-t border-slate-300 pt-1"></div>
          <div className="flex items-center justify-between">
            <span className="font-medium">/s/ {petTypedName || '________________'}</span>
            <span>Date: {petSignedAt ? new Date(petSignedAt).toLocaleDateString() : '__________'}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 text-[11px] text-slate-500">
      By clicking Sign or uploading an image, the signer adopts this electronic signature. This is intended to be acceptable for court filing as an electronically signed document.
    </div>
  </div>
));

Signatures.displayName = 'Signatures';
