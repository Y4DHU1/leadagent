
import React, { useState } from 'react';
import { LeadProvider, useLeadContext } from '@/context/LeadContext';
import Dashboard from '@/components/Dashboard';
import LeadList from '@/components/LeadList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, ArrowRightLeft, Download } from 'lucide-react';

const LeadActions = () => {
  const { downloadFilteredLeads } = useLeadContext();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={downloadFilteredLeads}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        Export Leads
      </Button>
    </div>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <LeadProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-brand-700 flex items-center">
                  <ArrowRightLeft className="mr-2 h-6 w-6" />
                  Lead Management AI
                </h1>
                <p className="text-sm text-gray-500">Manage and analyze your leads with AI assistance</p>
              </div>
              {activeTab === 'leads' && <LeadActions />}
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4 sm:px-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Leads
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
                <p className="text-sm text-gray-500">Overview of your leads and performance metrics</p>
              </div>
              <Separator />
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="leads" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Lead Management</h2>
                <p className="text-sm text-gray-500">View, add, and manage your leads</p>
              </div>
              <Separator />
              <LeadList />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </LeadProvider>
  );
};

export default Index;
