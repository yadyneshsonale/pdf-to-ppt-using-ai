import { motion } from "motion/react";
import { FileText, Menu, X, LogOut, User, LayoutDashboard, Shield, Layout, CreditCard } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSignUp?: () => void;
  onFiles?: () => void;
  onDashboard?: () => void;
  onAdmin?: () => void;
  onPricing?: () => void;
  onTemplates?: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function Header({ 
  onGetStarted, 
  onSignIn, 
  onSignUp,
  onFiles, 
  onDashboard,
  onAdmin,
  onPricing,
  onTemplates,
  isLoggedIn, 
  isAdmin,
  userName,
  onLogout 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={onGetStarted}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">PaperToPPT</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Features
              </button>
              {onTemplates && (
                <button 
                  onClick={onTemplates}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <Layout className="w-4 h-4" />
                  Templates
                </button>
              )}
              {onPricing && (
                <button 
                  onClick={onPricing}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <CreditCard className="w-4 h-4" />
                  Pricing
                </button>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {isAdmin && onAdmin && (
                    <button
                      onClick={onAdmin}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </button>
                  )}
                  {onDashboard && (
                    <button
                      onClick={onDashboard}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <User className="w-4 h-4 text-primary-400" />
                    <span className="text-sm text-white/80 max-w-24 truncate">{userName || 'Account'}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onSignIn}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                  >
                    Sign In
                  </button>
                  {onSignUp && (
                    <button 
                      onClick={onSignUp}
                      className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                    >
                      Sign Up
                    </button>
                  )}
                </>
              )}
              <button
                onClick={onGetStarted}
                className="px-5 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
              className="lg:hidden pt-4 mt-4 border-t border-white/10"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    scrollToSection('features');
                    setMobileMenuOpen(false);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left"
                >
                  Features
                </button>
                {onTemplates && (
                  <button
                    onClick={() => {
                      onTemplates();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left flex items-center gap-2"
                  >
                    <Layout className="w-4 h-4" />
                    Templates
                  </button>
                )}
                {onPricing && (
                  <button
                    onClick={() => {
                      onPricing();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pricing
                  </button>
                )}
                
                <div className="border-t border-white/10 my-2" />
                
                {isLoggedIn ? (
                  <>
                    {onDashboard && (
                      <button
                        onClick={() => {
                          onDashboard();
                          setMobileMenuOpen(false);
                        }}
                        className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                    )}
                    {isAdmin && onAdmin && (
                      <button
                        onClick={() => {
                          onAdmin();
                          setMobileMenuOpen(false);
                        }}
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors py-3 px-3 rounded-lg text-left flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </button>
                    )}
                    <div className="flex items-center gap-2 py-3 px-3 bg-white/5 rounded-lg">
                      <User className="w-4 h-4 text-primary-400" />
                      <span className="text-sm text-white/80">{userName || 'Account'}</span>
                    </div>
                    <button 
                      onClick={() => {
                        onLogout?.();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors py-3 px-3 rounded-lg text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        onSignIn();
                        setMobileMenuOpen(false);
                      }}
                      className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left"
                    >
                      Sign In
                    </button>
                    {onSignUp && (
                      <button 
                        onClick={() => {
                          onSignUp();
                          setMobileMenuOpen(false);
                        }}
                        className="text-white/80 hover:text-white hover:bg-white/5 transition-colors py-3 px-3 rounded-lg text-left"
                      >
                        Sign Up
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold text-center"
                >
                  Get Started Free
                </button>
              </div>
            </motion.nav>
          )}
        </div>
      </div>
    </motion.header>
  );
}
