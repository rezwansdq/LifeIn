
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Calendar = () => {
  // Generate calendar data for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Mock data for demonstration
  const dailyRatings = {
    1: 8, 2: 7, 3: 9, 4: 6, 5: 8, 6: 7, 7: 9,
    8: 8, 9: 6, 10: 7, 11: 8, 12: 9, 13: 7, 14: 8,
    15: 6, 16: 9, 17: 8, 18: 7, 19: 8, 20: 9, 21: 7
  };

  const habitCompletions = {
    1: 3, 2: 4, 3: 2, 4: 3, 5: 4, 6: 2, 7: 3,
    8: 4, 9: 3, 10: 2, 11: 4, 12: 3, 13: 2, 14: 4,
    15: 3, 16: 4, 17: 2, 18: 3, 19: 4, 20: 2, 21: 3
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500";
    if (rating >= 6) return "bg-yellow-500";
    if (rating >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getHabitCompletionColor = (count: number, total = 4) => {
    const percentage = (count / total) * 100;
    if (percentage >= 80) return "bg-green-100 border-green-300";
    if (percentage >= 60) return "bg-yellow-100 border-yellow-300";
    if (percentage >= 40) return "bg-orange-100 border-orange-300";
    return "bg-red-100 border-red-300";
  };

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar View</h1>
          <p className="text-gray-600">Track your daily progress and habit completions</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <CardDescription>
                  Daily ratings and habit completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="aspect-square" />;
                    }

                    const isToday = day === today.getDate();
                    const rating = dailyRatings[day];
                    const habitCount = habitCompletions[day];
                    const hasData = rating || habitCount;

                    return (
                      <div
                        key={day}
                        className={cn(
                          "aspect-square border rounded-lg p-2 relative transition-colors cursor-pointer hover:bg-gray-50",
                          isToday ? "ring-2 ring-primary" : "",
                          hasData ? getHabitCompletionColor(habitCount || 0) : "border-gray-200"
                        )}
                      >
                        <div className="text-sm font-medium">{day}</div>
                        
                        {rating && (
                          <div className="absolute top-1 right-1">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              getRatingColor(rating)
                            )} />
                          </div>
                        )}
                        
                        {habitCount && (
                          <div className="absolute bottom-1 left-1 text-xs">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {habitCount}/4
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legend and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Daily Ratings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">8-10 (Great)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">6-7 (Good)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm">4-5 (Okay)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">0-3 (Tough)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Habit Completion</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-3 bg-green-100 border border-green-300 rounded" />
                      <span className="text-sm">80%+ habits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-3 bg-yellow-100 border border-yellow-300 rounded" />
                      <span className="text-sm">60-79% habits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-3 bg-orange-100 border border-orange-300 rounded" />
                      <span className="text-sm">40-59% habits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-3 bg-red-100 border border-red-300 rounded" />
                      <span className="text-sm">&lt;40% habits</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">7.8</div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <p className="text-sm text-gray-600">Days Tracked</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">72%</div>
                  <p className="text-sm text-gray-600">Habit Completion</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
