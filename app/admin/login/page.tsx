"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginForm {
  employeeId: string;
  password: string;
}

// Mock admin credentials - In production, this would be handled by a secure backend
const MOCK_ADMIN = {
  employeeId: "GT001",
  password: "admin123"
};

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginForm>({
    employeeId: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when input changes
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate employee ID format
      if (!formData.employeeId.match(/^GT\d{3}$/)) {
        throw new Error("Invalid employee ID format. Should be GT followed by 3 digits (e.g., GT001)");
      }

      // In production, this would be an API call to validate credentials
      if (formData.employeeId === MOCK_ADMIN.employeeId && formData.password === MOCK_ADMIN.password) {
        // Store admin session
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('employeeId', formData.employeeId);
        
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });

        router.push('/admin/dashboard');
      } else {
        throw new Error("Invalid employee ID or password");
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full theme-gradient-bg mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Access the GroqTales admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="employeeId" className="text-sm font-medium">
                Employee ID
              </label>
              <Input
                id="employeeId"
                name="employeeId"
                placeholder="GT001"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Format: GT followed by 3 digits (e.g., GT001)
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full theme-gradient-bg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Lock className="mr-2 h-4 w-4 animate-pulse" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Login to Dashboard
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                For admin access requests, please contact the IT department
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 