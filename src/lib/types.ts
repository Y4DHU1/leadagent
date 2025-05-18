
export type LeadStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal' 
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  position?: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  industry?: string;
  budget?: number;
  location?: string;
  aiScore?: number; // 0-100 AI-generated score for lead quality
  aiInsights?: string[]; // AI-generated insights about the lead
}

export interface LeadFilter {
  status?: LeadStatus[];
  priority?: LeadPriority[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
