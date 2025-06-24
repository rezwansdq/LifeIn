
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Calendar, BarChart3, Star, Users } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Daily Check-ins",
      description: "Rate your day and track your mood with simple daily check-ins"
    },
    {
      icon: Target,
      title: "Habit Tracking",
      description: "Build and maintain healthy habits with streak tracking and goals"
    },
    {
      icon: Calendar,
      title: "Calendar View",
      description: "Visualize your progress over time with an intuitive calendar interface"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Get insights into your patterns and progress with detailed analytics"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "LifeIn has completely transformed how I track my daily habits. The simple interface makes it so easy to stay consistent!",
      rating: 5
    },
    {
      name: "Mike Chen",
      text: "I love the calendar view - seeing my progress visually really motivates me to keep going.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      text: "The analytics help me understand my patterns better. I can see what affects my mood and energy levels.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Life<span className="text-blue-600 dark:text-blue-400">In</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Track your daily life, build better habits, and gain insights into your well-being with our simple and intuitive life tracking app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to track your life
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple, powerful tools to help you understand yourself better and build the life you want.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="dark:text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What our users say
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands of people who are already tracking their lives with LifeIn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="dark:bg-gray-700 dark:border-gray-600">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{testimonial.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join LifeIn today and take the first step towards a more intentional and tracked life.
        </p>
        <Link to="/login">
          <Button size="lg">
            Start Tracking Today
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
