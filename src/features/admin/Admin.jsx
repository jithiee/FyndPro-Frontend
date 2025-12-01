import React, { useState } from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Paper 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu
} from 'lucide-react';

// --- MOCK DATA ---

const mockStats = [
  { title: "Total Revenue", value: "$42,500", change: "+14%", isPositive: true },
  { title: "Active Bookings", value: "128", change: "+5%", isPositive: true },
  { title: "Pending Requests", value: "12", change: "-2%", isPositive: false },
  { title: "Total Customers", value: "3,400", change: "+8%", isPositive: true },
];

const mockChartData = [
  { name: 'Mon', bookings: 40 },
  { name: 'Tue', bookings: 30 },
  { name: 'Wed', bookings: 60 },
  { name: 'Thu', bookings: 45 },
  { name: 'Fri', bookings: 90 },
  { name: 'Sat', bookings: 120 },
  { name: 'Sun', bookings: 100 },
];

const mockBookings = [
  { id: 1, customer: 'Alice Johnson', service: 'Full Body Massage', date: '2023-10-25', amount: 120, status: 'Confirmed' },
  { id: 2, customer: 'Bob Smith', service: 'Haircut & Style', date: '2023-10-25', amount: 45, status: 'Pending' },
  { id: 3, customer: 'Charlie Brown', service: 'Dental Checkup', date: '2023-10-26', amount: 200, status: 'Cancelled' },
  { id: 4, customer: 'Diana Prince', service: 'Consultation', date: '2023-10-26', amount: 80, status: 'Confirmed' },
  { id: 5, customer: 'Evan Wright', service: 'Personal Training', date: '2023-10-27', amount: 60, status: 'Confirmed' },
  { id: 6, customer: 'Fiona Gallagher', service: 'Manicure', date: '2023-10-28', amount: 35, status: 'Pending' },
  { id: 7, customer: 'George Miller', service: 'Therapy Session', date: '2023-10-29', amount: 150, status: 'Confirmed' },
];

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatCard = ({ title, value, change, isPositive }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <span className="text-gray-500 text-sm font-medium">{title}</span>
    <div className="flex items-end justify-between mt-4">
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
        isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

// --- MAIN ADMIN COMPONENT ---

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // MUI DataGrid Columns Definition
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customer', headerName: 'Customer Name', flex: 1, minWidth: 150 },
    { field: 'service', headerName: 'Service', flex: 1, minWidth: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { 
      field: 'amount', 
      headerName: 'Amount ($)', 
      width: 100,
      renderCell: (params) => (
        <span className="font-semibold text-gray-700">${params.value}</span>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const colors = {
          Confirmed: 'success',
          Pending: 'warning',
          Cancelled: 'error',
        };
        return <Chip label={params.value} color={colors[params.value]} size="small" variant="outlined" />;
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 150,
      renderCell: () => (
        <Button size="small" variant="text" sx={{ textTransform: 'none' }}>
          Manage
        </Button>
      ),
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold text-gray-800">BookingApp</span>
        </div>

        <div className="py-6 flex flex-col gap-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={CalendarCheck} 
            label="Bookings" 
            active={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Customers" 
            active={activeTab === 'customers'} 
            onClick={() => setActiveTab('customers')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
            <LogOut size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Logout</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search bookings..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <IconButton>
              <Bell size={20} className="text-gray-600" />
            </IconButton>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">Jane Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <Avatar alt="Jane Admin" src="/static/images/avatar/1.jpg" sx={{ bgcolor: '#2563eb' }}>JA</Avatar>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in-up space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                  <p className="text-gray-500 mt-1">Here is what's happening with your business today.</p>
                </div>
                <Button variant="contained" disableElevation sx={{ textTransform: 'none', backgroundColor: '#2563eb' }}>
                  + New Booking
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Analytics</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity / Mini List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                          NB
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">New Booking Received</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent Bookings Table Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-gray-800">Recent Bookings</h3>
                   <Button onClick={() => setActiveTab('bookings')} size="small">View All</Button>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={mockBookings}
                    columns={columns}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{ border: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS VIEW (Full Table) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 h-full flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
              <Paper className="flex-1 shadow-sm border border-gray-100 rounded-xl overflow-hidden p-4">
                 <DataGrid
                    rows={mockBookings}
                    columns={columns}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{ border: 'none' }}
                  />
              </Paper>
            </div>
          )}

           {/* PLACEHOLDER VIEWS */}
           {(activeTab === 'customers' || activeTab === 'settings') && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Settings size={48} className="mb-4 opacity-50"/>
              <h2 className="text-xl font-medium">Coming Soon</h2>
              <p>This {activeTab} section is under development.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Admin;