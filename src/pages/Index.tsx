
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">LifeIn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your private tool for personal reflection, habit-building, and tracking growth. 
            Take control of your life, one day at a time.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="px-8">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Habits</h3>
            <p className="text-gray-600">Build lasting habits with streak tracking and visual progress.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Reflection</h3>
            <p className="text-gray-600">Rate your day and add personal notes for growth.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visual Progress</h3>
            <p className="text-gray-600">See your journey with charts and calendar views.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
