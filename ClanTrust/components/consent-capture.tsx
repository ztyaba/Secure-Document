'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type ConsentCaptureProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  plainLanguage?: boolean;
};

export function ConsentCapture({ value, onChange, plainLanguage }: ConsentCaptureProps) {
  const sigPad = useRef<SignatureCanvas | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const toggleConsent = () => onChange(!value);

  const handleAudio = async () => {
    try {
      setAudioPlaying(true);
      const utterance = new SpeechSynthesisUtterance(
        plainLanguage
          ? 'By proceeding you agree that ClanTrust may store and process your will and trust documents in Google Drive and facilitate signatures via Dropbox Sign.'
          : 'ClanTrust will process your documents under Ugandan data protection guidelines. Consent is required to proceed.'
      );
      utterance.lang = 'en-US';
      utterance.onend = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error(error);
      setAudioPlaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Consent and signature</h2>
        <button className="audio-button" onClick={handleAudio} type="button">
          {audioPlaying ? 'Playing...' : 'Play audio summary'}
        </button>
      </div>
      <p className={cn('text-sm text-slate-600', plainLanguage && 'text-base text-slate-700')}>
        {plainLanguage
          ? 'We store your files safely in Google Drive and only share them when you ask. We also use Dropbox Sign to let you sign documents. Do you agree?'
          : 'ClanTrust processes your legal documents under Uganda Data Protection and Privacy Act, storing encrypted versions in Google Drive and facilitating signatures via Dropbox Sign. Provide consent to continue.'}
      </p>
      <div className="flex flex-col gap-3">
        <div className="rounded-md border border-dashed border-brand bg-brand-soft/60 p-3 text-sm text-brand">
          <p>Signature preview (offline ready fallback)</p>
          <SignatureCanvas
            penColor="#1f2937"
            canvasProps={{ className: 'mt-2 h-40 w-full rounded-md bg-white' }}
            ref={(instance) => (sigPad.current = instance)}
          />
          <div className="mt-2 flex gap-2">
            <Button variant="ghost" onClick={() => sigPad.current?.clear()}>
              Clear
            </Button>
            <Button onClick={() => onChange(true)}>Save signature</Button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={value} onChange={toggleConsent} className="h-4 w-4" />
          I consent to ClanTrust processing my data.
        </label>
      </div>
    </div>
  );
}
