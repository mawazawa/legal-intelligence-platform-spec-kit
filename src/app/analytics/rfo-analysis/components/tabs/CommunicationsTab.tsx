import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RFOAnalysisData } from '../../types';

interface CommunicationsTabProps {
  data: RFOAnalysisData;
}

export const CommunicationsTab = React.memo<CommunicationsTabProps>(({ data }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Communication Analysis with Realtor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Total Communications: {data.communications.totalEmails}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Petitioner:</span>
                    <span className="font-medium text-slate-800">{data.communications.petitionerEmails} emails (66%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Respondent:</span>
                    <span className="font-medium text-slate-800">{data.communications.respondentEmails} emails (34%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Response Time Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Petitioner:</span>
                    <span className="font-medium text-slate-800">{data.communications.petitionerResponseTime} days average</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Respondent:</span>
                    <span className="font-medium text-green-600">{data.communications.respondentResponseTime} days average</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64">
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-gray-500 mb-2">Communication Analysis Chart</div>
                  <div className="text-sm text-gray-400">Chart component temporarily disabled</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Communication Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Petitioner Communications</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Clear requests:</span>
                  <span className="font-medium text-slate-800">18 (58%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Vague requests:</span>
                  <span className="font-medium text-slate-800">8 (26%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Complaints:</span>
                  <span className="font-medium text-slate-800">4 (13%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Demands:</span>
                  <span className="font-medium text-slate-800">1 (3%)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Respondent Communications</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Clear responses:</span>
                  <span className="font-medium text-green-600">12 (75%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Questions:</span>
                  <span className="font-medium text-slate-800">3 (19%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Clarifications:</span>
                  <span className="font-medium text-slate-800">1 (6%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Complaints:</span>
                  <span className="font-medium text-green-600">0 (0%)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
CommunicationsTab.displayName = 'CommunicationsTab';
