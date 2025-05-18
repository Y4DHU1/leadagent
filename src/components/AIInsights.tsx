
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lead } from '@/lib/types';
import { useLeadContext } from '@/context/LeadContext';
import { Sparkles, RefreshCw } from 'lucide-react';

interface AIInsightsProps {
  lead: Lead;
}

const AIInsights: React.FC<AIInsightsProps> = ({ lead }) => {
  const { generateAIInsights, isLoading } = useLeadContext();

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-gray-100 text-gray-500';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-brand-600 to-accent2-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-white">
            <Sparkles className="h-5 w-5 mr-2" />
            AI Lead Analysis
          </CardTitle>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-xs"
            onClick={() => generateAIInsights(lead.id)}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {lead.aiScore !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">Lead Quality Score</div>
              <div className={`text-sm font-medium rounded-full px-3 py-0.5 ${getScoreColor(lead.aiScore)}`}>
                {lead.aiScore}/100
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-2 ${
                  lead.aiScore >= 80 ? 'bg-green-500' :
                  lead.aiScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${lead.aiScore}%` }}
              />
            </div>
          </div>
        )}
        
        {lead.aiInsights && lead.aiInsights.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
            <ul className="space-y-2">
              {lead.aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start text-sm">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-600">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No AI insights available yet.</p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2"
              onClick={() => generateAIInsights(lead.id)}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
