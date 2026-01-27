import { motion } from "motion/react";
import { FileText, Menu, X, FolderOpen, LogOut, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onFiles?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ onGetStarted, onSignIn, onFiles, isLoggedIn, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PaperToPPT</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                Testimonials
              </a>
              {onFiles && (
                <button
                  onClick={onFiles}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
                >
                  <FolderOpen className="w-4 h-4" />
                  Files
                </button>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 text-white/80">
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={onSignIn}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 mt-4 border-t border-white/10"
            >
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-white/80 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-white/80 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-white/80 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                {onFiles && (
                  <button
                    onClick={() => {
                      onFiles();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left py-2 flex items-center gap-2"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Files
                  </button>
                )}
                {isLoggedIn ? (
                  <button 
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left py-2 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      onSignIn();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white transition-colors text-left py-2"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold"
                >
                  Get Started
                </button>
              </div>
            </motion.nav>
          )}
        </div>
      </div>
    </motion.header>
  );
}
