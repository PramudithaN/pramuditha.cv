import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { isSessionActive } from "../utils/auth";

interface AdminToggleProps {
  onOpen: () => void;
  isDownloading: boolean;
  isSessionUnlocked: boolean;
}

export const AdminToggle: React.FC<AdminToggleProps> = ({ 
  onOpen, 
  isDownloading,
  isSessionUnlocked 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (isSessionActive()) return true;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("admin") === "true" || urlParams.get("edit") === "true" || window.location.hash === "#admin";
  });

  useEffect(() => {
    if (isSessionUnlocked) {
      setIsVisible(true);
    }
  }, [isSessionUnlocked]);

  useEffect(() => {
    // Secret keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsVisible(true);
        onOpen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);

  // For normal visitors without ?admin=true or shortcut, return null (completely hidden)
  if (isDownloading || (!isVisible && !isSessionUnlocked)) return null;

  return (
    <button
      onClick={onOpen}
      title="Admin Access (Shortcut: Ctrl + Shift + A)"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-full shadow-xl hover:shadow-2xl backdrop-blur border border-slate-700/50 hover:scale-105 active:scale-95 transition-all duration-200 animate-in fade-in"
    >
      <Settings className="w-4 h-4 text-blue-400" />
      <span>Edit CV (Admin)</span>
    </button>
  );
};
