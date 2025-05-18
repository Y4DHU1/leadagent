import React, { useState } from 'react';
import { useLeadContext } from '@/context/LeadContext';
import LeadCard from './LeadCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadStatus, LeadPriority } from '@/lib/types';
import { 
  Search, 
  Plus, 
  FilterX, 
  ChevronDown, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LeadForm from './LeadForm';
import AIInsights from './AIInsights';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LeadList: React.FC = () => {
  const { filteredLeads, filter, setFilter, getLead } = useLeadContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [viewingLeadId, setViewingLeadId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<LeadPriority[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const viewingLead = viewingLeadId ? getLead(viewingLeadId) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter(prev => ({ ...prev, search: searchTerm }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter([]);
    setPriorityFilter([]);
    setFilter({});
  };

  const applyFilters = () => {
    setFilter({
      ...filter,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      priority: priorityFilter.length > 0 ? priorityFilter : undefined,
      search: searchTerm || undefined,
    });
  };

  const handleViewLead = (id: string) => {
    setViewingLeadId(id);
  };
  
  const closeViewDialog = () => {
    setViewingLeadId(null);
  };
  
  const handleEditLead = (id: string) => {
    setEditingLeadId(id);
    setShowAddForm(false);
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setEditingLeadId(null);
  };
  
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingLeadId(null);
  };

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
  
  const getLeadsByTab = () => {
    if (activeTab === 'all') return filteredLeads;
    
    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return filteredLeads.filter(lead => 
        new Date(lead.createdAt) >= thirtyDaysAgo
      );
    }
    
    if (activeTab === 'qualified') {
      return filteredLeads.filter(lead => 
        lead.status === 'Qualified' || lead.status === 'Proposal' || lead.status === 'Negotiation'
      );
    }
    
    if (activeTab === 'high-priority') {
      return filteredLeads.filter(lead => lead.priority === 'High');
    }
    
    if (activeTab === 'closing') {
      return filteredLeads.filter(lead => 
        lead.status === 'Proposal' || lead.status === 'Negotiation'
      );
    }
    
    return filteredLeads;
  };
  
  const displayLeads = getLeadsByTab();
  
  const editingLead = editingLeadId ? getLead(editingLeadId) : undefined;

  return (
    <div className="space-y-4">
      {/* Search and filters bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            variant="outline"
            size="icon"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm">
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Leads</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2 pt-1">Status</DropdownMenuLabel>
                {statuses.map(status => (
                  <DropdownMenuItem 
                    key={status}
                    className="flex items-center px-2 py-0.5 h-7 hover:bg-gray-100"
                    onClick={() => {
                      if (statusFilter.includes(status)) {
                        setStatusFilter(statusFilter.filter(s => s !== status));
                      } else {
                        setStatusFilter([...statusFilter, status]);
                      }
                    }}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4"
                        checked={statusFilter.includes(status)}
                        onChange={() => {}}
                      />
                      <span className="text-sm">{status}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2 pt-1">Priority</DropdownMenuLabel>
                {priorities.map(priority => (
                  <DropdownMenuItem 
                    key={priority}
                    className="flex items-center px-2 py-0.5 h-7 hover:bg-gray-100"
                    onClick={() => {
                      if (priorityFilter.includes(priority)) {
                        setPriorityFilter(priorityFilter.filter(p => p !== priority));
                      } else {
                        setPriorityFilter([...priorityFilter, priority]);
                      }
                    }}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4"
                        checked={priorityFilter.includes(priority)}
                        onChange={() => {}}
                      />
                      <span className="text-sm">{priority}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <div className="p-2 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    setStatusFilter([]);
                    setPriorityFilter([]);
                  }}
                >
                  <FilterX className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs bg-brand-600 hover:bg-brand-700"
                  onClick={() => {
                    applyFilters();
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={toggleAddForm} 
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>
      
      {/* Active filters */}
      {(statusFilter.length > 0 || priorityFilter.length > 0 || searchTerm) && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-500">Active filters:</span>
          {searchTerm && (
            <Badge variant="outline" className="bg-gray-100 flex gap-1 items-center">
              Search: {searchTerm}
            </Badge>
          )}
          {statusFilter.map(status => (
            <Badge key={status} variant="outline" className="bg-blue-100 text-blue-800 flex gap-1 items-center">
              Status: {status}
            </Badge>
          ))}
          {priorityFilter.map(priority => (
            <Badge key={priority} variant="outline" className="bg-red-100 text-red-800 flex gap-1 items-center">
              Priority: {priority}
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-gray-500" 
            onClick={clearFilters}
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        </div>
      )}
      
      {/* Lead form */}
      {(showAddForm || editingLeadId) && (
        <div className="mb-4">
          <LeadForm 
            existingLead={editingLead} 
            onCancel={handleCloseForm}
            title={editingLead ? 'Edit Lead' : 'Add New Lead'}
          />
        </div>
      )}
      
      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <Users className="h-4 w-4 mr-1.5" /> All Leads
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5" /> Recent
          </TabsTrigger>
          <TabsTrigger value="qualified" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Qualified
          </TabsTrigger>
          <TabsTrigger value="high-priority" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1.5" /> High Priority
          </TabsTrigger>
          <TabsTrigger value="closing" className="flex items-center">
            <UserPlus className="h-4 w-4 mr-1.5" /> Closing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0 pt-0">
          {displayLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayLeads.map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onView={handleViewLead} 
                  onEdit={handleEditLead}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.keys(filter).length > 0 
                  ? 'Try adjusting your filters to see more results' 
                  : 'Get started by adding your first lead'}
              </p>
              <Button 
                onClick={toggleAddForm} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* View Lead Dialog */}
      <Dialog open={!!viewingLeadId} onOpenChange={(open) => !open && closeViewDialog()}>
        {viewingLead && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {viewingLead.firstName} {viewingLead.lastName}
              </DialogTitle>
              <DialogDescription>
                {viewingLead.company}{viewingLead.position ? ` • ${viewingLead.position}` : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lead details column */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {viewingLead.email}</div>
                    {viewingLead.phone && <div><span className="font-medium">Phone:</span> {viewingLead.phone}</div>}
                    {viewingLead.location && <div><span className="font-medium">Location:</span> {viewingLead.location}</div>}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Lead Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="font-medium">Status:</span> 
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">{viewingLead.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-medium">Priority:</span>
                      <Badge variant="outline" className={
                        viewingLead.priority === 'High' ? 'bg-red-100 text-red-800' :
                        viewingLead.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {viewingLead.priority}
                      </Badge>
                    </div>
                    {viewingLead.source && <div><span className="font-medium">Source:</span> {viewingLead.source}</div>}
                    {viewingLead.industry && <div><span className="font-medium">Industry:</span> {viewingLead.industry}</div>}
                    {viewingLead.budget !== undefined && <div><span className="font-medium">Budget:</span> ${viewingLead.budget.toLocaleString()}</div>}
                  </div>
                </div>
                
                {viewingLead.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 rounded-md p-3 bg-gray-50">
                      {viewingLead.notes}
                    </p>
                  </div>
                )}
              </div>
              
              {/* AI Insights column */}
              <AIInsights lead={viewingLead} />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={closeViewDialog}
              >
                Close
              </Button>
              <Button 
                className="bg-brand-600 hover:bg-brand-700"
                onClick={() => {
                  closeViewDialog();
                  handleEditLead(viewingLead.id);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Lead
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default LeadList;
