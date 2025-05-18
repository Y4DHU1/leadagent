
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/lib/types';
import { getStatusColor, getPriorityColor } from '@/lib/mockData';
import { useLeadContext } from '@/context/LeadContext';
import { 
  CalendarClock, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle,
  Edit,
  FileText,
  Trash2
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onView, onEdit }) => {
  const { deleteLead } = useLeadContext();
  const createdDate = new Date(lead.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {lead.firstName} {lead.lastName}
          </CardTitle>
          {lead.aiScore !== undefined && (
            <div className={`text-sm font-medium rounded-full w-10 h-10 flex items-center justify-center ${
              lead.aiScore >= 80 ? 'bg-green-100 text-green-800' :
              lead.aiScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {lead.aiScore}
            </div>
          )}
        </div>
        <div className="text-sm font-medium flex items-center text-gray-500">
          <Building2 className="h-3.5 w-3.5 mr-1" />
          {lead.company}
          {lead.position && <span className="ml-1">• {lead.position}</span>}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 mt-0.5 text-gray-500" />
            <span className="text-sm">{lead.email}</span>
          </div>
          
          {lead.phone && (
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
              <span className="text-sm">{lead.phone}</span>
            </div>
          )}
          
          {lead.location && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
              <span className="text-sm">{lead.location}</span>
            </div>
          )}
          
          <div className="flex items-start space-x-2">
            <CalendarClock className="h-4 w-4 mt-0.5 text-gray-500" />
            <span className="text-sm">Added on {formattedDate}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(lead.priority)}>
              {lead.priority} Priority
            </Badge>
            {lead.source && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                {lead.source}
              </Badge>
            )}
            {lead.industry && (
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                {lead.industry}
              </Badge>
            )}
          </div>
          
          {lead.aiInsights && lead.aiInsights.length > 0 && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <div className="flex items-center text-xs font-medium text-gray-500 mb-1.5">
                <AlertCircle className="h-3 w-3 mr-1" />
                AI INSIGHTS
              </div>
              <ul className="space-y-1">
                {lead.aiInsights.slice(0, 1).map((insight, index) => (
                  <li key={index} className="text-xs text-gray-600">
                    • {insight}
                  </li>
                ))}
                {lead.aiInsights.length > 1 && (
                  <li className="text-xs text-brand-600 font-medium cursor-pointer" onClick={() => onView(lead.id)}>
                    + {lead.aiInsights.length - 1} more insights
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => deleteLead(lead.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onView(lead.id)}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-xs bg-brand-600 hover:bg-brand-700"
              onClick={() => onEdit(lead.id)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
