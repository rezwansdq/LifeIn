import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({ name: '', email: '' });

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth", {
        headers: { "x-auth-token": token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch user profile");
      }

      setUser(data);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: user.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account settings</p>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;