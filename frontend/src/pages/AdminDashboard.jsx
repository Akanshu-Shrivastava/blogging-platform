import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, FileText, FolderOpen, Tag, MessageCircle,
  ArrowUp, ArrowDown, Shield, RefreshCw
} from "lucide-react";
import { AdminAPI } from "../api/axios.js";

import UsersManagement from "./admin/UsersManagement";
import BlogsManagement from "./admin/BlogsManagement";
import CategoriesManagement from "./admin/CategoriesManagement";
import TagsManagement from "./admin/TagsManagement";
import CommentsManagement from "./admin/CommentsManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await AdminAPI.getDashboardStats();
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  // Function to update specific stat
  const updateStat = (key, change) => {
    setStats(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + change
    }));
  };

  // Function to update tab counts based on actions in child components
  const updateTabCount = (tabKey, change) => {
    const statMap = {
      'users': 'totalUsers',
      'blogs': 'totalBlogs', 
      'categories': 'totalCategories',
      'tags': 'totalTags',
      'comments': 'totalComments'
    };
    
    if (statMap[tabKey]) {
      updateStat(statMap[tabKey], change);
    }
  };

  // Enhanced tabs with real-time counts
  const tabs = [
    { 
      key: "users", 
      label: "Users", 
      icon: <Users size={20} />, 
      color: "from-blue-500 to-blue-600", 
      count: stats.totalUsers || 0,
      statKey: "totalUsers"
    },
    { 
      key: "blogs", 
      label: "Blogs", 
      icon: <FileText size={20} />, 
      color: "from-green-500 to-green-600", 
      count: stats.totalBlogs || 0,
      statKey: "totalBlogs"
    },
    { 
      key: "categories", 
      label: "Categories", 
      icon: <FolderOpen size={20} />, 
      color: "from-purple-500 to-purple-600", 
      count: stats.totalCategories || 0,
      statKey: "totalCategories"
    },
    { 
      key: "tags", 
      label: "Tags", 
      icon: <Tag size={20} />, 
      color: "from-orange-500 to-orange-600", 
      count: stats.totalTags || 0,
      statKey: "totalTags"
    },
    { 
      key: "comments", 
      label: "Comments", 
      icon: <MessageCircle size={20} />, 
      color: "from-pink-500 to-pink-600", 
      count: stats.totalComments || 0,
      statKey: "totalComments"
    },
  ];

  const quickStats = [
    { 
      title: "New Users Today", 
      value: stats.newUsersToday || 0, 
      trend: "up", 
      change: "+12%",
      statKey: "newUsersToday"
    },
    { 
      title: "Blogs Published", 
      value: stats.blogsToday || 0, 
      trend: "up", 
      change: "+8%",
      statKey: "blogsToday"
    },
    { 
      title: "Total Comments", 
      value: stats.totalComments || 0, 
      trend: "up", 
      change: "+5%",
      statKey: "totalComments"
    },
    { 
      title: "System Health", 
      value: "98%", 
      trend: "up", 
      change: "+2%",
      statKey: "systemHealth"
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 relative">
      {/* Floating Lights */}
      <motion.div
        className="absolute top-16 left-16 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Shield className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600">Monitor, manage, and control your platform</p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        {!loading && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {quickStats.map((q, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-600">{q.title}</span>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      q.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {q.trend === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {q.change}
                  </div>
                </div>
                <motion.div 
                  className="text-2xl font-bold text-gray-800"
                  key={q.value}
                  animate={pulseAnimation}
                >
                  {q.value}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
              {tabs.map((t) => (
                <motion.button
                  key={t.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex w-full items-center p-4 gap-3 border-b last:border-b-0 text-left transition-all ${
                    activeTab === t.key
                      ? `bg-gradient-to-r ${t.color} text-white`
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div>{t.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{t.label}</p>
                    <motion.p 
                      className="text-sm opacity-75"
                      key={t.count}
                      animate={pulseAnimation}
                    >
                      {t.count} total
                    </motion.p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow border p-6">
            <AnimatePresence mode="wait">
              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UsersManagement 
                    onUserChange={(change) => updateTabCount('users', change)}
                    onStatsUpdate={fetchStats}
                  />
                </motion.div>
              )}
              {activeTab === "blogs" && (
                <motion.div
                  key="blogs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BlogsManagement 
                    onBlogChange={(change) => updateTabCount('blogs', change)}
                    onStatsUpdate={fetchStats}
                  />
                </motion.div>
              )}
              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CategoriesManagement 
                    onCategoryChange={(change) => updateTabCount('categories', change)}
                    onStatsUpdate={fetchStats}
                  />
                </motion.div>
              )}
              {activeTab === "tags" && (
                <motion.div
                  key="tags"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TagsManagement 
                    onTagChange={(change) => updateTabCount('tags', change)}
                    onStatsUpdate={fetchStats}
                  />
                </motion.div>
              )}
              {activeTab === "comments" && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CommentsManagement 
                    onCommentChange={(change) => updateTabCount('comments', change)}
                    onStatsUpdate={fetchStats}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;