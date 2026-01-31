import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Accept any credentials
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.75 0.18 175) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.75 0.18 175) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Glow orb behind card */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, oklch(0.75 0.18 175 / 0.15) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <Card className="w-full max-w-md relative z-10 animate-slide-up border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-1 text-center pb-8">
          {/* Logo/Brand */}
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-float">
            <svg 
              className="w-6 h-6 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to manage your inventory
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 animate-slide-up opacity-0 delay-100">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-input/50 border-border/50 focus:bg-input/80 transition-colors"
              />
            </div>
            
            <div className="space-y-2 animate-slide-up opacity-0 delay-200">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-input/50 border-border/50 focus:bg-input/80 transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-medium animate-slide-up opacity-0 delay-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-slide-up opacity-0 delay-400">
            <p className="text-sm text-muted-foreground">
              Use any credentials to continue
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Corner accent */}
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 opacity-30"
        style={{
          background: 'radial-gradient(circle at bottom right, oklch(0.75 0.18 175 / 0.2) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default Index;
