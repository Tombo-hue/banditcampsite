'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dynamically import the Line component with no SSR
const Line = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false }
);

interface DashboardStats {
  today: {
    pageViews: number;
    uniqueVisitors: number;
    totalOrders: number;
    revenue: number;
  };
  overall: {
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  analytics: {
    dates: string[];
    pageViews: number[];
    uniqueVisitors: number[];
    revenue: number[];
  };
  topProducts: {
    productType: string;
    orders: number;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-red-500">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const revenueChartData: ChartData<'line'> = {
    labels: stats.analytics.dates,
    datasets: [
      {
        label: 'Revenue',
        data: stats.analytics.revenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const visitorChartData: ChartData<'line'> = {
    labels: stats.analytics.dates,
    datasets: [
      {
        label: 'Page Views',
        data: stats.analytics.pageViews,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Unique Visitors',
        data: stats.analytics.uniqueVisitors,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Calculate max values for dynamic scaling
  const maxRevenue = Math.max(...stats.analytics.revenue);
  const maxPageViews = Math.max(...stats.analytics.pageViews);
  const maxVisitors = Math.max(...stats.analytics.uniqueVisitors);
  const maxTraffic = Math.max(maxPageViews, maxVisitors);

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(59, 130, 246, 0.1)',
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          maxRotation: 0,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        intersect: false,
        mode: 'nearest' as 'nearest',
      },
    },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Today's Page Views</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.today.pageViews}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">This Week's Unique Visitors</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.today.uniqueVisitors}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Today's Orders</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.today.totalOrders}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Today's Revenue</h3>
          <p className="text-3xl font-bold text-white mt-2">£{stats.today.revenue}</p>
        </div>
      </div>

      {/* Charts */}
      {isClient && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Revenue Trend</h3>
            <div className="h-[300px]">
              <Line data={revenueChartData} options={commonOptions} />
            </div>
          </div>

          {/* Traffic Overview */}
          <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Traffic Overview</h3>
            <div className="h-[300px]">
              <Line data={visitorChartData} options={commonOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Customers</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.overall.totalCustomers}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Orders</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats.overall.totalOrders}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold text-white mt-2">£{stats.overall.totalRevenue}</p>
        </div>
        <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400">Average Order Value</h3>
          <p className="text-3xl font-bold text-white mt-2">£{stats.overall.averageOrderValue}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-[#111111] border border-blue-500/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Top Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/10">
                <th className="text-left p-4 text-gray-400 font-medium">Product Type</th>
                <th className="text-right p-4 text-gray-400 font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product) => (
                <tr key={product.productType} className="border-b border-blue-500/10">
                  <td className="p-4 text-white">{product.productType}</td>
                  <td className="p-4 text-gray-400 text-right">{product.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 