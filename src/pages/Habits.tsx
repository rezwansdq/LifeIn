
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Circle, Plus, Target, Flame, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Habit {
  _id: string;
  name: string;
  completed: boolean;
  streak: number;
  target: number;
  category: string;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/habits", {
        headers: {
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch habits");
      }

      setHabits(data);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleHabit = async (id: string) => {
    const habitToUpdate = habits.find(h => h._id === id);
    if (!habitToUpdate) return;

    const updatedCompleted = !habitToUpdate.completed;
    const updatedStreak = updatedCompleted ? habitToUpdate.streak + 1 : Math.max(0, habitToUpdate.streak - 1);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ completed: updatedCompleted, streak: updatedStreak }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update habit");
      }

      setHabits(habits.map(habit =>
        habit._id === id ? { ...habit, completed: updatedCompleted, streak: updatedStreak } : habit
      ));
      toast.success("Habit updated!");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) {
      toast.error("Habit name cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ name: newHabitName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to add habit");
      }

      setHabits([...habits, data]);
      setNewHabitName("");
      setIsDialogOpen(false);
      toast.success("New habit added!");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token || "",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to delete habit");
      }

      setHabits(habits.filter(habit => habit._id !== id));
      toast.success("Habit deleted!");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    }
  };

  const categories = ["All", "Health", "Learning", "Wellness", "Personal"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredHabits = selectedCategory === "All" 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory);

  const completionRate = habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Habit Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300">Build better habits, one day at a time</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Add New Habit</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Create a new habit to track daily
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button onClick={addHabit} className="w-full">
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today's Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(completionRate)}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={completionRate} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Habits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{habits.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.max(...habits.map(h => h.streak), 0)} days
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Habits</CardTitle>
            <CardDescription className="dark:text-gray-400">Track your daily habits and build streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory !== category ? "dark:border-gray-600 dark:text-gray-300" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredHabits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleHabit(habit._id)}
                      className="flex-shrink-0"
                    >
                      {habit.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                    <div>
                      <h3 className={`font-medium ${habit.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {habit.streak} day streak
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {habit.category}
                    </Badge>
                    {habit.streak > 0 && (
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-500">{habit.streak}</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHabit(habit._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Habits;
