import { motion } from "motion/react";
import { FileText, Sparkles, Upload, CheckCircle } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  onFileUpload?: (file: File, title: string) => void;
}

export function Hero({ onFileUpload }: HeroProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("My Presentation");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (!file || !onFileUpload) return;
    onFileUpload(file, title);
  };

  const handleReset = () => {
    setFile(null);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span className="text-sm text-white/90">Research Paper → PPT Generator</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
        >
          Transform Papers
          <br />
          <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent">
            Into Presentations
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto"
        >
          Upload your research paper and let our AI create a stunning, professional presentation in seconds. Save hours of work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 bg-white/5 backdrop-blur-sm ${
              dragActive
                ? "border-accent-400 bg-accent-500/10"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {!file ? (
              <div className="space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Drop your research paper here or click to browse
                  </p>
                  <p className="text-white/60">
                    Supports PDF, DOC, DOCX (Max 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-1">
                    {file.name}
                  </p>
                  <p className="text-white/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 mt-2 text-green-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">File ready</span>
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 space-y-4">
              {/* Title input */}
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Presentation Title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-400 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate PPT
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <button
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            View Pricing Plans
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-8 text-white/60 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Free plan available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}