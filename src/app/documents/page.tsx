import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Mail,
  Download,
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Document Evidence - Legal Intelligence Platform',
  description: 'Organized repository of case documents and email evidence',
};

const documents = [
  {
    title: 'Form 593 - Real Estate Withholding Statement',
    type: 'Tax Document',
    date: 'May 16-24, 2025',
    source: 'Melinda Cook (Chartwell Escrow)',
    description: 'Critical document required to avoid CA FTB withholding. Mathieu completed, Rosanna did not.',
    badge: 'CRITICAL',
    badgeColor: 'bg-red-500',
    link: '/tax-withholding'
  },
  {
    title: 'Lakeview Mortgage Statement',
    type: 'Financial Document',
    date: 'May 20, 2025',
    source: 'Lakeview Loan Servicing',
    description: 'Reinstatement amount breakdown: $95,962.46 total with detailed line items.',
    badge: 'VERIFIED',
    badgeColor: 'bg-green-500',
    link: '/housing-costs'
  },
  {
    title: 'Email: Document Requirements',
    type: 'Email Evidence',
    date: 'May 16, 2025',
    source: 'Mathieu Wauters',
    description: 'Urgent email documenting Form 593 wet signature requirement and escrow documents.',
    badge: 'KEY EVIDENCE',
    badgeColor: 'bg-blue-500',
    link: '#'
  },
  {
    title: 'Email: Form 593 Warning',
    type: 'Email Evidence',
    date: 'May 20, 2025',
    source: 'Melinda Cook',
    description: 'Notice about missing SSN on Form 593 and warning about FTB submission.',
    badge: 'KEY EVIDENCE',
    badgeColor: 'bg-blue-500',
    link: '#'
  },
  {
    title: 'Email: Final Form 593 Notice',
    type: 'Email Evidence',
    date: 'May 24, 2025',
    source: 'Melinda Cook',
    description: 'Final warning about needing corrected Form 593 with perjury statement.',
    badge: 'CRITICAL',
    badgeColor: 'bg-red-500',
    link: '#'
  },
  {
    title: 'Escrow Closing Statement',
    type: 'Financial Document',
    date: 'May 30, 2025',
    source: 'Chartwell Escrow',
    description: 'Final settlement statement showing $280,355.83 total proceeds and distributions.',
    badge: 'VERIFIED',
    badgeColor: 'bg-green-500',
    link: '/case-financials'
  },
  {
    title: 'Grant Deed',
    type: 'Legal Document',
    date: 'May 2025',
    source: 'Chartwell Escrow',
    description: 'Property transfer document for 3525 8th Avenue. Required notarization.',
    badge: 'OFFICIAL',
    badgeColor: 'bg-purple-500',
    link: '#'
  },
  {
    title: 'Disbursement of Seller Proceeds Instructions',
    type: 'Financial Document',
    date: 'May 2025',
    source: 'Chartwell Escrow',
    description: 'Instructions for distribution of sale proceeds. Required notarization.',
    badge: 'OFFICIAL',
    badgeColor: 'bg-purple-500',
    link: '#'
  }
];

const categories = [
  { name: 'All Documents', count: documents.length },
  { name: 'Email Evidence', count: 3 },
  { name: 'Financial Documents', count: 3 },
  { name: 'Tax Documents', count: 1 },
  { name: 'Legal Documents', count: 1 }
];

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Document Evidence</h1>
            <p className="text-slate-600 mt-1">Organized repository of case documents and communications</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <FileText className="h-4 w-4 mr-2" />
            {documents.length} Documents
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-0 bg-white sticky top-6">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="text-base flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="font-medium text-slate-700">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
                      <Search className="h-4 w-4 mr-2" />
                      Advanced Search
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Grid */}
          <div className="lg:col-span-3 space-y-4">
            {documents.map((doc, index) => (
              <Card key={index} className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{doc.title}</h3>
                        <Badge className={`${doc.badgeColor} text-white text-xs`}>
                          {doc.badge}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{doc.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc.type}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {doc.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {doc.source}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {doc.link !== '#' ? (
                        <Link
                          href={doc.link}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Analysis
                        </Link>
                      ) : (
                        <button className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-medium cursor-not-allowed">
                          Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
