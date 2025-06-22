
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Target, Flame, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Habits = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Meditation", description: "10 minutes of mindfulness", currentStreak: 7, longestStreak: 15, completedToday: true },
    { id: 2, name: "Exercise", description: "30 minutes of physical activity", currentStreak: 12, longestStreak: 18, completedToday: false },
    { id: 3, name: "Read 30 minutes", description: "Daily reading habit", currentStreak: 3, longestStreak: 8, completedToday: true },
    { id: 4, name: "Journal", description: "Write thoughts and gratitude", currentStreak: 5, longestStreak: 12, completedToday: false },
    { id: 5, name: "Drink 8 glasses of water", description: "Stay hydrated throughout the day", currentStreak: 2, longestStreak: 6, completedToday: false },
  ]);

  const [newHabit, setNewHabit] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const toggleHabit = (habitId: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completedToday: !habit.completedToday,
            currentStreak: !habit.completedToday ? habit.currentStreak + 1 : Math.max(0, habit.currentStreak - 1)
          }
        : habit
    ));
    
    const habit = habits.find(h => h.id === habitId);
    toast({
      title: habit?.completedToday ? "Habit unchecked" : "Great job! 🎉",
      description: habit?.completedToday 
        ? `${habit.name} marked as incomplete` 
        : `${habit?.name} completed! Keep the streak going!`,
    });
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;

    const habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description,
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: "", description: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "New habit added! 🌱",
      description: `${habit.name} has been added to your habit tracker.`,
    });
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
            <p className="text-gray-600">
              {completedToday}/{totalHabits} habits completed today
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
                <DialogDescription>
                  Create a new habit to track your daily progress.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addHabit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="habitName">Habit Name</Label>
                  <Input
                    id="habitName"
                    placeholder="e.g., Morning Exercise"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="habitDescription">Description (Optional)</Label>
                  <Input
                    id="habitDescription"
                    placeholder="e.g., 30 minutes of cardio"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Add Habit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalHabits}</div>
              <p className="text-sm text-gray-600">Active Habits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{completedToday}</div>
              <p className="text-sm text-gray-600">Completed Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-500">
                {Math.max(...habits.map(h => h.currentStreak), 0)}
              </div>
              <p className="text-sm text-gray-600">Longest Current Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Habits List */}
        <div className="grid gap-4">
          {habits.map((habit) => (
            <Card key={habit.id} className={`transition-all ${habit.completedToday ? 'ring-2 ring-green-200 bg-green-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={habit.completedToday ? "default" : "outline"}
                      size="sm"
                      className="rounded-full w-10 h-10 p-0"
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {habit.completedToday && <CheckCircle className="h-5 w-5" />}
                    </Button>
                    <div>
                      <h3 className={`font-semibold ${habit.completedToday ? 'line-through text-gray-500' : ''}`}>
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-gray-600">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center text-orange-500">
                        <Flame className="h-4 w-4 mr-1" />
                        <span className="font-bold">{habit.currentStreak}</span>
                      </div>
                      <p className="text-xs text-gray-500">Current</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="font-bold">{habit.longestStreak}</span>
                      </div>
                      <p className="text-xs text-gray-500">Best</p>
                    </div>
                    <Badge variant={habit.completedToday ? "default" : "secondary"}>
                      {habit.completedToday ? "Done" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {habits.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
              <p className="text-gray-600 mb-4">Start building better habits today!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Habits;
