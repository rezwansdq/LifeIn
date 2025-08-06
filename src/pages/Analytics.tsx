
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from "lucide-react";
import { toast } from "sonner";

interface CheckInEntry {
  _id: string;
  date: string; // ISO string
  rating: number;
  notes?: string;
  mood?: string;
}

interface HabitEntry {
  _id: string;
  name: string;
  category: string;
  completedDates: string[]; // ISO strings
}

interface GoalEntry {
  _id: string;
  name: string;
  targetDate: string;
  completed: boolean;
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  const [habits, setHabits] = useState<HabitEntry[]>([]);
  const [goals, setGoals] = useState<GoalEntry[]>([]);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/analytics", {
        headers: { "x-auth-token": token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch analytics data");
      }

      setCheckIns(data.checkins);
      setHabits(data.habits);
      setGoals(data.goals);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Data processing for charts and stats
  const processData = () => {
    // Weekly Ratings
    const weeklyRatingsMap = new Map<string, { totalRating: number, count: number, habitsCompleted: number }>();
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      weeklyRatingsMap.set(date.toISOString().split('T')[0], { totalRating: 0, count: 0, habitsCompleted: 0 });
    }

    checkIns.forEach(checkIn => {
      const checkInDate = new Date(checkIn.date);
      if (checkInDate >= sevenDaysAgo && checkInDate <= today) {
        const dateKey = checkInDate.toISOString().split('T')[0];
        const entry = weeklyRatingsMap.get(dateKey);
        if (entry) {
          entry.totalRating += checkIn.rating;
          entry.count++;
        }
      }
    });

    habits.forEach(habit => {
      habit.completedDates.forEach(completedDateStr => {
        const completedDate = new Date(completedDateStr);
        if (completedDate >= sevenDaysAgo && completedDate <= today) {
          const dateKey = completedDate.toISOString().split('T')[0];
          const entry = weeklyRatingsMap.get(dateKey);
          if (entry) {
            entry.habitsCompleted++;
          }
        }
      });
    });

    const weeklyRatingsData = Array.from(weeklyRatingsMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([dateKey, data]) => ({
        day: dayNames[new Date(dateKey).getDay()],
        rating: data.count > 0 ? Math.round(data.totalRating / data.count) : 0,
        habits: data.habitsCompleted,
      }));

    // Monthly Progress
    const monthlyProgressMap = new Map<string, { totalRating: number, ratingCount: number, totalHabitsCompleted: number, totalHabitsExpected: number }>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize for last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(today.getMonth() - (5 - i));
      monthlyProgressMap.set(`${d.getFullYear()}-${d.getMonth()}`, { totalRating: 0, ratingCount: 0, totalHabitsCompleted: 0, totalHabitsExpected: 0 });
    }

    checkIns.forEach(checkIn => {
      const checkInDate = new Date(checkIn.date);
      const monthKey = `${checkInDate.getFullYear()}-${checkInDate.getMonth()}`;
      const entry = monthlyProgressMap.get(monthKey);
      if (entry) {
        entry.totalRating += checkIn.rating;
        entry.ratingCount++;
      }
    });

    habits.forEach(habit => {
      habit.completedDates.forEach(completedDateStr => {
        const completedDate = new Date(completedDateStr);
        const monthKey = `${completedDate.getFullYear()}-${completedDate.getMonth()}`;
        const entry = monthlyProgressMap.get(monthKey);
        if (entry) {
          entry.totalHabitsCompleted++;
        }
      });
      // Assuming habits are expected daily for simplicity in this example
      // In a real app, you'd track habit frequency
      const startMonth = new Date(habit.completedDates[0] || new Date()).getMonth();
      const endMonth = new Date().getMonth();
      for (let m = startMonth; m <= endMonth; m++) {
        const d = new Date();
        d.setMonth(m);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        const entry = monthlyProgressMap.get(monthKey);
        if (entry) {
          entry.totalHabitsExpected += new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); // Days in month
        }
      }
    });

    const monthlyProgressData = Array.from(monthlyProgressMap.entries())
      .sort((a, b) => {
        const [y1, m1] = a[0].split('-').map(Number);
        const [y2, m2] = b[0].split('-').map(Number);
        return new Date(y1, m1).getTime() - new Date(y2, m2).getTime();
      })
      .map(([key, data]) => {
        const [, monthIndex] = key.split('-').map(Number);
        return {
          month: monthNames[monthIndex],
          avgRating: data.ratingCount > 0 ? parseFloat((data.totalRating / data.ratingCount).toFixed(1)) : 0,
          completion: data.totalHabitsExpected > 0 ? Math.round((data.totalHabitsCompleted / data.totalHabitsExpected) * 100) : 0,
        };
      });

    // Habit Categories
    const habitCategoryMap = new Map<string, number>();
    habits.forEach(habit => {
      habitCategoryMap.set(habit.category, (habitCategoryMap.get(habit.category) || 0) + 1);
    });

    const totalHabits = habits.length;
    const habitCategoriesData = Array.from(habitCategoryMap.entries()).map(([name, count]) => ({
      name,
      value: totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color for now
    }));

    // Stats
    const totalRatings = checkIns.reduce((sum, ci) => sum + ci.rating, 0);
    const avgRating = checkIns.length > 0 ? (totalRatings / checkIns.length).toFixed(1) : '0.0';

    let bestStreak = 0;
    let currentStreak = 0;
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 0; i < sortedCheckIns.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedCheckIns[i - 1].date);
        const currDate = new Date(sortedCheckIns[i].date);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, currentStreak);
    }

    const totalDaysWithCheckIn = new Set(checkIns.map(ci => ci.date.split('T')[0])).size;
    const totalDaysTracked = Math.ceil(Math.abs(new Date().getTime() - new Date(checkIns[checkIns.length - 1]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const checkInRate = totalDaysTracked > 0 ? ((totalDaysWithCheckIn / totalDaysTracked) * 100).toFixed(0) : '0';

    const totalHabitsCompletedCount = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
    const totalPossibleHabitCompletions = habits.length * totalDaysTracked; // Simplified
    const habitsCompletionRate = totalPossibleHabitCompletions > 0 ? ((totalHabitsCompletedCount / totalPossibleHabitCompletions) * 100).toFixed(0) : '0';


    const completedGoals = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;
    const goalsCompletionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(0) : '0';

    const analyticsStats = [
      { label: 'Average Rating', value: avgRating, change: '', icon: TrendingUp, color: 'text-green-500' },
      { label: 'Best Streak', value: `${bestStreak} days`, change: 'Personal best', icon: Award, color: 'text-purple-500' },
      { label: 'Habits Completed', value: `${habitsCompletionRate}%`, change: '', icon: Target, color: 'text-blue-500' },
      { label: 'Goals Completed', value: `${goalsCompletionRate}%`, change: '', icon: Calendar, color: 'text-orange-500' },
    ];

    return { weeklyRatingsData, monthlyProgressData, habitCategoriesData, analyticsStats };
  };

  const { weeklyRatingsData, monthlyProgressData, habitCategoriesData, analyticsStats } = processData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and identify patterns</p>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading analytics data...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {analyticsStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          {stat.change && <p className={`text-sm ${stat.color}`}>{stat.change}</p>}
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
                  <CardTitle className="text-gray-900 dark:text-white">Weekly Ratings & Habits</CardTitle>
                  <CardDescription className="dark:text-gray-400">Your daily ratings and habits completed for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyRatingsData}>
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
                      <Bar dataKey="rating" fill="#3B82F6" name="Rating" />
                      <Bar dataKey="habits" fill="#10B981" name="Habits Completed" />
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
                    <LineChart data={monthlyProgressData}>
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
                      <Line type="monotone" dataKey="avgRating" stroke="#10B981" strokeWidth={2} name="Average Rating" />
                      <Line type="monotone" dataKey="completion" stroke="#8B5CF6" strokeWidth={2} name="Completion Rate" />
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
                        data={habitCategoriesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {habitCategoriesData.map((entry, index) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
