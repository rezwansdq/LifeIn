
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Goal {
  _id: string;
  title: string;
  progress: number;
  target: string;
}

const Dashboard = () => {
  const todayRating = 8; // This could also be fetched from backend later
  const [habits, setHabits] = useState([ // This could also be fetched from backend later
    { name: "Morning Exercise", completed: true, streak: 5 },
    { name: "Read 30 mins", completed: true, streak: 3 },
    { name: "Meditation", completed: false, streak: 0 },
    { name: "Drink 8 glasses water", completed: true, streak: 7 },
  ]);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [errorGoals, setErrorGoals] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoadingGoals(true);
    setErrorGoals(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorGoals("No authentication token found. Please log in.");
        setLoadingGoals(false);
        return;
      }

      const response = await fetch("/api/goals", {
        headers: {
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch goals");
      }

      setGoals(data);
    } catch (err) {
      const e = err as Error;
      setErrorGoals(e.message);
      toast.error(e.message);
    } finally {
      setLoadingGoals(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-300">Here's how your day is going</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{todayRating}/10</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Great day so far!</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Habits Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {habits.filter(h => h.completed).length}/{habits.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">7 days</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Personal best!</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Above average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Today's Habits</CardTitle>
              <CardDescription className="dark:text-gray-400">Track your daily habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habits.map((habit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-3">
                      {habit.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                    </div>
                    <Badge variant={habit.completed ? "default" : "secondary"}>
                      {habit.streak} day streak
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Goals Progress</CardTitle>
              <CardDescription className="dark:text-gray-400">Your current goals and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {loadingGoals ? (
                  <p className="text-gray-500 dark:text-gray-400">Loading goals...</p>
                ) : errorGoals ? (
                  <p className="text-red-500 dark:text-red-400">Error: {errorGoals}</p>
                ) : goals.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No goals found. Add some!</p>
                ) : (
                  goals.map((goal) => (
                    <div key={goal._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{goal.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Target: {goal.target}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
