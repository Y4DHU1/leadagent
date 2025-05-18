
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadStatus, LeadPriority, LeadFilter } from '@/lib/types';
import { initialLeads } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

interface LeadContextType {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updatedLead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLead: (id: string) => Lead | undefined;
  filteredLeads: Lead[];
  filter: LeadFilter;
  setFilter: React.Dispatch<React.SetStateAction<LeadFilter>>;
  generateAIInsights: (leadId: string) => void;
  downloadFilteredLeads: () => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadFilter>({});
  const { toast } = useToast();

  // Add a new lead
  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    try {
      const now = new Date().toISOString();
      const newLead: Lead = {
        ...lead,
        id: `lead-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      
      setLeads(prevLeads => [newLead, ...prevLeads]);
      
      toast({
        title: "Lead added",
        description: `${lead.firstName} ${lead.lastName} has been added successfully`,
      });
    } catch (err) {
      setError('Failed to add lead');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add lead. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a lead
  const updateLead = (id: string, updatedLead: Partial<Lead>) => {
    setIsLoading(true);
    
    try {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id 
            ? { 
                ...lead, 
                ...updatedLead, 
                updatedAt: new Date().toISOString() 
              } 
            : lead
        )
      );
      
      toast({
        title: "Lead updated",
        description: "Lead information has been updated successfully",
      });
    } catch (err) {
      setError('Failed to update lead');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a lead
  const deleteLead = (id: string) => {
    setIsLoading(true);
    
    try {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      
      toast({
        title: "Lead deleted",
        description: "Lead has been removed successfully",
      });
    } catch (err) {
      setError('Failed to delete lead');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lead. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get a single lead by ID
  const getLead = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  // Generate AI insights for a lead (simulated)
  const generateAIInsights = (leadId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing delay
      setTimeout(() => {
        setLeads(prevLeads => 
          prevLeads.map(lead => {
            if (lead.id === leadId) {
              // Simulate AI-generated insights
              const insights = [
                'Based on engagement patterns, this lead shows high interest in product features.',
                'Company profile matches your ideal customer profile at 87% similarity.',
                'Suggested follow-up within 2 business days based on response patterns.',
              ];
              
              const score = Math.floor(Math.random() * 30) + 70; // Generate a score between 70-100
              
              return {
                ...lead,
                aiInsights: insights,
                aiScore: score,
                updatedAt: new Date().toISOString(),
              };
            }
            return lead;
          })
        );
        
        toast({
          title: "AI Analysis Complete",
          description: "New insights have been generated for this lead",
        });
        
        setIsLoading(false);
      }, 1500); // Simulate processing time
    } catch (err) {
      setError('Failed to generate AI insights');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
      });
      setIsLoading(false);
    }
  };

  // Apply filters to leads
  const applyFilters = () => {
    if (!filter || Object.keys(filter).length === 0) {
      return leads;
    }
    
    return leads.filter(lead => {
      // Status filter
      if (filter.status && filter.status.length > 0 && !filter.status.includes(lead.status)) {
        return false;
      }
      
      // Priority filter
      if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(lead.priority)) {
        return false;
      }
      
      // Search filter
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const companyName = lead.company.toLowerCase();
        const email = lead.email.toLowerCase();
        
        if (!fullName.includes(searchTerm) && 
            !companyName.includes(searchTerm) && 
            !email.includes(searchTerm)) {
          return false;
        }
      }
      
      // Date range filter
      if (filter.dateRange) {
        const leadDate = new Date(lead.createdAt);
        if (leadDate < filter.dateRange.start || leadDate > filter.dateRange.end) {
          return false;
        }
      }
      
      return true;
    });
  };

  const filteredLeads = applyFilters();

  // Download filtered leads as CSV
  const downloadFilteredLeads = () => {
    try {
      import('@/utils/downloadUtils').then(({ downloadLeads }) => {
        downloadLeads(filteredLeads);
        
        toast({
          title: "Download Started",
          description: `${filteredLeads.length} leads exported to CSV`,
        });
      });
    } catch (err) {
      setError('Failed to download leads');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download leads. Please try again.",
      });
    }
  };

  return (
    <LeadContext.Provider value={{
      leads,
      isLoading,
      error,
      addLead,
      updateLead,
      deleteLead,
      getLead,
      filteredLeads,
      filter,
      setFilter,
      generateAIInsights,
      downloadFilteredLeads,
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeadContext = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeadContext must be used within a LeadProvider');
  }
  return context;
};
