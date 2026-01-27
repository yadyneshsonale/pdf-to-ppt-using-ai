import { motion } from "motion/react";
import { FileText, Sparkles, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { generatePresentation, type GenerateProgress, type GenerateResponse, ApiError } from "../services/api";

interface HeroProps {
  onUploadComplete?: (response: GenerateResponse, title: string) => void;
}

export function Hero({ onUploadComplete }: HeroProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("My Presentation");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState<GenerateProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);
    setProgress({ status: 'uploading', message: 'Starting...', progress: 0 });

    try {
      const response = await generatePresentation(
        file,
        title,
        (progressUpdate) => setProgress(progressUpdate)
      );

      setProcessing(false);
      setCompleted(true);

      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete(response, title);
        } else {
          handleReset();
        }
      }, 1500);

    } catch (err) {
      setProcessing(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setProgress(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProcessing(false);
    setCompleted(false);
    setProgress(null);
    setError(null);
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
          <span className="text-sm text-white/90">AI-Powered Presentation Generator</span>
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
          {!completed ? (
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
                disabled={processing}
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
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Presentation Ready!
              </h3>
              <p className="text-white/70">
                Your presentation has been generated successfully.
              </p>
            </div>
          )}

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Progress display */}
          {processing && progress && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent-400" />
                <p className="text-white/80 text-sm">{progress.message}</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {file && !completed && (
            <div className="mt-6 space-y-4">
              {/* Title input */}
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Presentation Title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-400 transition-colors"
                  disabled={processing}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={processing}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {progress?.message || "Processing..."}
                    </>
                  ) : (
                    "Generate Presentation"
                  )}
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