import { motion, AnimatePresence } from "motion/react";
import { X, Upload, FileText, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
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

  const handleGenerate = () => {
    if (!file) return;
    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    setFile(null);
    setProcessing(false);
    setCompleted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full border border-white/10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    Upload Research Paper
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-white/60" />
                  </button>
                </div>

                {!completed ? (
                  <>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
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
                              Drop your file here or click to browse
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

                    <div className="mt-8 flex gap-4">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                        disabled={processing}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={!file || processing}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Generate Presentation"
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
