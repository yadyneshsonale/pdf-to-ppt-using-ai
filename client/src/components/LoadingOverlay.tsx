import { motion, AnimatePresence } from "motion/react";
import { Loader2, FileText, Sparkles, Check, Brain, Palette, Presentation } from "lucide-react";

export interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  progress?: number;
  currentStep?: string;
  steps?: LoadingStep[];
  variant?: 'generation' | 'processing' | 'loading';
}

const stepIcons: Record<string, React.ReactNode> = {
  upload: <FileText className="w-5 h-5" />,
  analyzing: <Brain className="w-5 h-5" />,
  generating: <Sparkles className="w-5 h-5" />,
  styling: <Palette className="w-5 h-5" />,
  finalizing: <Presentation className="w-5 h-5" />,
};

export function LoadingOverlay({
  isVisible,
  title = "Processing...",
  subtitle = "Please wait while we work on your request",
  progress = 0,
  currentStep,
  steps,
  variant = 'loading'
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse delay-500" />
          </div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-lg w-full mx-4"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Animated Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Outer ring animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-500/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 80, height: 80, left: -8, top: -8 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent-500/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    style={{ width: 80, height: 80, left: -8, top: -8 }}
                  />
                  
                  {/* Main spinner */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                    {variant === 'generation' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                    ) : (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Title & Subtitle */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-slate-400">{subtitle}</p>
                {currentStep && (
                  <motion.p
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary-400 mt-2 text-sm"
                  >
                    {currentStep}
                  </motion.p>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ backgroundSize: "200% 100%" }}
                  />
                </div>
              </div>
              
              {/* Steps */}
              {steps && steps.length > 0 && (
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        step.status === 'active' 
                          ? 'bg-primary-500/20 border border-primary-500/30' 
                          : step.status === 'completed'
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        step.status === 'active' 
                          ? 'bg-primary-500 text-white' 
                          : step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {step.status === 'completed' ? (
                          <Check className="w-4 h-4" />
                        ) : step.status === 'active' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          stepIcons[step.id] || <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        step.status === 'active' 
                          ? 'text-white' 
                          : step.status === 'completed'
                          ? 'text-green-400'
                          : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Tips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center"
              >
                <p className="text-xs text-slate-500">
                  💡 Tip: You can switch tabs - we'll keep working in the background
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple loading spinner for inline use
 */
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };
  
  return (
    <Loader2 className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} />
  );
}

/**
 * Card loading skeleton
 */
export function LoadingSkeleton({ count = 3, variant = 'card' }: { count?: number; variant?: 'card' | 'list' | 'text' }) {
  if (variant === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-white/10 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
        ))}
      </div>
    );
  }
  
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-white/10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
          <div className="aspect-video bg-white/10 rounded-lg mb-4" />
          <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
