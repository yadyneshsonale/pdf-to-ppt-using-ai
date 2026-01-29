import { motion } from "motion/react";
import { useState } from "react";
import { FileText, Github, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../services/auth";

interface SignInPageProps {
  onBack: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export function SignInPage({ onBack, onSignIn, onSignUp }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSignIn();
    } catch (err) {
      if (err instanceof AuthApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769120064066-4ab270e38ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kJTIwYmx1ZSUyMHB1cnBsZXxlbnwxfHx8fDE3Njk1MTc4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Futuristic Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">PaperToPPT</span>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Github
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-400">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Email field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500"
                  required
                />
              </div>

              {/* Password field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <p className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSignUp}
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
