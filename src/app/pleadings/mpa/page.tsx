import React from 'react';

export default function MPAPleadingPage() {
  return (
    <div className="min-h-screen bg-white p-8 pleading-paper legal-document">
      <div className="pleading-gutter hidden print:block">
        <ol>{Array.from({ length: 28 }).map((_, i) => (<li key={i+1}>{i+1}</li>))}</ol>
      </div>
      <div className="max-w-4xl mx-auto pleading-body">
        <h1 style={{ textAlign: 'center', fontWeight: 700 }}>MEMORANDUM OF POINTS AND AUTHORITIES</h1>
        <p><strong>Introduction.</strong> Respondent opposes Petitioner’s distribution proposal because it double‑counts mortgage arrears already satisfied in escrow and deviates from the Statement of Decision’s 65/35 allocation.</p>
        <p><strong>Argument.</strong></p>
        <p><strong>1. The proposed add‑back is mathematically impermissible.</strong> Once escrow paid the arrears, those amounts became part of the transaction costs netted out to arrive at $280,355.83. Adding them back as if they remained in the account inflates the distribution base without a factual deposit.</p>
        <p><strong>2. The Statement of Decision controls the 65/35 allocation.</strong> The SOD fixes the distribution percentages; Petitioner’s method alters the base contrary to the SOD and produces non‑comparable results across parties.</p>
        <p><strong>3. Watts and possession adjustments must follow the SOD’s boundaries.</strong> Charges beyond the ordered scope (e.g., above the $122/month cutoff) are non‑recoverable in this posture.</p>
        <p><strong>Conclusion.</strong> The Court should deny Petitioner’s requests and adopt the corrected distribution grounded in the actual net proceeds and the SOD.</p>
        <div className="page-break"></div>
        <p><strong>Signature.</strong><br/>Dated: ____________<br/>By: _________________________</p>
      </div>
    </div>
  );
}

