
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { toast } from "sonner";

const CheckIn = () => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    toast.success("Check-in saved successfully!");
    console.log("Check-in saved:", { rating, notes, mood, date: new Date() });
    
    // Reset form
    setRating(0);
    setNotes("");
    setMood("");
  };

  const moods = ["😊", "😐", "😔", "😤", "😴", "🤔", "😍", "😨"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Daily Check-in</h1>
          <p className="text-gray-600 dark:text-gray-300">How was your day today?</p>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Rate Your Day</CardTitle>
            <CardDescription className="dark:text-gray-400">Give your day a rating from 1-10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Overall Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      rating >= num
                        ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                        : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-yellow-400 dark:hover:border-yellow-400"
                    }`}
                  >
                    <Star className="w-5 h-5 mx-auto" fill={rating >= num ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  You rated today: {rating}/10
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {moods.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setMood(emoji)}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      mood === emoji
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What made today special? Any thoughts or reflections..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Save Check-in
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;
