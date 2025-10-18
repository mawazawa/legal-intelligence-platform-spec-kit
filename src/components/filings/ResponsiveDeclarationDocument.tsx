import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ResponsiveDeclarationDocumentProps {
  layout?: 'detailed' | 'simple';
  showSidebars?: boolean;
  id?: string;
}

const ResponsiveDeclarationDocument: React.FC<ResponsiveDeclarationDocumentProps> = ({
  layout = 'detailed',
  showSidebars = false,
  id = 'responsive-declaration'
}) => {
  const declarationContent = `
# DECLARATION OF MATHIEU CHRISTIAN YVES WAUTERS

I, Mathieu Christian Yves Wauters, declare as follows:

## 1. INTRODUCTION AND PERSONAL KNOWLEDGE

I am the Respondent in this action. I have personal knowledge of the facts stated herein and could competently testify thereto if called as a witness. This declaration is made in support of my opposition to Petitioner's Request for Order filed June 25, 2025, seeking redistribution of escrow proceeds from the sale of the real property located at 3525 8th Avenue, Los Angeles, CA 90018 ("Property").

Petitioner's RFO contains fundamental mathematical errors that render her requested relief impossible and legally unsupportable. The core flaw is her attempt to both deduct $77,779.88 from the net proceeds AND add it back to create a fictional "total net proceed" of $358,155.71. This is mathematically impossible and demonstrates either a fundamental misunderstanding of basic arithmetic or an intentional attempt to mislead this Court.

## 2. TIMELINE OF EVENTS - PETITIONER'S POSSESSION CONTROL

**Critical Date: November 16, 2024** - Petitioner took exclusive possession of the Property on this date. This fact is admitted in her own declaration at paragraph 19: "On November 16, 2024, I took possession of the home."

**Legal Significance:** Once Petitioner took possession on November 16, 2024, she became responsible for all Property-related expenses, including mortgage payments, property taxes, insurance, and maintenance. Her claims for "Watts charges" and other expenses after this date are legally baseless.

## 3. MATHEMATICAL IMPOSSIBILITY OF PETITIONER'S CALCULATIONS

**The $77,779.88 Double-Counting Error:** Petitioner's calculation is fundamentally flawed. She claims:

- The mortgage company was paid $759,364.32 at closing
- This included $77,779.88 in "unpaid mortgage/escrow" costs
- She wants to "add back" this $77,779.88 to the net proceeds
- **This is mathematically impossible** - you cannot both pay a debt and add it back to your share

**Correct Calculation:** The escrow proceeds of $280,355.83 already reflect the payment of all mortgage obligations, including the $77,779.88. To "add back" this amount would be double-counting and result in an inflated, fictional total.

## 4. WATTS CHARGES ANALYSIS - TIMELINE CUTOFF

**Watts Charges Cannot Extend Past Possession Date:** Petitioner claims Watts charges through November 16, 2024, but she took possession on that exact date. Watts charges are for exclusive use and possession - once she took possession, the charges should end.

**Petitioner's Own Timeline Contradiction:** Her declaration shows she took possession on November 16, 2024, yet she claims Watts charges through that date. This is logically impossible - she cannot both owe Watts charges for exclusive use AND have taken possession on the same date.

## 5. REQUESTED RELIEF

**Denial of RFO:** I request that this Court deny Petitioner's Request for Order in its entirety due to the fundamental mathematical errors and legal deficiencies outlined above.

**Correct Distribution:** The escrow proceeds of $280,355.83 should be divided according to the Judgment: 65% to me ($182,231.29) and 35% to Petitioner ($98,124.54).

I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

**DATED:** ${new Date().toLocaleDateString()}

**MATHIEU CHRISTIAN YVES WAUTERS**
`;

  return (
    <div id={id} className="legal-document min-h-screen p-16">
      <div className="max-w-4xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          className="prose prose-lg max-w-none"
        >
          {declarationContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ResponsiveDeclarationDocument;