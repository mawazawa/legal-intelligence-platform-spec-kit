# Suggested Evidence and Visualization Exhibits

This list maps each core claim to specific documentary items in this repo and proposes data-visualization exhibits for a dry, scientific presentation.

## Visualization Exhibits (attach PNGs exported in-app)
- Exhibit A — Multi-Source Corroboration Heatmap
  - How to export: App → Analytics → Evidence Matrix → “Download PNG”
  - Purpose: Shows evidence density by claim × source (emails / documents / graph). Darker = more corroboration.
- Exhibit B — Continuances Attribution (Counts by Actor)
  - How to export: App → Responsive Declaration → Verified Facts (continuance count). If desired, we can add a dedicated chart; counts already displayed.
  - Purpose: Quantifies who requested continuances, supporting the attribution statement.
- Exhibit C — Communication Responsiveness (Petitioner vs Respondent)
  - Source: DATA_VISUALIZATIONS.md (ASCII) or add a small chart; we can export a PNG on request.
- Exhibit D — Mathematical Error Flow (Double-Count)
  - Source: DATA_VISUALIZATIONS.md (Chart 1A/1B). We can render as PNG on request.

Suggested filing language (dry/scientific):
> Attached hereto as Visualization Exhibit A is a corroboration heatmap summarizing evidence density across disputed claims and sources (emails, documentary exhibits, and graph events). The chart is derived from the full email corpus (mbox exports), the documentary record (closing statement, payoff, appraisal), and events persisted to the knowledge graph. Darker cells indicate higher corroboration. The visualization is intended to communicate the magnitude and consistency of the evidence set, rather than rely on any single document.

## Documentary Exhibits (links refer to repository paths)

1) Escrow / Closing Statement (Net Proceeds = $280,355.83)
- Final Sellers Closing Statement (any copy):
  - closing statement — Final Sellers Closing Statement.tjr markup (1) copy.pdf
  - closing statement — Final Sellers Closing Statement.tjr markup (1).pdf
  - intake/inbox/**/Final Sellers Closing Statement.tjr markup (1) copy.pdf
- Purpose: Establishes gross sale price, mortgage payoff, closing costs, and the net proceeds used for the 35/65 distribution.

2) Lender Payoff
- Lakeview Mortgage payoff. .pdf (two instances in exhibits index)
- Purpose: Confirms mortgage payoff was satisfied through escrow, refuting the “add back” of $77,779.88.

3) Petitioner’s RFO and Attorney Declaration
- RFO.pdf; Memo of Points & Auth ISO RFO (7).pdf; Declaration of SG ISO RFO (2).pdf
- Purpose: Anchor citations to Petitioner’s asserted math and requests; highlight internal inconsistencies.

4) Judgment / SOD (Statement of Decision)
- 2023-12-28_CaseNumber-FDI-21-794666_Divorce_Judgment-and-Statement-of-Decision copy.pdf
- 2023-12-28_SOD_OCR.pdf
- Purpose: Baseline legal distribution (35/65) and relevant directives.

5) Tax Withholding / Form 593 (Respondent)
- exhibits/Exhibit MW-001 - CA Form 593 (Mathieu Wauters) [STAMPED].pdf (if present)
- Purpose: Quantifies withholding impacting net distribution and tax adjustments.

6) Continuances Attribution (Emails / ROA)
- Emails with subjects containing: “continuance”, “postpone”, “reschedule”, “adjourn” (auto-cited in-app under Evidence Citations)
- ROA entries (if present in exhibits index)
- Purpose: Quantify total continuances and attribution by actor; pairs with Visualization Exhibit B.

7) Counsel Diligence (Referral / Intake Chain)
- Emails referencing: “Berman”, “Proos”, “Anderson”, “Macias”, “paralegal”, “intake” (auto-cited in-app)
- Purpose: Demonstrate diligence and responsiveness in seeking specialist counsel.

8) Appraisal / FMV (3525 8th Ave.)
- If PDF present, include; otherwise, include the email transmitting the appraisal (Baldino 07/25/2022).
- Purpose: Fair market value anchor for equity computations.

## Where to generate and verify
- Evidence Matrix: /analytics/evidence-matrix → Download PNG for Exhibit A
- Responsive Declaration (with Citations): /responsive-declaration (side panel lists email/graph citations)
- Exhibit Packet: /exhibits/packet (auto-numbered TOC)

If you want, I can add dedicated charts for Continuances and Communication Responsiveness with “Download PNG” buttons so Exhibits B/C are one click away.

