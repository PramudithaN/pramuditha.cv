import React, { useState } from "react";
import { Lock, Eye, EyeOff, X, KeyRound, AlertTriangle } from "lucide-react";
import { verifyPassword, createSession } from "../utils/auth";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    const isValid = await verifyPassword(password);
    setIsVerifying(false);

    if (isValid) {
      createSession();
      setPassword("");
      setError(null);
      setFailedAttempts(0);
      onAuthenticated();
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      
      if (attempts >= 5) {
        setIsLockedOut(true);
        setError("Too many failed attempts. Locked for 30 seconds.");
        setTimeout(() => {
          setIsLockedOut(false);
          setFailedAttempts(0);
          setError(null);
        }, 30000);
      } else {
        setError(`Incorrect password. ${5 - attempts} attempt(s) remaining.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Admin Authentication</h2>
              <p className="text-xs text-slate-400">Enter master password to access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLockedOut || isVerifying}
                autoFocus
                placeholder="Enter password..."
                className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Initial default password is <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600">admin</code> (changeable in settings).
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLockedOut || isVerifying}
              className="w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
            >
              {isVerifying ? "Verifying..." : "Unlock Panel"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
