import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Building,
  FileText,
  AlertTriangle,
  CheckCircle,
  Home,
  Gavel
} from 'lucide-react';

export const metadata = {
  title: 'Case Timeline - Legal Intelligence Platform',
  description: 'Complete timeline of events for FDI-21-794666',
};

const events = [
  {
    date: 'May 30, 2025',
    title: 'Property Sale Closed',
    description: '3525 8th Avenue escrow closed. Total proceeds: $280,355.83',
    icon: <Building className="h-6 w-6" />,
    color: 'bg-green-100 border-green-300 text-green-800',
    critical: false
  },
  {
    date: 'May 30, 2025',
    title: 'FTB Withholding Applied',
    description: '$13,694.62 withheld from Rosanna&apos;s proceeds due to incomplete Form 593',
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'bg-red-100 border-red-300 text-red-800',
    critical: true
  },
  {
    date: 'May 24, 2025',
    title: 'Final Form 593 Warning',
    description: 'Melinda Cook stressed importance of corrected Form 593 with perjury statement',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    critical: true
  },
  {
    date: 'May 22-24, 2025',
    title: 'Multiple Amendment Requests',
    description: 'DocuSign requests for Estimate & Final Amendment with FTB withholding references',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    critical: false
  },
  {
    date: 'May 20, 2025',
    title: 'Form 593 Issues Identified',
    description: 'Melinda Cook noted missing SSN on Mathieu&apos;s Form 593, warned would be sent to FTB',
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    critical: false
  },
  {
    date: 'May 16, 2025',
    title: 'Document Requirements Documented',
    description: 'Mathieu sent urgent email listing Form 593 as requiring wet signature',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'bg-green-100 border-green-300 text-green-800',
    critical: false
  },
  {
    date: 'May 15, 2025',
    title: 'Escrow Package Initiated',
    description: 'Tom Rotert sent initial escrow package. Melinda Cook initiated seller opening package',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    critical: false
  },
  {
    date: 'March 2023',
    title: 'Foreclosure Proceedings Begin',
    description: 'Lakeview Loan Servicing initiated foreclosure on 3525 8th Avenue',
    icon: <Home className="h-6 w-6" />,
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    critical: false
  },
  {
    date: 'March 2021',
    title: 'Divorce Petition Filed',
    description: 'FDI-21-794666: Mathieu Wauters v. Rosanna Alvero filed in Alameda County',
    icon: <Gavel className="h-6 w-6" />,
    color: 'bg-slate-100 border-slate-300 text-slate-800',
    critical: false
  },
  {
    date: 'June 2015',
    title: 'Property Purchased',
    description: '3525 8th Avenue purchased during marriage as community property',
    icon: <Building className="h-6 w-6" />,
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    critical: false
  }
];

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Case Timeline</h1>
            <p className="text-slate-600 mt-1">Complete chronological history of FDI-21-794666</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {events.length} Events
          </Badge>
        </div>

        {/* Timeline */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle>Event History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="flex items-start space-x-6">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full border-2 ${event.color}`}>
                      {event.icon}
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-slate-300 to-slate-100 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <Badge variant="outline">{event.date}</Badge>
                    </div>
                    <p className="text-slate-600">{event.description}</p>
                    {event.critical && (
                      <Badge className="mt-2 bg-red-500 text-white">Critical Event</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Case Duration</p>
                  <p className="text-3xl font-black text-blue-900">4.7 years</p>
                </div>
                <Calendar className="h-12 w-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Positive Events</p>
                  <p className="text-3xl font-black text-green-900">5</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Critical Events</p>
                  <p className="text-3xl font-black text-red-900">2</p>
                </div>
                <AlertTriangle className="h-12 w-12 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
