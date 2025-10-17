import React from 'react';

const MPADocument: React.FC = () => {
  const lineNumbers = Array.from({ length: 28 }).map((_, i) => i + 1);
  return (
    <div className="pleading-paper legal-document">
      <div className="pleading-gutter hidden print:block">
        <ol>{lineNumbers.map((n) => (<li key={n}>{n}</li>))}</ol>
      </div>
      <div className="pleading-body space-y-4 text-sm leading-relaxed">
        <h1 className="text-center font-bold text-lg">MEMORANDUM OF POINTS AND AUTHORITIES</h1>
        <p><strong>Introduction.</strong> Respondent opposes Petitioner's distribution proposal because it double-counts mortgage arrears already satisfied in escrow and deviates from the Statement of Decision's 65/35 allocation.</p>
        <p><strong>Argument.</strong></p>
        <p><strong>I. Petitioner's add-back theory is mathematically impermissible.</strong> Once escrow satisfied the arrears, the resulting $280,355.83 reflects the transaction's net proceeds. Adding $77,779.88 back to the base without an accompanying deposit inflates the distribution amount and contradicts the accounting reflected in the closing statement.</p>
        <p><strong>II. The Statement of Decision controls the 65/35 allocation.</strong> The SOD awards Respondent 65% and Petitioner 35% of the net proceeds. Petitioner's method alters the base amount and produces a distribution contrary to the judgment.</p>
        <p><strong>III. Watts charges and possession adjustments must follow the SOD's boundaries.</strong> Charges beyond the court-ordered scope—such as amounts exceeding the $122/month limitation—are not recoverable in this proceeding.</p>
        <p><strong>IV. Tax withholding must be treated symmetrically.</strong> Form 593 withholding was split in escrow; Respondent assumed his share directly. Petitioner received her full credit at closing and cannot charge Respondent again.</p>
        <p><strong>Conclusion.</strong> The Court should deny Petitioner's requested adjustments, adopt Respondent's corrected distribution, and enforce the Statement of Decision's allocation and limitations.</p>
        <div className="page-break"></div>
        <p><strong>DATED:</strong> ______________________</p>
        <p><strong>By:</strong> _____________________________<br/>Thomas J. Rotert, Esq.<br/>Attorney for Respondent</p>
      </div>
    </div>
  );
};

export default MPADocument;
