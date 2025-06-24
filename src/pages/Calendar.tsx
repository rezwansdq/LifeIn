import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Sample data for demonstration
  const checkInData = {
    "2024-01-15": { rating: 8, mood: "😊", habits: 3 },
    "2024-01-16": { rating: 6, mood: "😐", habits: 2 },
    "2024-01-17": { rating: 9, mood: "😍", habits: 4 },
    "2024-01-18": { rating: 7, mood: "😊", habits: 3 },
    "2024-01-19": { rating: 5, mood: "😔", habits: 1 },
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500";
    if (rating >= 6) return "bg-yellow-500";
    if (rating >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar View</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your daily progress over time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-white">
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="dark:border-gray-600">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="dark:border-gray-600">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (!day) return <div key={index} className="p-2" />;
                    
                    const date = new Date(currentYear, currentMonth, day);
                    const dateKey = formatDateKey(date);
                    const checkInInfo = checkInData[dateKey];
                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          p-2 text-sm rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          ${isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''}
                          ${checkInInfo ? 'font-semibold' : ''}
                          text-gray-900 dark:text-white
                        `}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <span>{day}</span>
                          {checkInInfo && (
                            <div className="flex space-x-1">
                              <div className={`w-2 h-2 rounded-full ${getRatingColor(checkInInfo.rating)}`} />
                              <span className="text-xs">{checkInInfo.mood}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {checkInData[formatDateKey(selectedDate)] ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Rating</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${getRatingColor(checkInData[formatDateKey(selectedDate)].rating)}`} />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {checkInData[formatDateKey(selectedDate)].rating}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mood</p>
                      <span className="text-2xl">{checkInData[formatDateKey(selectedDate)].mood}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Habits Completed</p>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {checkInData[formatDateKey(selectedDate)].habits} habits
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No check-in data for this date</p>
                )}
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Great day (8-10)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Good day (6-7)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Okay day (4-5)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tough day (1-3)</span>
                  </div>
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
