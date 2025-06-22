
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckIn = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === null) {
      toast({
        title: "Please rate your day",
        description: "Select a rating from 0-10 before submitting.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to database
    console.log("Check-in submitted:", { rating, notes, date: new Date() });
    
    toast({
      title: "Check-in saved! 🎉",
      description: "Your daily reflection has been recorded.",
    });
    
    // Reset form
    setRating(null);
    setNotes("");
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Check-in</h1>
          <p className="text-gray-600">{today}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              How was your day?
            </CardTitle>
            <CardDescription>
              Take a moment to reflect on your day and rate your overall experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Rate your day (0-10)</Label>
                <div className="grid grid-cols-11 gap-2">
                  {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={rating === num ? "default" : "outline"}
                      className="aspect-square p-0 text-sm"
                      onClick={() => setRating(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                {rating !== null && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{rating}/10</div>
                    <p className="text-gray-600">
                      {rating >= 8 ? "Great day! 🌟" : 
                       rating >= 6 ? "Good day! 😊" : 
                       rating >= 4 ? "Okay day 😐" : 
                       "Tough day 💙"}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-medium">
                  Daily Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="What made your day special? Any thoughts or reflections..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Save Check-in
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Check-ins Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Yesterday", rating: 8, notes: "Great workout and productive work day!" },
                { date: "2 days ago", rating: 6, notes: "Good day overall, felt a bit tired." },
                { date: "3 days ago", rating: 9, notes: "Amazing day with friends and family." },
              ].map((entry, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{entry.date}</span>
                      <span className="text-lg font-bold text-primary">{entry.rating}/10</span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600">{entry.notes}</p>
                    )}
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

export default CheckIn;
