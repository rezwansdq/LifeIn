
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  // Mock data for charts
  const dailyRatingsData = [
    { date: "Jan 1", rating: 8 },
    { date: "Jan 2", rating: 7 },
    { date: "Jan 3", rating: 9 },
    { date: "Jan 4", rating: 6 },
    { date: "Jan 5", rating: 8 },
    { date: "Jan 6", rating: 7 },
    { date: "Jan 7", rating: 9 },
    { date: "Jan 8", rating: 8 },
    { date: "Jan 9", rating: 6 },
    { date: "Jan 10", rating: 7 },
    { date: "Jan 11", rating: 8 },
    { date: "Jan 12", rating: 9 },
    { date: "Jan 13", rating: 7 },
    { date: "Jan 14", rating: 8 },
  ];

  const habitStreaksData = [
    { habit: "Meditation", currentStreak: 7, longestStreak: 15 },
    { habit: "Exercise", currentStreak: 12, longestStreak: 18 },
    { habit: "Reading", currentStreak: 3, longestStreak: 8 },
    { habit: "Journal", currentStreak: 5, longestStreak: 12 },
    { habit: "Water", currentStreak: 2, longestStreak: 6 },
  ];

  const habitCompletionData = [
    { name: "Completed", value: 72, count: 18 },
    { name: "Missed", value: 28, count: 7 },
  ];

  const weeklyProgressData = [
    { week: "Week 1", completed: 85, missed: 15 },
    { week: "Week 2", completed: 78, missed: 22 },
    { week: "Week 3", completed: 92, missed: 8 },
    { week: "Week 4", completed: 65, missed: 35 },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  const averageRating = dailyRatingsData.reduce((sum, day) => sum + day.rating, 0) / dailyRatingsData.length;
  const totalHabits = habitStreaksData.length;
  const totalStreakDays = habitStreaksData.reduce((sum, habit) => sum + habit.currentStreak, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your progress and insights over time</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Avg. Daily Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalHabits}</div>
              <p className="text-sm text-gray-600">Active Habits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-500">{totalStreakDays}</div>
              <p className="text-sm text-gray-600">Total Streak Days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">72%</div>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Ratings Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Daily Ratings Trend
              </CardTitle>
              <CardDescription>Your daily mood ratings over the past 2 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRatingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Habit Completion Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Habit Completion Rate
              </CardTitle>
              <CardDescription>Overall habit completion this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={habitCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {habitCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Habit Streaks Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Habit Streaks
              </CardTitle>
              <CardDescription>Current vs. longest streaks by habit</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitStreaksData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="habit" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="currentStreak" fill="#22c55e" name="Current Streak" />
                  <Bar dataKey="longestStreak" fill="#94a3b8" name="Longest Streak" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Habit completion by week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed %" />
                  <Bar dataKey="missed" stackId="a" fill="#ef4444" name="Missed %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>AI-powered insights based on your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-green-600">🎉 Achievements</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Exercise streak at 12 days!</span>
                    <Badge variant="secondary">New Record</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Maintained 7+ avg rating for 2 weeks</span>
                    <Badge variant="secondary">Consistent</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-orange-600">💡 Suggestions</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm">Consider setting a reminder for water tracking - it's your lowest completion rate.</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Your ratings are highest on days with meditation. Keep it up!</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
