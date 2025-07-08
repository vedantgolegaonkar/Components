// app/dashboard/page.tsx
'use client';

import {
  FaEye,
  FaThumbsUp,
  FaComment,
  FaVideo,
  FaUsers,
} from 'react-icons/fa';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

const mockStats = {
  totalVideos: 48,
  totalViews: 123456,
  totalLikes: 24500,
  totalComments: 1800,
  subscribers: 15800,
};

const viewsOverTime = [
  { date: 'Week 1', views: 2300 },
  { date: 'Week 2', views: 3200 },
  { date: 'Week 3', views: 4700 },
  { date: 'Week 4', views: 6100 },
];

const topVideos = [
  { title: 'Intro to React', views: 11000 },
  { title: 'JavaScript Basics', views: 9500 },
  { title: 'Tailwind Tutorial', views: 8800 },
  { title: 'React Hooks', views: 7900 },
  { title: 'API Integration', views: 7400 },
];

export default function Dashboard() {
  const [stats] = useState(mockStats);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">YouTube Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <KPI icon={<FaVideo />} label="Total Videos" value={stats.totalVideos} />
        <KPI icon={<FaEye />} label="Total Views" value={stats.totalViews.toLocaleString()} />
        <KPI icon={<FaThumbsUp />} label="Total Likes" value={stats.totalLikes.toLocaleString()} />
        <KPI icon={<FaComment />} label="Comments" value={stats.totalComments.toLocaleString()} />
        <KPI icon={<FaUsers />} label="Subscribers" value={stats.subscribers.toLocaleString()} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Views Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsOverTime}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Videos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topVideos}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="views" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
      <div className="text-green-500 text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-lg font-bold">{value}</h3>
      </div>
    </div>
  );
}
