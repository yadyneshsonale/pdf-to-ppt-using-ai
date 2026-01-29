import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Clock,
  TrendingUp,
  Presentation,
  Trash2,
  Edit,
  Calendar,
  Download,
  User,
  Crown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../context/AuthContext";
import {
  getUserStats,
  getPpts,
  deletePpt,
  getHistory,
  type UserStats,
} from "../services/auth";

interface UserDashboardProps {
  onBack: () => void;
  onEditPpt?: (pptId: string) => void;
}

export function UserDashboard({ onBack, onEditPpt }: UserDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [ppts, setPpts] = useState<Array<{
    id: string;
    title: string;
    templateId: string | null;
    createdAt: string;
    updatedAt: string;
  }>>([]);
  const [history, setHistory] = useState<Array<{
    id: string;
    inputFilename: string;
    outputFilename: string;
    status: string;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ppts' | 'history'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, pptsData, historyData] = await Promise.all([
        getUserStats(),
        getPpts(1, 10),
        getHistory(1, 10),
      ]);
      setStats(statsData);
      setPpts(pptsData.data);
      setHistory(historyData.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePpt = async (pptId: string) => {
    if (!confirm('Are you sure you want to delete this presentation?')) return;
    
    try {
      await deletePpt(pptId);
      setPpts(ppts.filter(p => p.id !== pptId));
    } catch (error) {
      console.error('Failed to delete PPT:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">My Dashboard</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 rounded-full">
                <Crown className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-300">{user?.plan?.name || 'Free'} Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm">{user?.name || user?.email}</span>
              </div>
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
                  <p className="text-slate-400 text-sm">Total Conversions</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.totalConversions || 0}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Saved Presentations</p>
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
                  <p className="text-slate-400 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.thisMonthConversions || 0}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Plan Limit</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stats?.totalConversions || 0}/{user?.plan?.conversionLimit || 5}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'ppts', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'ppts' && 'My Presentations'}
              {tab === 'history' && 'Conversion History'}
            </button>
          ))}
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
              {/* Recent Presentations */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Presentation className="w-5 h-5" />
                    Recent Presentations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ppts.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No presentations yet</p>
                  ) : (
                    <div className="space-y-3">
                      {ppts.slice(0, 5).map((ppt) => (
                        <div
                          key={ppt.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-500/20 rounded">
                              <FileText className="w-4 h-4 text-primary-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{ppt.title}</p>
                              <p className="text-slate-400 text-xs">{formatDate(ppt.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditPpt?.(ppt.id)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.recentActivity?.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.recentActivity?.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="p-2 bg-green-500/20 rounded">
                            <Download className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{activity.inputFilename}</p>
                            <p className="text-slate-400 text-xs">{formatDate(activity.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'ppts' && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                {ppts.length === 0 ? (
                  <div className="text-center py-12">
                    <Presentation className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No presentations saved yet</p>
                    <Button onClick={onBack} className="mt-4">
                      Create Your First Presentation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ppts.map((ppt) => (
                      <div
                        key={ppt.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary-500/20 rounded-lg">
                            <FileText className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-lg">{ppt.title}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-slate-400 text-sm">
                                Created: {formatDate(ppt.createdAt)}
                              </span>
                              <span className="text-slate-400 text-sm">
                                Updated: {formatDate(ppt.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditPpt?.(ppt.id)}
                            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePpt(ppt.id)}
                            className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No conversion history yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Input File</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Output</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((entry) => (
                          <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white">{entry.inputFilename}</td>
                            <td className="py-3 px-4 text-white">{entry.outputFilename}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  entry.status === 'completed'
                                    ? 'bg-green-500/20 text-green-400'
                                    : entry.status === 'failed'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {entry.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{formatDate(entry.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
