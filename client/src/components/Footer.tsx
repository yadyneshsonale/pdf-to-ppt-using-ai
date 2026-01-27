import { FileText, Twitter, Linkedin, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PaperToPPT</span>
            </div>
            <p className="text-white/60 text-sm">
              Transform your research papers into stunning presentations with AI.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2026 PaperToPPT. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Twitter className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Linkedin className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Github className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </a>
            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
