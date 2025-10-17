'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, CheckCircle, Printer, Download } from 'lucide-react';

const RotertDeclaration: React.FC = () => {
  const printDeclaration = () => {
    window.print();
  };

  const exportToPDF = () => {
    console.log('Exporting declaration to PDF...');
  };

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">THOMAS J. ROTERT DECLARATION</h1>
          <div className="flex justify-center gap-4 print:hidden">
            <Button
              variant="outline"
              onClick={exportToPDF}
              className="border-slate-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button
              onClick={printDeclaration}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="space-y-6 text-sm leading-relaxed">
          {/* Attorney Header */}
          <div className="text-center">
            <div className="font-bold text-lg">THOMAS J. ROTERT (State Bar # 171056)</div>
            <div>Attorney at Law</div>
            <div>1083 Vine Street, #357</div>
            <div>Healdsburg, CA 95448</div>
            <div>Telephone: (310) 713-0104</div>
            <div>tjrotert@gmail.com</div>
            <div className="mt-4 font-bold">Attorney for Respondent,</div>
            <div className="font-bold">MATHIEU CHRISTIAN YVES WAUTERS</div>
          </div>

          {/* Court Header */}
          <div className="text-center">
            <div className="font-bold text-lg">SUPERIOR COURT OF THE STATE OF CALIFORNIA</div>
            <div className="font-bold">COUNTY OF SAN FRANCISCO—UNIFIED FAMILY COURT</div>
          </div>

          {/* Case Information */}
          <div className="text-center">
            <div className="font-bold text-lg">In Re Marriage of:</div>
            <div className="mt-4">
              <div className="font-bold">ROSANNA CLAIRE ALVERO</div>
              <div className="italic">(fka WAUTERS),</div>
              <div className="mt-2 font-bold">Petitioner,</div>
              <div className="font-bold">vs.</div>
              <div className="mt-2 font-bold">Mathieu Christian Yves Wauters,</div>
              <div className="mt-2 font-bold">Respondent.</div>
            </div>
            <div className="mt-4 font-bold">Case No.: FDI-21-794666</div>
          </div>

          {/* Hearing Information */}
          <div className="text-center">
            <div className="font-bold text-lg">OPPOSITION OF</div>
            <div className="font-bold text-lg">MEMORANDUM OF POINTS AND AUTHORITIES IN SUPPORT OF</div>
            <div className="mt-4">
              <div>Date: October 21, 2025</div>
              <div>Time: 9:00 a.m.</div>
              <div>Dept.: 403</div>
            </div>
          </div>

          {/* Notice */}
          <div className="text-center font-bold">
            TO THE COURT, TO ALL PARTIES, AND TO THEIR ATTORNEYS OF RECORD
          </div>

          {/* Opening Paragraph */}
          <div>
            <p>
              COMES NOW, Respondent, Mathieu Christian Yves Wauters, ("Mr. Wauters") and responds REQUEST FOR DIVISION OF THE NET PROCEEDS Petitioner, Rosanna Claire Alvero, ("Ms. Alvero") and her "Request for Division of the Net Proceeds" set forth in her declaration / attachment 7, by giving notice of Respondent's Intent to Appear and Offer Testimony at the hearing of this matter at 9:00 a.m. on October 21, 2025 at 9:00 a.m. in Department 403 of the above entitled Court.
            </p>
            <p className="mt-4">
              Respondent hereby provides an outline of the testimony and argument that he and/or his counsel intends to provide at the hearing, only insofar as the intended testimony is in direct response to matters addressed directly by Petitioner in her moving papers, and excluding any new, ancillary or additional matters not raised in opening brief.
            </p>
          </div>

          {/* Format and Purpose Section */}
          <div>
            <div className="font-bold text-lg mb-4">FORMAT AND PURPOSE OF STATEMENT OF INTENDED TESTIMONY</div>
            <p>
              The attached declarations of Respondent and counsel for Respondent set forth the various reasons that no opposition was timely filed. Irrespective of those reasons, with the hearing on this matter set only 4 calendar and 2 Court days away, it would be patently unfair to file an opposition at this late stage containing new facts, law or discussion of matters not directly addressed in the moving papers without giving Petitioner ample opportunity to review these new facts, law, or discussion of matters, conduct research, and draft and file a reply brief. Because no such ample opportunity remains, nor is there sufficient time to respond by written Reply, Respondent has amended and altered the content of his previously drafted opposition (with declarations and points and authorities) to remove reference to any facts not in direct response to the claims made by Petitioner in her motion, to remove any and all citations to case or statutory law not identified in Petitioner's moving papers, and to otherwise limit these papers and this outline of intended testimony to only those matters, issues and requests raised by Petitioner in her Request for Order.
            </p>
          </div>

          {/* Petitioner's Request vs Respondent's Testimony */}
          <div>
            <div className="font-bold text-lg mb-4">PETITIONER'S REQUEST vs RESPONDENT'S INTENDED TESTIMONY</div>
            
            {/* Mortgage Payment Add-Back */}
            <div className="mb-6">
              <div className="font-bold text-base mb-2">Mortgage Payment Add-Back: $77,799.88</div>
              <div className="mb-4">
                <div className="font-bold">Alvero Declaration ¶¶ 39, 40, 41:</div>
                <div className="italic ml-4">
                  "The outstanding mortgage and escrow advance were carried from the months (almost a year) that Respondent was living on the property.
                </div>
                <div className="italic ml-4">
                  I am informed that the total balance incurred from December 1, 2023 to November 16, 2024, is $77,799.88, which included $30,384.19 for escrow balance which included unpaid insurance ($1,776) and county tax ($28,608.19), and $47,415.69 for unpaid mortgage from December 1, 2023, to November 18, 2024."
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  • There should be no money "added back" to the proceeds from escrow because the Court never made any Order assigning payment of the mortgage, taxes and insurance to one party or the other; And you can't "add" money by taking a pencil and changing the numbers. There will always only be $280,355.81 in the account to split.
                </div>
                
                <div>
                  • Alvero does not testify from her own personal knowledge but again simply says "I am informed that…" these things are true; she does not state who informed her or why the information should be taken as credible or accurate.
                </div>
                
                <div>
                  • Regarding the money escrow paid towards unpaid mortgage payments ($47,415.69), there is no breakdown, designation, or notation in the Final Closing Statement identifying to which months, years, or period of time the mortgage payments out of escrow were applied. But, with only $47,415.69 of the $77,799.88 total paid from escrow attributed to mortgage payments ($28,608.19 was for unpaid taxes and $1,776 was for unpaid insurance) this equals 15 months of the unpaid $3,077/month mortgage. Alvero lived in the house exclusively for the very last 6.7 months before the close of escrow and did not pay the mortgage. Certainly $20,615.90 (6.7 months @ $3,077) of the $47,415.69 in mortgage payments from escrow then are attributable to the time that only she lived there. Nor is there any reason
                </div>
                
                <div>
                  • Although unfortunate, the Order after Trial / Judgment dated June 27, 2024 is silent as to who was responsible for paying the mortgage and in what percentage. The Statement After Decision / Judgment recites at the top of p.18 that:
                </div>
                
                <div className="ml-4 italic">
                  "Alvero has further requested for an order for Wauters to pay the mortgage, property taxes, and insurance on the residence and to pay her 35% of the monthly rental profit of $122 per month commencing October 1, 2023, until the marital residence is sold and escrow has closed."
                </div>
                
                <div>
                  But the Court only granted the $122/month in rental profit and remained silent of the request to assign the mortgage, taxes and insurance to Wauters. p.18, ll. 23-27. Testimony at trial was that the parties agreed to split the mortgage, taxes, insurance and other carrying costs 50/50; The ownership split decreed by the Court was not 50/50, it was 35/65, and so it might seem logical that the debt obligations would be divided the same way (if you own 35% of a house, you pay 35% of the costs). But the Court started from the assumption that, just like their agreement to split the costs 50/50, the house was owned 50/50. It only awarded Wauters 65% instead of 50% because he had contributed the down payment of 30% of the purchase price from his separate property.
                </div>
                
                <div>
                  • With the Court not assigning to either party the responsibility of paying the mortgage, the mortgage, insurance and taxes should be the responsibility of each party, 50/50, not 35/65. In essence, it was not a debit to Alvero to have the mortgage, taxes and license paid out of escrow, because anything paid out of escrow is a charge against profits to each party on a 35/65 basis rather than a 50/50 basis, and Alvero makes money.
                </div>
                
                <div>
                  • Finally the approach Alvero suggests is unworkable: the parties are dividing up the actual money in US dollars that was transferred out of escrow and presently sits in counsel's trust account ($280,355.83). Adding the number $77,799.88 to the real money now sitting in the account as Alvero suggests does not make the amount of real money somehow become $358,155.71; the real money to be divided will still remain the amount of actual money in the account ($280,355.83). It's the same as having $100 in cookie jar and putting a sticky note on the lid indicating $100. If two people have the rights to the cookie jar, 50/50, and they decide to cross-out the $100 and make it $200, when they go to divide it equally they are each still getting just $50.00 because nobody put anything more than the original $100 in the cookie jar. By adding back $77,779.88 to the funds released from escrow and now held in counsel's trust account, if all you do is add it back with a pencil to the ledger but never actually put $77,779.88 in physical money into the account, after everything has been divided, the parties will simply hold, together, in their hands, $77,779.88 less than their accounting sheet says they should have.
                </div>
              </div>
            </div>

            {/* State FTB Withholding Tax Form 593 */}
            <div className="mb-6">
              <div className="font-bold text-base mb-2">State FTB Withholding Tax Form 593 "Real Estate Withholding Statement"</div>
              <div className="mb-4">
                <div className="font-bold">Alvero Declaration ¶ 42</div>
                <div className="italic ml-4">
                  Alvero makes the following statement in her declaration regarding state taxes:
                </div>
                <div className="italic ml-4">
                  "I also paid $13,694.62 in tax withholding which I will take full responsibility and agree for Respondent to receive 65% of that amount added to his net share."
                </div>
              </div>
              
              <div className="font-bold mb-2">Wauters Needs to be Compensated Directly from Escrow for the Tax Liability he Assumed Totaling $25,432.87 because Alvero's Tax Liability was Paid Directly from Escrow when she Didn't Sign FTB Form 593</div>
              
              <div className="space-y-3">
                <div>
                  • Her statement is inaccurate when she says "I also paid $13,694.62 in tax withholding." It was escrow, not Alvero, that paid $13,694.62 on her behalf as noted on the Final Closing Statement. Escrow took the sale price of the home and determined how much would be owed to the State of California in taxes and then divided that 35/65 according to each party's interest in the property, providing them each a blank Form 593 with the instructions that if they filled out the forms and signed them indicating that they would be responsible for their own portion of the taxes, the money would not have to be paid directly to the FTB out of escrow.
                </div>
                
                <div>
                  • Wauters FTB tax liability as a 65% owner was $25,432.87. He filled out the form and deposited it in escrow. Because he filled out the form, escrow did not have to pay his $25,432.87 to the FTB, and now he is himself responsible to pay that amount to the FTB on his 2025 taxes.
                </div>
                
                <div>
                  • Alvero DID not fill out her form and turn it in to escrow; her 35% portion of the state taxes she owes had to be paid from the escrow, and that is reflected on the final closing statement.
                </div>
                
                <div>
                  • BUT—when she files her 2025 State taxes, Alvero will NOT have to pay that $13,694.62. It has been paid. If Wauters had also decided to have his 65% paid from escrow so that he, like Alvero no longer had any tax liability to the state for 2025, they would be even, and neither one would be paying any tax on the sale of the house.
                </div>
                
                <div>
                  • Alvero's suggestion that because now only she has no tax liability for 2025 from the sale that she can make Wauters whole by paying him 65% of $13,694.62 makes no sense and does not make Wauters whole. The only way to compensate Wauters in this scenario is to make it so he also has no 2025 tax liability: he is paid from escrow prior to the 35 / 65 division his tax liability: $25,432.87. The payment does not come from Alvero after the division of proceeds, it comes from the funds transferred out of escrow ($280,355.83) before they are divided, just as if Wauters, like Alvero, had refused to sign the form, causing the escrow agent to send $25,432.87 to the FTB on his behalf.
                </div>
                
                <div>
                  • This will reduce the money to be split between them by $25,432.87, but that is exactly what would have been split between the two if Wauters had done the same thing as Alvero and refused to sign the form.
                </div>
                
                <div>
                  • THUS, the proper amount to divide between the parties is the amount in the trust account minus what would have been sent to the FTB if Wauters had also not signed the form, or:
                </div>
                
                <div className="ml-8 font-mono">
                  <div>280,355.83</div>
                  <div>-- 25,432.87</div>
                  <div>--------</div>
                  <div>$ 254,922.96</div>
                </div>
                
                <div>
                  • The "Proceeds from Escrow" to be divided now total $ 254,922.96
                </div>
                
                <div>
                  • Prior to the division, and the first funds to be paid to Mr. Wauters directly, total: $25,432.87
                </div>
              </div>
            </div>

            {/* Amount of Proceeds to Be Split */}
            <div className="mb-6">
              <div className="font-bold text-base mb-2">Amount of Proceeds to Be Split 35 / 65</div>
              <div className="mb-4">
                <div className="font-bold">Alvero Declaration ¶ 43</div>
                <div className="italic ml-4">
                  Alvero's distribution formula starts by taking the actual amount in the trust account coming out of escrow as the proceeds from the sale of the home ($280,355.83) and increasing it by $77,799.88 to represent mortgage payments made from escrow (but without actually increasing the total amount of currency to distribute) such that the number to use for dividing is $358,155.71.
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="font-bold">Alvero's Share from the Proceeds is $116,453.00</div>
                  <div className="ml-4">
                    35% of $358,155.71 = $125,354.50, from which Alvero claims she needs to remit to Wauters 65% of the $13,694.62 that was paid on her behalf, leaving her take to be: $116,453.00
                  </div>
                </div>
                
                <div>
                  <div className="font-bold">Wauters Share from the Proceeds is $163,902.83</div>
                  <div className="ml-4">
                    65% of $358,155.71 = $232,801.21 From which Alvero here proposes no longer to split the mortgage payments 65/35 but now simply assigns all the mortgage, taxes and insurance to Wauters as a deduction:
                  </div>
                  <div className="ml-4">
                    $232,801.21 - $77,779.88 = $155,001.33
                  </div>
                  <div className="ml-4">
                    To this she then adds back what she says she should pay for her taxes, 65% of what she owes for 2025 or 65% of $13,694.62 = $8,901.50
                  </div>
                  <div className="ml-4">
                    Added to the $155,001.33 + $8,901.50 = $163,902.83
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Petitioner's Request Details */}
          <div>
            <div className="font-bold text-lg mb-4">PETITIONER'S REQUEST DETAILS</div>
            <div className="space-y-4">
              <div>
                <div className="font-bold">43. Pursuant to the June 27, 2024, Judgment, I am requesting for this Court to divide the net proceeds as follows:</div>
                <div className="ml-4 space-y-2">
                  <div>
                    a. 35% of the net proceeds from the sale of the property in the amount of $116,453.00 payable directly to me. This amount represents 35% of $358,155.71 which is $125,354.50 minus $8910.50 (Respondent's 65% of $13,694.62 I withheld tax).
                  </div>
                  <div>
                    b. 65% to Respondent in the amount of $163,902.83. This amount represents 65% of the $358,155.71, which is $232,801.21 minus $77,779.88 (unpaid mortgage/escrow)= $155,001.33 plus $8,901.50 (for his 65% of $13,694.62 withheld by me for taxes).
                  </div>
                  <div>
                    c. From his share Respondent shall pay me the funds owed pursuant to the June 27, 2024, Judgment:
                  </div>
                  <div className="ml-4 space-y-1">
                    <div>i. $46,200 plus 10% interest for the total of 50,395.94 payable to me for Watts charges from January 2021 to September 2023</div>
                    <div>ii. $122 per month plus 10% interest for the total of $266.16 payable to me for Watts charges from October 1, 2023, to November 30, 2023.</div>
                    <div>iii. $18,112.50 plus 10% interest for the total of $19,648.20 payable to me for Watts charges from December 1, 2023, to November 16, 2024. Pursuant to the Court's discussion and findings on page 15 through 18 of the Judgment, my interest in Watts charges was offset by Respondent's payment of mortgage/insurance/taxes. As discussed above, Respondent's last payment on the mortgage/insurance/taxes was November 1, 2023. My expert at trial testified that the property could rent for $4,500. Since Respondent did not pay for mortgage/taxes/insurance from December 1, 2023, to November 16, 2024, I should be entitled to 35% of the monthly rent, which is $1,575 per month, without any offset.</div>
                    <div>iv. $5,761.81 plus 10% interest for a total of $6,285.10 payable to me for my share of the rental income received by Respondent from December 20, 2020, to September 2023.</div>
                    <div>v. $5,855 plus 10% interest for the total of $6,386.73 payable to me for my share of the 2015 Ural Dual Sport Motorcycle. I would like to note for the Court that, Respondent accessed the property on or before April 20, 2025, and removed the motorcycle in violation of the current restraining order prohibiting him from coming onto the property.</div>
                    <div>vi. $7,500 plus 10% interest for the total of $8,181.16 payable to me for my share of the miscellaneous household items.</div>
                    <div>vii. $4,172.35 for Respondent's 65% share of the $6,419 clean up and repair cost to prepare the property for sale.</div>
                    <div>viii. $2,470 for cost I incurred to remove the items abandoned by Respondent when he vacated the premises in November of 2024. Beginning in November 2024, I attempted to have Respondent remove the items he left behind. On November 18, 2025, my attorney sent a letter asking Respondent to remove his belongings by November 30, 2024. On November 30, 2024, at 2:45pm, Respondent's wife come to the property and removed the majority of their personal items but left a large majority of the other items which was littering the backyard. Respondent's wife was given access to the property until 9pm. Prior to leaving, Respondent's wife told me that she would return on December 1st to remove the remaining items. The remaining items include scrap wood, scrap metal, a bathtub, Ural motorcycle, chairs, tables, broken furniture, rugs, tools, and other miscellaneous items. Respondent's wife contacted me and told me that she could not return on December 1st but will return on December 2nd. The realtor had scheduled a photographer to take pictures of the property on December 11th, and I was told to clear out the junk including the items specified above. On December 6, 2024, my attorney forwarded to me an email sent by Respondent with enclosed letter claiming to give me notice of "Unlawful Self-Help Eviction". The letter did not specify when Respondent would return to retrieve his items. When I did not hear back from Respondent or Respondent's wife regarding the items to be removed, I asked my attorney to send another letter to Respondent. On December 9, 2024, my attorney sent a letter to Respondent asking him to make arrangement to remove the remaining property. The letter further stated that if the items are not removed by December 14th, I would discard the items and ask for reimbursement of cost. Respondent did not respond. I also reached out to Respondent's wife's friend via text message, but my texts were ignored. I reschedule the photography and discard specified items as noted in my attorney's letter. In May 2025, when the property was in escrow, Ron Melendez reached out to Respondent to remove his furniture/furnishings and other items in the property. I am informed Mr. Melendez also attempted to reach out to Respondent through a consulting attorney inquiring when Respondent would be removing his items. Respondent did not make any attempt to remove his property, and I had to pay to haul the items and clean the house before the buyer took possession.</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="font-bold">44. Attached as EXHIBIT 9 is a summary of the detailed calculation of the Judgment amount owed, and the interest accrued.</div>
              </div>
              
              <div>
                <div className="font-bold">45. Attached as EXHIBIT 10 is an itemized list of the cost of clean-up/repair and removal of Respondent's items.</div>
              </div>
              
              <div>
                <div className="font-bold">46. I am further requesting for Respondent to pay his share of the debt owed to Los Angeles Department of Water and Power ("LADWP") for charges incurred while he was residing on the property. I was able to reach an agreement with LADWP to close the account to avoid impacting the new owners in exchange for being paid after the close of escrow. The total amount due is $4,636.68. I was in possession of the property from November 16, 2024 to the date of sale and will be liable for $560.12. The remaining balance was incurred while Respondent was in the home and should be charged against his interest. Attached as EXHIBIT 11a is a copy of the invoice showing the outstanding balance. Attached as EXHIBIT 11b is a copy of the invoice showing the outstanding balance as of December 2024. I am asking for this Court to permit my attorney to write a check directly to LADWP to pay off the entire balance of $4,636.68. The source of this fund should be $4,076.56 from Respondent's share and $560.12 from my share.</div>
              </div>
            </div>
          </div>

          {/* Request for Monetary Sanctions */}
          <div>
            <div className="font-bold text-lg mb-4">REQUEST FOR MONETARY SANCTIONS</div>
            <div className="space-y-4">
              <div>
                <div className="font-bold">47. I am requesting this court to sanction Respondent in the amount of $40,000 for his failure to cooperate and his refusal to follow this Court's order, which increased the cost of litigation.</div>
              </div>
              
              <div>
                <div className="font-bold">48. While living in the property Respondent failed to make mortgage payment which led On July 2, 2024, the Court ordered the house to be list for sale by July 15th and appointed realtor. Please see Exhibit 2.</div>
              </div>
              
              <div>
                <div className="font-bold">48. Here are some examples of Respondent's act or omissions in violation of the Judgment and subsequent orders that led to increase cost of litigation to me.</div>
                <div className="ml-4 space-y-2">
                  <div>Despite the July 12, 2024, Order, Respondent refused to sign the listing agreement and either did not respond to the realtor's request or made demands that were clearly meant to delay the listing. This forced me to incur fees to have my attorney contact the Court to have the listing agreement signed by the Elisor.</div>
                  <div>a. In April 2024, I found out that Respondent had not paid the mortgage since November 2023.</div>
                  <div>b. On May 1, 2025, my attorney sent a letter asking Respondent to agree to list the property for sale to avoid foreclosure. The letter proposed multiple realtors for Respondent to choose from and invited him to propose his own; Respondent did not respond.</div>
                  <div>c. Because we were receiving notice of potential foreclosures, I filed an ex parte Request for Order on June 14, 2024. The hearing on my ex parte Request was scheduled for July 2, 2024</div>
                  <div>d. On July 2, 2024, the Court ordered the house to be list for sale by July 15th and appointed realtor. Please see Exhibit 2.</div>
                  <div>e. Despite the July 12, 2024, Order, Respondent refused to sign the listing agreement and either did not respond to the realtor's request or made demands that were clearly meant to delay the listing. This forced me to incur fees to have my attorney contact the Court to have the listing agreement signed by the Elisor.</div>
                  <div>f. Despite multiple attempts by the realtor to inspect and photograph the property, Respondent only allowed the realtor to access the property once after the July 12, 2024, Order.</div>
                  <div>g. On August 9, 2024, I filed a Request to have sole possession of the property since Respondent was not cooperating with the realtor. Respondent also sent emails threatening to tell the potential buyers that he will not move out. In his emails he also made unreasonable demands including requiring the buyers to allow him to live in the property for 30 days after the close of escrow. The Court set a hearing on my ex parte Request for August 27th but continued this date to September 12th to allow Respondent to file a response to my request and for the realtor to submit an updated declaration.</div>
                  <div>h. On September 4, 2024, I filed a reply to Respondent's Responsive Declaration. In my Reply I notified the Court of Respondent's repeated failure to cooperate with the realtor to give access to the property.</div>
                  <div>i. On September 8, 2024, my attorney filed Mr. Melendez's declaration confirming the attempts he made to schedule time to visit the property for inspection and photography. A true and correct copy of the Declaration filed on September 8, 2024, is attached as EXHIBIT 12.</div>
                  <div>j. On September 12th, we appeared for a hearing and the Court made specific orders requiring the Respondent to clean the property to make it ready for showing by a given date and to allow the realtor to access the property. The Court also set a hearing on October 3, 2024. Respondent did not respond to request by Mr. Melendez to enter the property to take photographs and Mr. Melendez had to cancel the scheduled photography session. A true and correct copy of the Declaration of Ron Melendez filed on October 2, 2024, is attached as EXHIBIT 13.</div>
                  <div>k. On October 3, 2024, the Court ordered Respondent to vacate the property by October 13th. Respondent did not vacate by this date. Instead, I had to contact the LA County Sheriff's Office and LAPD to have him removed. I also agreed to give him an additional one-week to remove his items (remove by 11/16/24) but he still failed to do that costing me to incur expenses to remove his belongings.</div>
                  <div>l. After Respondent vacated, I gained access to the property and found that it was still littered with junk. As discussed above, my attorney sent 2 letters to ask him to remove his personal belongings and the junk he left in the backyard and storage. He only removed personal items and left the rest for me to spend money to discard.</div>
                  <div>m. In April 2025 we received an offer from a potential buyer, and I countered. Right when we were poised to have escrow opened, Respondent refused to sign documents necessary to open escrow. This required me to have my attorney contact the Court to have Elisor signature.</div>
                  <div>n. On April 29th, the property was scheduled for appraisal by the potential buyer. However, I was informed that the appraisal was cancelled because Respondent did not sign the necessary documents. Due to the delay in getting appointment for Elisor signature, I asked my attorney to file ex parte to have this Court sign the documents to safeguard the sale. A hearing on my ex parte Request was scheduled for May 1, 2025</div>
                </div>
              </div>
              
              <div>
                <div className="font-bold">50. Since May of 2024, I have incurred over $23,000 in attorney's fees and cost which are directly related to Respondent's 1) failure to pay the mortgage putting the property at risk of foreclosure, 2) refusal to cooperate to list the property for sale, and 3) refusal to follow this Court's orders.</div>
              </div>
              
              <div>
                <div className="font-bold">51. Based on the above, I am requesting for Court to sanction Respondent and order that I receive $40,000 from his share of the proceed from the sale of the home.</div>
              </div>
            </div>
          </div>

          {/* Respondent's Argument */}
          <div>
            <div className="font-bold text-lg mb-4">RESPONDENT'S ARGUMENT</div>
            <p>
              With any luck, this will be the last post-judgment hearing on a dissolution petition that seems like it should have gone smoother than it did. Because it didn't, we are here on Petitioner's request for this Court's determination of how the proceeds from the escrow of the sale of the marital residence should properly be apportioned between the parties. The Court's Order (after trial) dated December 28, 2023, directs that the amount transferred from escrow to the trust account of Petitioner's counsel ($280,355.83) first be split: 35% ($98,124.54) to Alvero and 65% ($182,231.29) to Wauters. From this division of the proceeds, the Court then directs that certain amounts be paid to Alvero from Mr. Wauters' share, including:
            </p>
            
            <div className="ml-4 space-y-1">
              <div>$46,200 in Watts charges Jan. 2021 to September 2023 ($3,500 * 35% = $1,225/mo.) * 20 mo.</div>
              <div>$ 3,675 in Watts charges Oct. 2023 to December 2023 ($3,500 * 35% = $1,225/mo.)</div>
              <div>$18,112.50 Watts charges from December 1, 2023, to November 16, 2024.</div>
              <div>$5,761.81 rental income</div>
              <div>$5,855 Motorcycle.</div>
              <div>$7,500 Household Items</div>
              <div>$4,172.35 for Respondent's 65% share of the $6,419 clean up and repair cost to prepare the property for sale.</div>
              <div>$2,470 for cost I incurred to remove the items abandoned by Respondent when he vacated the premises in November of 2024.</div>
            </div>
            
            <p className="mt-4">
              The $358,155.71 but not entered until June 27, 2024, sets out the basic formula to be used: the amount transferred from escrow is first split 35/65 with several additional specific items/amounts identified in the Order to then be paid to Ms. Alvero from Mr. Wauters allotment. This Court's Findings and Order After Hearing dated July 12, 2024, added one additional obligation and item to be charged to Mr. Wauters: "The fees and costs related to the unpaid mortgage premium and foreclosure…," but required for this particular deduction that that Ms. Alvero "…shall include an itemized list and explanation of any requests for reimbursement…" of those particular fees and costs. FOAH dated July 12, 2024 @ ¶ 7.
            </p>
            
            <p className="mt-4">
              It should be no surprise that in the 17 months between the issuance of the statement of decision / Order after trial on December 28, 2023, and the May 30, 2025, transfer from of the proceeds from escrow, notable events occurred and circumstances changed that should warrant this Court making deductions, set-offs, additions or adjustments to the items that this Court previously Ordered to be taken into account. Despite the Court's more transparent and certain prescription that the starting point for the calculation be the amount transferred from escrow to her counsel's trust account ($280,355.83) are Respondent's sole obligation and shall be deducted from his portion of the proceeds. to then be the formula to be used at arriving at the final division of remaining assets dictated by the Court themselves, although application of the Order's it has previously made a that she be awarded $40,000 in attorneys' fees, 10% pre-judgment interest starting July 27, 2024, a credit of $70,000 to relieve her of having to contribute to the mortgage payments (including during a time in which only she possessed the house), reimbursement of $6,500 in cleaning fees of suspicious amount and origin, $7,500 for and other miscellaneous items pursuant to this Court's previous Orders and Judgment.
            </p>
          </div>

          {/* Additional Arguments */}
          <div>
            <div className="font-bold text-lg mb-4">ADDITIONAL ARGUMENTS</div>
            <p>
              Despite the agreement made between the parties years ago, prior to the marriage, and this Court's Judgment confirming that Petitioner is entitled to 35% of the marital assets, petitioner requests in her moving papers that additional credits, offsets, and awards be granted by the Court which, if awarded and totaled-up would equal $254,258.64 (or 90%) of the $280,355.83 to be divided. The $280,355.83 now waiting in trust to be divided between the parties is what is left over from the recent, Court-ordered sale of the house that Mr. Wauters and Ms. Alvero purchased at the end of February 2020 (the last year of their six-year marriage). When they decided to end the marriage in late 2020, Alvero had no desire to keep any interest in the home. Earning her 35% interest would require that she pay half the monthly mortgage, half of the tax obligations, half of the insurance, and half of any of the other carrying costs. If she never explicitly stated that she had no desire to do that, her actions over the last five years said that for her. In all of that time, she never once contributed to paying her half of the monthly mortgage, not even during the 6 months at the beginning of this year when she had exclusive possession of the residence. Nor did she ever pay a penny to the taxes, insurance, utilities or other costs. Prior to having access to the advice of counsel, she never expressed an interest in residing in the house and instead began a new life, in a new city, an 8-hour drive away. Until there was a reason, informed by some new litigation strategy in this case, to state otherwise, she had always acted in accord with the way that she no doubt felt: the house was always more appropriately described as Mr. Wauters' house rather than "their" house, or "her" house.
            </p>
            
            <p className="mt-4">
              Prior to the point half-way through this dissolution action when Alvero first retained counsel, she laid no claim to the house itself and only sought to have Mr. Wauters make good on his assurances that she would be granted some amount of money appropriate to recognize the small contributions she did make to the purchase and ownership of the house (she was on the title, for example, and remained there pending some solution to facilitate her removal). Mr. Wauters, for his part, also acted in accord with the understanding that it was his house: he convinced his father to loan the 30% down payment that needed to be made in order to qualify for a loan on the house, and promised that he (and only he) would repay that loan. He paid the mortgage each and every month, never asking Ms. Alvero to pay her half, nor her half of the taxes, insurance, utilities, maintenance and upkeep. He resided in the house and made it his home year after year until he remarried, at which time he and his new wife made the house "their" home.
            </p>
            
            <p className="mt-4">
              And for the first couple of years (from the time when Alvero and Wauters both knew their marriage was ending, until the time that Alvero retained counsel in this case at the end of November 2022) everyone acted in accord with this understanding. On the day she filed the dissolution petition, Alvero knew that she had not and would not contribute her half of the mortgage obligation and other costs necessary to earn a claim to any interest in the home. It is hard to imagine any way that she could have changed her mind about that since then (because nothing changed in the facts giving rise to that belief). After retaining counsel, however, Alvero clearly changed her mind regarding whether or not she could convince a Court of law to grant her more rights to the home than she really deserved (more of an interest than she had really earned). For some people these are two different things (the difference between what you know in your heart you have earned / morally deserve, and what you might be able to convince a Court to grant to you).
            </p>
            
            <p className="mt-4">
              In the end (after the trial of this matter), Alvero was, as it turns out, able to convince this Court to grant her more than she earned or deserves: she was awarded 35% of the value of a home that she did not, in more than five years, ever pay a penny for. She literally contributed nothing, and walked away with 35%. But even that is a gross distortion of the truth. After the sale of this home just a few months ago, there appeared to be a surplus, coming out of escrow and ear-marked for the parties in this action to split between themselves, totaling $280,355.83. But the idea that there is a $280,000 surplus to be divided is a fiction and a fantasy disrespecting real people that do not deserve this Court's disrespect.
            </p>
            
            <p className="mt-4">
              The house could not be purchased without a 30% down payment (totaling $237,000). Nor could the house be purchased without reducing Alvero's pre-purchase date by $30,000. Nor would the house have been saved from foreclosure (and available for the sale that happened a few months ago) without the one-time $30,000 mortgage payment in June 2023. Each of these payments had to be made, either to get, or to keep this house, and all of these three payments (totaling almost $300,000) were in fact made by Mr. Wauters father, upon the pleading of his son, the respondent, and upon his solemn promise to repay the debt. But despite the fact that the funds loaned from his father to enable the purchase of the home were in fact a loan to be repaid, that "promise to repay" could not be represented as such—could not be represented as debt– because were it to be represented as debt to be borne by Wauters, his debt to income ratio would be affected substantially, and more than enough to disqualify him from getting the loan. In fact, the underwriting of the loan would detect the inflow of the money used to cover the downpayment and so Mr. Wauters was required by the lender to obtain a "gift letter" from his father designating the money as a gift and not debt. But the fact remains: it was and still is an obligation that must be repaid to his father, who is a shopkeeper in a small Belgian town (population: 10,000) and a man of meager means. The declaration of Mr. Wauters attests to the debt nature of the downpayment and declares 1) that Petitioner herself was and is well-aware that the downpayment and the additional funds contributed by Mr. Wauters' father ($300,000 when including both the pre-loan paydown of Ms. Alvero's credit card debt and the funds loaned in order to bring the mortgage out of default in June 2023) were not a gift, 2) that Petitioner knew that Mr. Wauters was obligated to repay his father, 3) the loan to his and that for a period of time and when he was able to do so, Mr. Wauters made $1,000/month interest payments to his father.
            </p>
            
            <p className="mt-4">
              These facts were not adduced at trial, mostly because their import was not foreseen, but presently, this fact downpayment had to be represented instead as a "gift" and reflected in an executed "gift letter" (without which the mortgage lender would view the $237,000 down payment as additional debt born by Wauters that would, in the debt column, disqualify him for the mortgage), Alvero's counsel had this clever, but deceptive argument to make to this Court at trial: The downpayment was just a gift that Mr. Wauters wanted to make to the couple, and the $240,000 need not be treated as a debt on the house.
            </p>
            
            <p className="mt-4">
              The argument somehow stuck. This Court seems to have bought it.
            </p>
            
            <p className="mt-4">
              This present motion is only in small part a dispute over what mathematical formulas should be applied to this Court's to apply to this, along with his new wife, o would require that each of them agreed that Alvero had no desire to keep any interest in the home
            </p>
            
            <div className="ml-4 space-y-1">
              <div>1. The house that Cost $900,000.00</div>
              <div>2. The house that required a downpayment of 30% (approximately $300,00) that Wauters borrowed from his father, and borrowed upon his (and only his) promise to repay the loan</div>
              <div>3. The house that Alvero could eventually own 35% of, if and only if she paid half of the carrying costs such as the mortgage payments, taxes, utilities, insurance and other expenses</div>
              <div>4. despite the pre-purchase agreement to split these fees,</div>
              <div>5. At trial, this Court entered a judgment decreeing that, from the proceeds of the sale of the home, Ms. Alvero is entitled to 35% of the proceeds, and Mr. Wauters is entitled to 65%. There are certain line items charged by the Court to Mr. Wauters as well (Watts charges, compensation for a motorcycle, etc..), but if Ms. Alvero receives all she requests from the Court, instead of taking her 35% share of the proceeds, she will be awarded 90% of the funds from the sale (she will receive $280,355.83 and Mr. Wauters will receive $26,0471.19). Over the course of the 5+ years the house was owned, Ms. Alvero never once made a mortgage payment, never once paid a tax bill, never once paid a utility bill, including during the six months she had sole possession of the property, and without paying a single penny towards the house, she now asks for 90% of the proceeds from the sale. The majority of the additional funds she claims are justified as a punishment to Mr. Wauters for what she alleges was his intentional scheme to prevent the sale of the residence.</div>
            </div>
            
            <p className="mt-4">
              It is a sickening proposition if you fill in just a few of the details. With his $26,000, Mr. Wauters can repay a sliver of the money he borrowed for the down payment on the house, and still hold a debt totaling $330,000.00. If you examine the Delta between what each will take away from their six-year marriage, Ms. Alvero will leave with $610,000.00 more than Mr. Wauters. The request is mean spirited and devoid of decency. It seems to be in line with the way he was treated throughout the case once Ms. Alvero retained counsel. He was outgunned and taken advantage of at every opportunity. Ms. Alvero and her counsel continue to do what they did when Mr. Wauters was unrepresented, except he now has someone to look after him. The Petitioner in this Request for Order misstates facts, provides incomplete information in a manner that distorts the truth, cites authority that doesn't say what she claims it says, references statutes that have no application to the points presented, and, in general, comes before this Court with unclean hands. Petitioner and her counsel are simply being mean, in a manner and to an extent that warrants derision. Their conduct and the intent behind it is simply wrong. Mr. Wauters was not a saint. He was turned upside down, worked over, and driven half out of his mind from the games that were played. But he was never malicious, he never sought to cause harm, and he would never do to Ms. Alvero what she had done to him. He was simply out of his league and more vulnerable than he could have imagined.
            </p>
          </div>

          {/* Legal Argument Section */}
          <div>
            <div className="font-bold text-lg mb-4">LEGAL ARGUMENT</div>
            
            <div className="mb-6">
              <div className="font-bold text-base mb-2">A. The Legal Grounds for an Award of Fees and the Argument Against Such an Award</div>
              <p>
                As concerns Alvero's request for an award of attorney's fees under Family Code § 271, unlike all other forms of fee awards in Family Court (which are designed to insure that even the indigent have access to counsel in Family Law proceedings so as to maintain integrity in the system and in the Orders it issues), the sanctions of § 271 are designed to safeguard and foster the goal of promoting the settlement of disputes (any conduct found to be an intentional frustration of that goal being therefore punishable under § 271). Alvero, however, does not make her request upon such grounds. Instead, she seeks attorneys' fees under case law that she claims to hold support for her proposition that "[w]hen a party intentionally delays the sale of property ordered in a judgment, the remedies may include the award of attorney's fees and other financial consequences for breaching fiduciary duties." She cites In re Marriage of Hokanson for that proposition. But Hokanson was not decided under, nor were the legal issues it considered anything having to do with, Family Code §271. Hokanson concerned Family Code §721 (confusing §271 with §721 is certainly understandable, but nonetheless a confusion). Hokanson was not about conduct found to be an intentional frustration of the goal of promoting settlement in Family Court cases punishable under § 271, it was about remedies (not punishment) for breaches of the fiduciary duties that spouses have to each another with respect to the management and control of community property under Family Code § 721(b) and Family Code § 1100(e).
              </p>
              <p className="mt-4">
                There, the wife had sole possession of the residence for 20 months and the sole obligation, post-judgment, to price and list the residence, using an unsupportable asking price and other excuses to actively and intentionally prevent the house from selling. The sanctions authorized by the Hokanson Court under Family Code § 1100(e) in overturning the lower court's denial of fees were nonetheless issued not as a function of punishment, but in compensation for the loss of the time value of money, and only then upon competent evidence of exactly what that lost value was and how it was calculated. In our matter, Alvero had sole possession of the home (post-order for sale) for 6.5 months, compared to Wauters' 4 months of sole possession, and, regardless, the order for sale was not placed upon Wauters, but upon both parties, jointly, with the provision of a Court-devised remedy (an elesor and Court-appointed sales agent) to act as a stop-gap to correct for any delays that might arise from either party.
              </p>
              <p className="mt-4">
                Alvero next relies upon In Re Marriage of Kozen (1986) 185 Cal. App. 3d 1258, a reliance that is perplexing at best: In Re Marriage of Kozen simply has nothing to do with an award of attorneys' fees under Family Code §271 at all. Kozen doesn't even mention §271, but instead involves a dispute where the appellant-husband was seeking to overturn the lower court's award of attorneys' fees based upon the argument "…that (1) the evidence did not show that wife needed the money or that he had the ability to pay it, and (2) the amount of fees and costs were unreasonable." Id., at 1264.
              </p>
              <p className="mt-4">
                Putting aside the lack of authority for the entry of an award of fees under §271, Respondent Wauters argues: 1) It is hard to claim that Wauters interfered with the settlement of this present suit (the only justification for awarding fees under § 271) when the conduct Alvero complains about took place six months after the Court had announced its Judgment; 2) The declaration of Mr. Wauters adequately recounts the history of this action and his good faith efforts to push it towards an out-of-court settlement and away from resolution by trial on the merits, and, irrespective of either of these things, 3) It is hard to justify an award of $40,000 in fees when Alvero doesn't itemize any charges, provide any back-up for the amount, or even argue why the amount of the award should be $40,000 vs $60,000 or $20,000 or $3.00.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="font-bold text-base mb-2">B. The Legal Grounds for an Award of Interest and the Argument Against it</div>
              <p>
                Alvero's seems to be requesting PRE-judgment interest (rather than the post-judgment interest referenced in the law she cites) insofar as every item of judgment she seeks interest upon are all items that were ordered to be paid out of the proceeds of the sale of the residence, not items ordered to be paid upon entry of the judgement. Despite lacking any legal support for her request, or factual support justifying such an order, she relies upon the same allegations underpinning her request for the punishment of attorneys' fees: Wauters delayed the listing of the home, refused to allows the realtor to inspect, refused to clear his junk, and refused to move out so she could clean it up. See, Alvero's P & A's at p.5, ll. 6-10.
              </p>
              <p className="mt-4">
                But no money was due on the date of the judgment; no "intentional interference with the listing" on the part of Mr. Wauters has been shown (or alleged, really); nor is there evidence of a causal link between the conduct complained of (intentional or not) and the failure of the sale of the house to close on some date prior to the date that it did in fact close. Put another way: Alvero does not prove (or even argue) that had Mr. Wauters not done what she says he did, the house would have sold sooner than it did. Because she had sole possession of the residence for 63% of the time between the date it was ordered to be listed and the date of the sale, the argument that she instead had caused the delay would be more compelling.
              </p>
              <p className="mt-4">
                The supporting law Alvero provides is equally unimpressive. The code sections she cites (Code of Civil Procedure §685.010(a), §680.270, and §685.020(a)) are simply statutes that define a judgment, authorize attaching interest to a perfected but unpaid judgment, and establish the legal rate of that interest. If these Code citations she provides the Court stand for anything, they stand to establish that until the proceeds from the sale of the residence hit her attorney's trust account on May 30th, she did not have a perfected judgment to which post-judgment interest could attach (each of the line items in this Court's Judgment were to be paid from the proceeds of the sale of the home). Ironically, once again, it was Alvero and her counsel that held onto the undisputed funds of the parties for longer than necessary and refused to engage in good faith settlement negotiations over the proper allocation of funds to the parties (an act which, if scrutinized under the logic used here by Alvero, should in fact constitute a delay of settlement, sanctionable under Family Code §271).
              </p>
              <p className="mt-4">
                The Judgment in this matter called for the proceeds to be divided 35 Alvero / 65 Wauters, and called for certain offsets to be applied. Since the May 30, 2025 deposit into the trust account of Alvero's counsel of the $280,355.83 in proceeds released from escrow, the best offer Alvero has made to Wauters for settlement (an offer first made a month after the proceeds hit the account) was, essentially, that Wauters take $20,000 of the $280,355.83 and Alvero (the 35% award recipient) keep all the rest. The justification for such an outrageous "offer" has always been Alvero's insistence on her right to seek attorneys' fees and interest, together totaling over $65,000.00 (despite the fact, as it should now be clear, that she is in no way entitled to either one of those things), and her right to receive the other favorable awards discussed in the attached Declaration of Thomas J. Rotert, such as making Mr. Wauters pay for all of the mortgage payments prior to the close of escrow (something on the order of $70,000) when all this Court ordered Mr. Wauters to pay from the Mortgage was costs and fees related to late payments and pre-foreclosure activities).
              </p>
              <p className="mt-4">
                Despite the offensive nature of Alvero's last-best offer to expeditiously resolve this final dispute, at least there seemed to be $20,000 of the $280,355.83 that was not in dispute and could be distributed. Mr. Wauters had been in financial straits by now for some time already and had been sleeping in his attorney's spare bedroom when counsel's children were not in need of it (and then, on the spare couch). He desperately needed any funds he could get. Realizing he could at least get Mr. Wauters some money, counsel requested that the undisputed $20,000.00 be split between the parties, forthwith, on the 35 /65 basis, and (perhaps unwisely) made the request while revealing that Mr. Wauters' was in desperate need for funds (and revealing that Mr. Wauters' counsel was in desperate need of getting Mr. Wauters to sleep somewhere other than his spare bedroom). Instead of doing what any just and decent person would do under the circumstances (and what, most certainly, is simply required under the law), Alvero attempted to gain another advantage in the situation and eventually responded to the request with an "offer" that Wauters would be allowed to take all the undisputed $20,000.00 but only if he agreed to allow Alvero to take $98,124.54 of the $280,355.83 in funds, with the balance left in her attorney's trust account pending the hearing on her request to the Court that she then be allowed to take everything that was left, except for the $20,000 she had graciously allowed Mr. Wauters to take and keep.
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <div className="font-bold text-lg mb-4">CONCLUSION</div>
            <p>
              Nine pages of law and argument is what it took to properly address and oppose Alvero's request for the pre-judgment interest and fees to which she is clearly not entitled, and it required that amount of space and time for no other reason than that the request was made without any statutory authority, was made upon case law, proffered as applicable but in the end being found not to state or support the very proposition Alvero claimed it stood for, and was made upon arguments that can only be characterized as specious. It seems like Alvero was, much like her conduct in the rest of the case, going to try to get away with whatever she could get away with, overstep her bounds, and overstate her case, whenever she could. The declaration of counsel therefore needs to deal with all the other deductions and offsets Alvero seeks, in her bid to turn her 35% of the proceeds into (essentially) ALL of the proceeds.
            </p>
            <p className="mt-4">
              The math she uses, the logic she applies, and the manner in which she reads this Court's ordered additions to her 35% (in order to make her 35% into 95%) all follow a similar pattern to the manner in which she has attempted to persuade this Court that she is entitled to fees and interest as a punishment to Mr. Wauters. Unfortunately, because the response to these additional distortions and miscalculations must now be relegated to the declaration of counsel, many of them can only be exposed as inaccurate or incorrect by stating the fact, and without the benefiting of analyzing further the reasons (the motivations or objectives) behind the "mistakes" that Alvero makes in arguing how much bigger than 35% her slice of the pie should be. Her answer here, and always, is going to be "Much bigger. Much, much bigger!" In reality, if it were only justice as the guide, it should probably be smaller.
            </p>
          </div>

          {/* Signature */}
          <div className="text-center mt-12">
            <div>Date: October 3, 2025</div>
            <div className="mt-8">
              <div className="font-bold">THOMAS J. ROTERT, ESQ.</div>
            </div>
            <div className="mt-8">
              <div className="font-bold">By, Thomas J. Rotert, Esq.</div>
              <div className="font-bold">Attorney for Respondent,</div>
              <div className="font-bold">MATHIEU CHRISTIAN YVES WAUTERS</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mt-8">
            <div className="font-bold text-lg">RESPONDENT'S MEMORANDUM OF POINTS AND AUTHORITIES IN OPPOSITION TO</div>
            <div className="font-bold text-lg">PETITIONER'S REQUEST FOR INTEREST UPON JUDGMENT AND ATTORNEY'S FEES</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotertDeclaration;
