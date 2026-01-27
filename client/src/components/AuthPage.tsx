import { motion } from "motion/react";
import { FileText, Github, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AuthPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export function AuthPage({ onBack, onLogin }: AuthPageProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769120064066-4ab270e38ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kJTIwYmx1ZSUyMHB1cnBsZXxlbnwxfHx8fDE3Njk1MTc4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
        <div 
          onClick={onBack}
          className="flex items-center gap-2 mb-8 cursor-pointer group"
        >
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg group-hover:shadow-lg group-hover:shadow-primary-500/50 transition-all duration-300">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">PaperToPPT</span>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your presentations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" title="Password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white/5 border-white/10 text-white focus-visible:ring-primary-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90 text-white"
              onClick={onLogin}
            >
              Sign In
            </Button>
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                Sign Up
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
