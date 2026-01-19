import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, AlertTriangle, RefreshCw, Shield, LogOut, User, Lock, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3000'; 

function App() {
  // --- Authentication State ---
  const [user, setUser] = useState(null); // เก็บข้อมูล user ที่ login
  const [usernameInput, setUsernameInput] = useState('');

  // --- Dashboard State ---
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenantFilter, setTenantFilter] = useState('');

  // --- Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    const role = usernameInput.toLowerCase() === 'admin' ? 'admin' : 'viewer';
    setUser({ name: usernameInput, role: role });
  };

  const handleLogout = () => {
    setUser(null);
    setLogs([]);
    setUsernameInput('');
  };

  // --- Data Fetching ---
  const fetchLogs = async () => {
    if (!user) return; // ไม่ login ไม่ต้องดึง
    setLoading(true);
    try {
      const url = tenantFilter 
        ? `${API_URL}/logs?tenant=${tenantFilter}` 
        : `${API_URL}/logs`;
      const res = await axios.get(url);
      setLogs(res.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 30000); // Refresh ทุก 30 วิ
      return () => clearInterval(interval);
    }
  }, [user, tenantFilter]);

  // --- Data Processing for Chart ---
  const chartData = (logs || []).reduce((acc, log) => {
    try {
      const time = new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const existing = acc.find(item => item.time === time);
      if (existing) { existing.count += 1; } else { acc.push({ time, count: 1 }); }
      return acc;
    } catch (e) { return acc; }
  }, []).slice(0, 20).reverse();

  const alertLogs = (logs || []).filter(log => 
    log.event_type === 'login_failed' || 
    log.event_type === 'malware_detected' ||
    log.severity >= 7
  );

  // --- Mock Delete Action (For Admin Only) ---
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this log? (Admin Only)")) {
      setLogs(logs.filter(log => log.id !== id));
      alert("Log deleted successfully!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Log Management Demo</h1>
            <p className="text-gray-500 text-sm mt-2">Please login to access the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter 'admin' or 'viewer'"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                *Tip: Type <b>admin</b> for full access, or anything else for read-only.
              </p>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Login System
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Log Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500">Welcome, </span>
            <span className="font-semibold text-gray-800">{user.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            placeholder="Filter Tenant ID..." 
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
          />
          <button 
            onClick={fetchLogs} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-100"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${activeTab === 'alerts' ? 'bg-red-50 text-red-600 shadow border border-red-100' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <AlertTriangle className="w-5 h-5" /> Alerts ({alertLogs.length})
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Log Volume (Events per Minute)</h2>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="time" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available (Try running seed script)
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Recent Logs</h3>
                <span className="text-sm text-gray-500">Showing last {logs.length} events</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Tenant</th>
                      <th className="px-6 py-3">Source</th>
                      <th className="px-6 py-3">Event Type</th>
                      <th className="px-6 py-3">Message</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 whitespace-nowrap text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {log.tenant_id}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-700">{log.source}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            log.severity >= 7 ? 'bg-red-100 text-red-700' : 
                            log.event_type === 'login_failed' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {log.event_type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                           {log.username ? `User: ${log.username}` : log.raw_message?.substring(0, 50)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {/* ปุ่ม Delete จะโชว์เฉพาะถ้า role เป็น admin */}
                          {user.role === 'admin' ? (
                            <button 
                              onClick={() => handleDelete(log.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                              title="Delete Log (Admin Only)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-gray-300 cursor-not-allowed" title="Read Only">
                              <Lock className="w-4 h-4 ml-auto" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                          No logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50 flex justify-between items-center">
              <h3 className="font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Security Alerts
              </h3>
              <span className="text-sm text-red-600 font-medium">{alertLogs.length} Critical Events</span>
            </div>
            
            {alertLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No critical alerts found. System is safe.</div>
            ) : (
              <div className="divide-y divide-red-50">
                {alertLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-red-50 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-red-700">{log.event_type}</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Severity: {log.severity}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Source:</span> {log.source} | 
                        <span className="font-semibold ml-2">Target:</span> {log.username || log.src_ip || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      {/* ปุ่ม Delete สำหรับ Admin ในหน้า Alert */}
                      {user.role === 'admin' && (
                        <button onClick={() => handleDelete(log.id)} className="text-red-600 text-xs underline mt-1">
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;