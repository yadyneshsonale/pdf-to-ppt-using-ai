import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Presentation,
  Trash2,
  Shield,
  Search,
  Crown,
  Calendar,
  UserCog,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../context/AuthContext";
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole,
  deleteUser,
  type AdminStats,
  type User,
} from "../services/auth";

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [currentPage, searchQuery, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        getAdminDashboard(),
        getAdminUsers(1, 20),
      ]);
      setStats(statsData);
      setUsers(usersData.data);
      setTotalUsers(usersData.pagination.total);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await getAdminUsers(currentPage, 20, searchQuery);
      setUsers(usersData.data);
      setTotalUsers(usersData.pagination.total);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setTotalUsers(prev => prev - 1);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'FREE': return 'bg-slate-500/20 text-slate-300';
      case 'PAID': return 'bg-blue-500/20 text-blue-400';
      case 'PREMIUM': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-red-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Presentations</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.totalPpts || 0}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Presentation className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Conversions</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.totalConversions || 0}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">New This Month</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.newUsersThisMonth || 0}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Manage Users
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Users by Plan */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Users by Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.usersByPlan?.map((plan) => (
                      <div key={plan.planType} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(plan.planType)}`}>
                            {plan.planType}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-white">{plan._count.id}</span>
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${(plan._count.id / (stats?.totalUsers || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.recentUsers?.slice(0, 5).map((recentUser) => (
                      <div
                        key={recentUser.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {(recentUser.name || recentUser.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{recentUser.name || 'No name'}</p>
                            <p className="text-slate-400 text-xs">{recentUser.email}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(recentUser.plan?.type || 'FREE')}`}>
                          {recentUser.plan?.type || 'FREE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <UserCog className="w-5 h-5" />
                    All Users ({totalUsers})
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((tableUser) => (
                        <tr key={tableUser.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-xs font-bold">
                                  {(tableUser.name || tableUser.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-white">{tableUser.name || 'No name'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{tableUser.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(tableUser.plan?.type || 'FREE')}`}>
                              {tableUser.plan?.type || 'FREE'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={tableUser.role}
                              onChange={(e) => handleRoleChange(tableUser.id, e.target.value as 'USER' | 'ADMIN')}
                              disabled={tableUser.id === user?.id}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white disabled:opacity-50"
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{formatDate(tableUser.createdAt)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(tableUser.id)}
                              disabled={tableUser.id === user?.id || tableUser.role === 'ADMIN'}
                              className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <p className="text-slate-400 text-sm">
                    Showing {users.length} of {totalUsers} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={users.length < 20}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
