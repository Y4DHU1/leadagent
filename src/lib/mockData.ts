
import { Lead, LeadStatus, LeadPriority } from "./types";

export const generateMockLeads = (): Lead[] => {
  const statuses: LeadStatus[] = [
    'New',
    'Contacted', 
    'Qualified', 
    'Proposal', 
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];
  
  const priorities: LeadPriority[] = ['Low', 'Medium', 'High'];
  
  const sources = [
    'Website', 
    'Referral', 
    'LinkedIn', 
    'Conference', 
    'Cold Call', 
    'Email Campaign',
    'Social Media'
  ];
  
  const industries = [
    'Technology', 
    'Healthcare', 
    'Finance', 
    'Education', 
    'Manufacturing', 
    'Retail',
    'Consulting',
    'Real Estate'
  ];

  const companies = [
    'TechSolutions Inc.', 
    'Global Health Corp', 
    'Finance Partners', 
    'EduTech Systems', 
    'Manufacturing Pro', 
    'RetailGenius',
    'ConsultPro Services',
    'RealtyExperts Group',
    'InnovateTech',
    'DataSmart Analytics'
  ];

  const aiInsightOptions = [
    'Has visited pricing page multiple times',
    'Shows high engagement with marketing emails',
    'Company recently received funding',
    'Contact has changed positions recently',
    'Company is in growth phase',
    'Competitor's client showing interest',
    'Seasonal buying pattern detected',
    'Multiple stakeholders from same company',
    'Engagement increased after recent product announcement',
    'Similar profile to previous successful conversions',
    'Research indicates budget approval cycle approaching',
    'Social media sentiment analysis shows positive interest',
    'Content engagement suggests technical evaluation stage',
    'Previously lost opportunity showing renewed interest'
  ];
  
  const mockLeads: Lead[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const aiScore = Math.floor(Math.random() * 101); // 0-100
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
    
    // Generate 1-3 random insights
    const numInsights = Math.floor(Math.random() * 3) + 1;
    const insights: string[] = [];
    for (let j = 0; j < numInsights; j++) {
      const randomInsight = aiInsightOptions[Math.floor(Math.random() * aiInsightOptions.length)];
      if (!insights.includes(randomInsight)) {
        insights.push(randomInsight);
      }
    }

    mockLeads.push({
      id: `lead-${i}`,
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      position: Math.random() > 0.2 ? `Position${i}` : undefined,
      email: `contact${i}@example.com`,
      phone: Math.random() > 0.3 ? `+1-555-${String(1000 + i).padStart(4, '0')}` : undefined,
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      notes: Math.random() > 0.5 ? `Some notes about lead ${i}...` : undefined,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      lastContactedAt: Math.random() > 0.5 ? new Date(createdDate.getTime() + Math.random() * 86400000 * 10).toISOString() : undefined,
      industry: industries[Math.floor(Math.random() * industries.length)],
      budget: Math.random() > 0.6 ? Math.floor(Math.random() * 90000) + 10000 : undefined,
      location: Math.random() > 0.3 ? `City${i}` : undefined,
      aiScore,
      aiInsights: insights,
    });
  }
  
  return mockLeads;
};

export const initialLeads = generateMockLeads();

export const getStatusColor = (status: LeadStatus): string => {
  const colors: Record<LeadStatus, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-purple-100 text-purple-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Proposal': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-emerald-100 text-emerald-800',
    'Closed Lost': 'bg-gray-100 text-gray-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: LeadPriority): string => {
  const colors: Record<LeadPriority, string> = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-red-100 text-red-800',
  };
  
  return colors[priority] || 'bg-gray-100 text-gray-800';
};
