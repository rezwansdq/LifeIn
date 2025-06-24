
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

const Analytics = () => {
  // Sample data for charts
  const weeklyRatings = [
    { day: 'Mon', rating: 7, habits: 3 },
    { day: 'Tue', rating: 8, habits: 4 },
    { day: 'Wed', rating: 6, habits: 2 },
    { day: 'Thu', rating: 9, habits: 5 },
    { day: 'Fri', rating: 7, habits: 3 },
    { day: 'Sat', rating: 8, habits: 4 },
    { day: 'Sun', rating: 9, habits: 5 },
  ];

  const monthlyProgress = [
    { month: 'Jan', avgRating: 7.2, completion: 85 },
    { month: 'Feb', avgRating: 7.8, completion: 78 },
    { month: 'Mar', avgRating: 8.1, completion: 92 },
    { month: 'Apr', avgRating: 7.5, completion: 88 },
    { month: 'May', avgRating: 8.3, completion: 95 },
    { month: 'Jun', avgRating: 8.0, completion: 90 },
  ];

  const habitCategories = [
    { name: 'Health', value: 35, color: '#10B981' },
    { name: 'Learning', value: 25, color: '#3B82F6' },
    { name: 'Wellness', value: 20, color: '#8B5CF6' },
    { name: 'Personal', value: 20, color: '#F59E0B' },
  ];

  const stats = [
    { label: 'Average Rating', value: '7.8', change: '+0.5', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Best Streak', value: '12 days', change: 'Personal best', icon: Award, color: 'text-purple-500' },
    { label: 'Habits Completed', value: '89%', change: '+5%', icon: Target, color: 'text-blue-500' },
    { label: 'Check-in Rate', value: '96%', change: '+2%', icon: Calendar, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and identify patterns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Weekly Ratings</CardTitle>
              <CardDescription className="dark:text-gray-400">Your daily ratings for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyRatings}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rating" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Monthly Trends</CardTitle>
              <CardDescription className="dark:text-gray-400">Average ratings and completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="avgRating" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="completion" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Habit Categories</CardTitle>
              <CardDescription className="dark:text-gray-400">Distribution of your habits by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={habitCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {habitCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Achievements</CardTitle>
              <CardDescription className="dark:text-gray-400">Your latest milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Award className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">7-Day Streak!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed all habits for a week</p>
                  </div>
                  <Badge variant="secondary">Today</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Target className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Perfect Week</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rated every day above 7</p>
                  </div>
                  <Badge variant="secondary">2 days ago</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Consistency Master</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">90% check-in rate this month</p>
                  </div>
                  <Badge variant="secondary">1 week ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
