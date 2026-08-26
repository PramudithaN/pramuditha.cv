import { useState, useEffect, useCallback } from "react";
import { CVData } from "../types/cv";
import { defaultCVData } from "../data/defaultCV";
import { Octokit } from "@octokit/rest";

const STORAGE_KEY = "pramuditha_cv_custom_data_v2";
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/PramudithaN/pramuditha.cv/main/src/data/cv-data.json";

export function useCVData() {
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load CV data from localStorage", e);
    }
    return defaultCVData;
  });

  const [isLoadingRemote, setIsLoadingRemote] = useState(false);

  // Automatically fetch the latest published data from GitHub on load
  useEffect(() => {
    let isMounted = true;

    const fetchLatestFromGitHub = async () => {
      setIsLoadingRemote(true);
      try {
        // Cache buster parameter ensures mobile & desktop always fetch the latest commit
        const res = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && remoteData.personalInfo && remoteData.technicalSkills) {
            if (isMounted) {
              setCvData(remoteData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
              } catch (err) {
                console.error("Failed to save remote data to storage", err);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote CV data, using local/default.", err);
      } finally {
        if (isMounted) {
          setIsLoadingRemote(false);
        }
      }
    };

    fetchLatestFromGitHub();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes locally in browser
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      console.error("Failed to save CV data to localStorage", e);
    }
  }, [cvData]);

  const updateCVData = useCallback((updater: CVData | ((prev: CVData) => CVData)) => {
    setCvData(updater);
  }, []);

  const resetToDefaults = useCallback(() => {
    setCvData(defaultCVData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset localStorage", e);
    }
  }, []);

  const exportJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "cv-data-" + new Date().toISOString().slice(0, 10) + ".json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [cvData]);

  const importJSON = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && parsed.personalInfo && parsed.technicalSkills) {
            setCvData(parsed);
            resolve(true);
            return;
          }
          resolve(false);
        } catch (err) {
          console.error("Failed to parse imported JSON", err);
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }, []);

  const syncToGitHub = useCallback(async (
    token: string,
    owner: string,
    repo: string,
    filePath: string = "src/data/cv-data.json"
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const octokit = new Octokit({ auth: token });
      
      let sha: string | undefined;
      try {
        const existing = await octokit.repos.getContent({
          owner,
          repo,
          path: filePath,
        });
        if (!Array.isArray(existing.data) && "sha" in existing.data) {
          sha = existing.data.sha;
        }
      } catch (err) {
        // File does not exist yet
      }

      const jsonString = JSON.stringify(cvData, null, 2);
      const content = btoa(unescape(encodeURIComponent(jsonString)));

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: "Update CV data via Admin Panel",
        content,
        sha,
      });

      return { success: true, message: "Successfully synced to GitHub! All devices will now see this update." };
    } catch (err: any) {
      console.error("GitHub Sync error:", err);
      return { success: false, message: err.message || "Failed to commit changes to GitHub" };
    }
  }, [cvData]);

  return {
    cvData,
    isLoadingRemote,
    updateCVData,
    resetToDefaults,
    exportJSON,
    importJSON,
    syncToGitHub,
  };
}
