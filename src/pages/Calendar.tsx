import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface CheckInEntry {
  _id: string;
  date: string; // ISO string
  rating: number;
  notes?: string;
  mood?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We want Monday to be the first day of the week (index 0) for calendar display
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchCheckIns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/checkins", {
        headers: {
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch check-ins");
      }

      setCheckIns(data);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const checkInsByDate = checkIns.reduce((acc, checkIn) => {
    const date = new Date(checkIn.date);
    const key = formatDateKey(date);
    acc[key] = checkIn;
    return acc;
  }, {} as Record<string, CheckInEntry>);

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
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
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
                    const checkInInfo = checkInsByDate[dateKey];
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
                              {checkInInfo.mood && <span className="text-xs">{checkInInfo.mood}</span>}
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
                {loading ? (
                  <p className="text-gray-500 dark:text-gray-400">Loading check-in data...</p>
                ) : error ? (
                  <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                ) : checkInsByDate[formatDateKey(selectedDate)] ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Rating</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${getRatingColor(checkInsByDate[formatDateKey(selectedDate)].rating)}`} />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {checkInsByDate[formatDateKey(selectedDate)].rating}/10
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mood</p>
                      <span className="text-2xl">{checkInsByDate[formatDateKey(selectedDate)].mood}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                      <p className="text-gray-900 dark:text-white">
                        {checkInsByDate[formatDateKey(selectedDate)].notes || "No notes for this day."}
                      </p>
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
