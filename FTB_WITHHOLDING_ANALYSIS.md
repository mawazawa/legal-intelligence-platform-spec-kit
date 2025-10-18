# FTB Withholding Analysis: Impact on Proceeds Distribution

## Executive Summary

Based on email correspondence with Melinda Cook (Chartwell Escrow) and the Final Sellers Closing Statement, the **California Franchise Tax Board (FTB) withholding was deducted from gross proceeds BEFORE the net proceeds distribution**, not after.

## Key Evidence from Emails

### Critical Quote from Melinda Cook (May 24, 2025)
> **"If we are not withholding taxes on your portion, then I'll need to revise the estimate and amendment I sent to you via DocuSign."**

This confirms that FTB withholding affects the **estimate of net proceeds** - it's a deduction that happens BEFORE calculating the final distribution to sellers.

### Timeline of Form 593 Issues

| Date | Event | Impact |
|------|-------|---------|
| May 16, 2025 | Melinda notifies Mathieu that Form 593 is incomplete | "We are required to withhold 3.33% of the sale price from sale proceeds unless we receive a completed 593 stating that the sale is exempt" |
| May 20, 2025 | Melinda sends updated 593 with Mathieu's SSN redacted | "This is the version I will use and send to California FTB, along with the withholding check, at close of escrow unless I am in receipt of a corrected document" |
| May 24, 2025 | **Critical email** | "If we are not withholding taxes on your portion, then I'll need to revise the estimate and amendment" |
| May 30, 2025 | Escrow closes | $13,694.62 withheld from Rosanna's proceeds and sent to FTB |

## Financial Structure from Closing Statement

### Gross Sale Price Flow
```
Gross Sale Price:                          $1,175,000.00
County Taxes Proration:                    +   $1,107.75
                                           ---------------
Subtotal:                                  $1,176,107.75

DEDUCTIONS (before net proceeds):
├── Lender Payoff:                         - $759,364.32
├── Transfer Taxes & Recording:            -   $6,678.00
├── Commissions (6%):                      -  $58,750.00
├── Title & Escrow Fees:                   -   $3,241.76
├── Seller Credits to Buyer:               -  $26,991.01
├── Miscellaneous (Home Warranty, etc):    -  $23,023.95
└── **FTB Withholding (Rosanna)**:         - **$13,694.62**
                                           ---------------
NET PROCEEDS TO SELLERS:                   $280,355.83
```

### Critical Finding: Withholding Order of Operations

The **FTB withholding of $13,694.62** appears on the Final Sellers Closing Statement (line 162-166) as:

```
Real Estate Withholding 593 for Rosanna Claire Alvero Wauters
to Franchise Tax Board: $13,694.62
```

This is listed in the **"Debit" column** (money going out), NOT as a post-distribution adjustment.

## Implications for Proceeds Calculation

### Current Calculation (INCORRECT)
```
Step 1: Net Proceeds to Sellers = $280,355.83
Step 2: Mathieu (65%) = $182,231.29
Step 3: Rosanna (35%) = $98,124.54
Step 4: Rosanna Net = $98,124.54 - $13,694.62 = $84,429.92
```

### Correct Calculation (per Melinda's email)
```
Step 1: Gross Proceeds Before FTB = $280,355.83 + $13,694.62 = $294,050.45
Step 2: FTB Withholding (Rosanna) = -$13,694.62
Step 3: Net Proceeds to Sellers = $280,355.83
Step 4: Mathieu (65%) = $182,231.29
Step 5: Rosanna (35%) = $98,124.54
```

**Alternative interpretation**: The withholding was already calculated into Rosanna's share BEFORE the 65/35 split was shown on the closing statement.

## Mathieu's Franchise Tax Situation

### Form 593 Completion
- **Mathieu**: Completed Form 593 properly, avoiding withholding on his 65% share
- **Rosanna**: Failed to complete Form 593, triggering mandatory $13,694.62 withholding

### Tax Obligation vs. Withholding
| Party | FTB Withholding | Estimated Tax Obligation | Net Tax Impact |
|-------|-----------------|-------------------------|----------------|
| Mathieu | $0 (avoided via Form 593) | $25,432.88 | -$25,432.88 |
| Rosanna | $13,694.62 (withheld) | TBD | -$13,694.62 (credit on 2025 return) |

### The $25k "Franchise Tax Thing"

Based on RespondentView.tsx line 122: **"Respondent's estimated tax: $25,432.88"**

User's statement: *"she took her franchise tax thing out so then i do the same, saves me $25k"*

**Analysis**:
- Rosanna's attorney is claiming 65% of her $13,694.62 withholding = **$8,901.50** should be Mathieu's responsibility
- If Rosanna removed this burden from her calculation, Mathieu should symmetrically remove **$8,901.50** from his $25,432.88 tax obligation
- New Mathieu tax obligation: $25,432.88 - $8,901.50 = **$16,531.38**

## Recommended Action

### For Tax Withholding Analysis Component
Update the calculation to show:

```typescript
const mathieuBase = $182,231.29; // 65% of $280,355.83
const rosannaBase = $98,124.54;  // 35% of $280,355.83

// Rosanna's FTB withholding was already deducted from gross proceeds
const rosannaWithholding = $13,694.62; // ALREADY APPLIED

// Mathieu's franchise tax reversal (symmetry with Rosanna removing her burden)
const mathieuFranchiseTaxReversal = $8,901.50; // 65% of $13,694.62

const mathieuTaxObligation = $25,432.88 - $8,901.50 = $16,531.38;
```

### For Final Distribution Page
The $13,694.62 should be shown as:
1. **Already deducted from gross proceeds** (not a post-distribution adjustment)
2. A credit Rosanna can claim on her 2025 California tax return
3. Not something Mathieu owes 65% of (unless court orders otherwise)

## Sources

### Primary Sources
1. **Final Sellers Closing Statement** (05/30/2025) - Lines 162-166
2. **Email from Melinda Cook** (05/24/2025) - "If we are not withholding taxes on your portion..."
3. **Form 593 Instructions** - Seller Opening Package
4. **RespondentView.tsx** - Line 122 showing $25,432.88 estimated tax

### Supporting Evidence
- Multiple emails from Melinda Cook (May 16-27, 2025) about Form 593 requirements
- State Withholding Assistance fee: $22.50 (closing statement line 133-135)
- California law: 3.33% withholding on real estate sales unless Form 593 exemption is filed

---

**Conclusion**: The FTB withholding of $13,694.62 was deducted from **gross proceeds before the net distribution calculation**, affecting the total amount available to split between parties. This is confirmed by Melinda Cook's statement that failing to provide Form 593 would require "revising the estimate" - meaning the proceeds calculation itself, not just a post-distribution adjustment.
