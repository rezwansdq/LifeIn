
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, TrendingUp, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todaysHabits = [
    { id: 1, name: "Morning Meditation", completed: true, streak: 7 },
    { id: 2, name: "Exercise", completed: false, streak: 12 },
    { id: 3, name: "Read 30 minutes", completed: true, streak: 3 },
    { id: 4, name: "Journal", completed: false, streak: 5 },
  ];

  const goals = [
    { id: 1, name: "Meditate 20 days this month", progress: 65, current: 13, target: 20 },
    { id: 2, name: "Exercise 3 times per week", progress: 80, current: 8, target: 10 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning! 👋</h1>
          <p className="text-gray-600">{today}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Check-in Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                Today's Check-in
              </CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-gray-400 mb-4">?/10</div>
                <Link to="/checkin">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Rate Your Day
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">4</div>
                  <p className="text-sm text-gray-600">Active Habits</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <p className="text-sm text-gray-600">Longest Streak</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">8.2</div>
                  <p className="text-sm text-gray-600">Avg. Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Today's Habits
                </div>
                <Link to="/habits">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysHabits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        habit.completed ? 'bg-primary border-primary' : 'border-gray-300'
                      }`}>
                        {habit.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={habit.completed ? 'line-through text-gray-500' : ''}>
                        {habit.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      🔥 {habit.streak}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.name}</span>
                      <span className="text-gray-500">{goal.current}/{goal.target}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
