import { motion } from "motion/react";
import { useState } from "react";
import { FileText, Github, Mail, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../services/auth";

interface SignUpPageProps {
  onBack: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

export function SignUpPage({ onBack, onSignUp, onSignIn }: SignUpPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRequirements.every(req => req.met)) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(email, password, name);
      onSignUp();
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
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-slate-400">
              Get started with your free account
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

              {/* Name field */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500"
                  required
                />
              </div>

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
                <Label htmlFor="password" className="text-slate-200">Password</Label>
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
                
                {/* Password requirements */}
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Check className={`w-3 h-3 ${req.met ? 'text-green-400' : 'text-slate-500'}`} />
                      <span className={req.met ? 'text-green-400' : 'text-slate-500'}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              
              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSignIn}
                  className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Sign In
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
