
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeadContext } from '@/context/LeadContext';
import { LeadStatus } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, UserPlus2, BadgeCheck, BadgeDollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { leads } = useLeadContext();
  
  // Calculate statistics
  const totalLeads = leads.length;
  const newLeadsThisMonth = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    const today = new Date();
    return leadDate.getMonth() === today.getMonth() &&
           leadDate.getFullYear() === today.getFullYear();
  }).length;
  
  const qualifiedLeads = leads.filter(lead => 
    lead.status === 'Qualified' || lead.status === 'Proposal' || lead.status === 'Negotiation'
  ).length;
  
  const closedWonLeads = leads.filter(lead => lead.status === 'Closed Won').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedWonLeads / totalLeads) * 100) : 0;

  // Prepare data for charts
  const getStatusCounts = () => {
    const statusCounts: Record<LeadStatus, number> = {
      'New': 0,
      'Contacted': 0,
      'Qualified': 0,
      'Proposal': 0,
      'Negotiation': 0,
      'Closed Won': 0,
      'Closed Lost': 0
    };
    
    leads.forEach(lead => {
      statusCounts[lead.status]++;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getPriorityData = () => {
    const priorityCounts = {
      'High': 0,
      'Medium': 0,
      'Low': 0
    };
    
    leads.forEach(lead => {
      priorityCounts[lead.priority]++;
    });
    
    return Object.entries(priorityCounts).map(([name, count]) => ({
      name,
      count
    }));
  };

  const getSourceData = () => {
    const sourceCounts: Record<string, number> = {};
    
    leads.forEach(lead => {
      if (lead.source) {
        sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
      }
    });
    
    return Object.entries(sourceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 sources
  };
  
  const statusData = getStatusCounts();
  const priorityData = getPriorityData();
  const sourceData = getSourceData();

  // Chart colors
  const COLORS = ['#2563eb', '#4f46e5', '#0ea5e9', '#0d9488', '#10b981', '#22c55e', '#ef4444'];
  const PRIORITY_COLORS = {
    'High': '#ef4444',
    'Medium': '#2563eb',
    'Low': '#6b7280'
  };

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-100">
                <Users className="h-6 w-6 text-brand-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <h3 className="text-2xl font-bold">{totalLeads}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100">
                <UserPlus2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New This Month</p>
                <h3 className="text-2xl font-bold">{newLeadsThisMonth}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-purple-100">
                <BadgeCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Qualified Leads</p>
                <h3 className="text-2xl font-bold">{qualifiedLeads}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-amber-100">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold">{conversionRate}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status distribution chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} leads`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Lead Priority Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lead Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} leads`, '']} />
                  <Bar dataKey="count">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Sources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Lead Sources</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} leads`, '']} />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
