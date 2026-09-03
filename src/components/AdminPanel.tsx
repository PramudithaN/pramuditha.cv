import React, { useState } from "react";
import { 
  X, Save, RotateCcw, Download, Upload, Github, 
  User, Code, Briefcase, FolderGit2, GraduationCap, 
  Plus, Trash2, CheckCircle2, AlertCircle, KeyRound, Lock
} from "lucide-react";
import { CVData, SkillItem, ExperienceItem, ProjectItem, EducationItem } from "../types/cv";
import { hashPassword, verifyPassword, setStoredPasswordHash, clearSession } from "../utils/auth";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  cvData: CVData;
  onUpdate: (data: CVData) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
  onSyncGitHub: (token: string, owner: string, repo: string) => Promise<{ success: boolean; message: string }>;
}

type TabType = "personal" | "skills" | "experience" | "projects" | "education" | "sync";

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  cvData,
  onUpdate,
  onReset,
  onExport,
  onImport,
  onSyncGitHub,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [formData, setFormData] = useState<CVData>(cvData);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // GitHub sync states
  const [ghToken, setGhToken] = useState(
    sessionStorage.getItem("gh_pat_token") || localStorage.getItem("gh_pat_token") || ""
  );
  const [ghOwner, setGhOwner] = useState(
    localStorage.getItem("gh_owner") || process.env.REACT_APP_GITHUB_OWNER || "PramudithaN"
  );
  const [ghRepo, setGhRepo] = useState(
    localStorage.getItem("gh_repo") || process.env.REACT_APP_GITHUB_REPO || "pramuditha.cv"
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Password change states
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [pwdMessage, setPwdMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    setFormData(cvData);
  }, [cvData]);

  if (!isOpen) return null;

  const showNotification = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handlePersonalInfoChange = (field: keyof CVData["personalInfo"], value: string) => {
    const updated = {
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    };
    setFormData(updated);
    onUpdate(updated);
  };

  // Skill Handlers
  const handleAddSkill = () => {
    const newSkill: SkillItem = {
      id: "skill-" + Date.now(),
      category: "New Category",
      skills: "Skill 1, Skill 2, Skill 3",
    };
    const updated = {
      ...formData,
      technicalSkills: [...formData.technicalSkills, newSkill],
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateSkill = (id: string, field: "category" | "skills", value: string) => {
    const updated = {
      ...formData,
      technicalSkills: formData.technicalSkills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = {
      ...formData,
      technicalSkills: formData.technicalSkills.filter((s) => s.id !== id),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: "exp-" + Date.now(),
      role: "Software Engineer",
      company: "Company Name",
      period: "2024 - Present",
      description: ["Key accomplishment or responsibility."],
    };
    const updated = {
      ...formData,
      experience: [...formData.experience, newExp],
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateExperience = (id: string, field: "role" | "company" | "period", value: string) => {
    const updated = {
      ...formData,
      experience: formData.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateExpBullet = (expId: string, index: number, value: string) => {
    const updated = {
      ...formData,
      experience: formData.experience.map((e) => {
        if (e.id === expId) {
          const newDesc = [...e.description];
          newDesc[index] = value;
          return { ...e, description: newDesc };
        }
        return e;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleAddExpBullet = (expId: string) => {
    const updated = {
      ...formData,
      experience: formData.experience.map((e) => {
        if (e.id === expId) {
          return { ...e, description: [...e.description, "New bullet point"] };
        }
        return e;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteExpBullet = (expId: string, index: number) => {
    const updated = {
      ...formData,
      experience: formData.experience.map((e) => {
        if (e.id === expId) {
          return { ...e, description: e.description.filter((_, i) => i !== index) };
        }
        return e;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = {
      ...formData,
      experience: formData.experience.filter((e) => e.id !== id),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  // Project Handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "Project Title",
      repo: "https://github.com/...",
      tech: "React, TypeScript",
      description: ["Project description or feature."],
    };
    const updated = {
      ...formData,
      projects: [...formData.projects, newProj],
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateProject = (id: string, field: "title" | "repo" | "tech", value: string) => {
    const updated = {
      ...formData,
      projects: formData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateProjBullet = (projId: string, index: number, value: string) => {
    const updated = {
      ...formData,
      projects: formData.projects.map((p) => {
        if (p.id === projId) {
          const newDesc = [...p.description];
          newDesc[index] = value;
          return { ...p, description: newDesc };
        }
        return p;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleAddProjBullet = (projId: string) => {
    const updated = {
      ...formData,
      projects: formData.projects.map((p) => {
        if (p.id === projId) {
          return { ...p, description: [...p.description, "New bullet point"] };
        }
        return p;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteProjBullet = (projId: string, index: number) => {
    const updated = {
      ...formData,
      projects: formData.projects.map((p) => {
        if (p.id === projId) {
          return { ...p, description: p.description.filter((_, i) => i !== index) };
        }
        return p;
      }),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = {
      ...formData,
      projects: formData.projects.filter((p) => p.id !== id),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: "edu-" + Date.now(),
      degree: "Degree Name",
      school: "University / Institute",
      year: "Year",
    };
    const updated = {
      ...formData,
      education: [...formData.education, newEdu],
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleUpdateEducation = (id: string, field: "degree" | "school" | "year", value: string) => {
    const updated = {
      ...formData,
      education: formData.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = {
      ...formData,
      education: formData.education.filter((e) => e.id !== id),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await onImport(file);
      if (success) {
        showNotification("success", "CV data imported successfully!");
      } else {
        showNotification("error", "Invalid JSON format. Import failed.");
      }
    }
  };

  const handleSyncToGitHub = async () => {
    if (!ghToken) {
      showNotification("error", "Please provide a GitHub Personal Access Token.");
      return;
    }
    setIsSyncing(true);
    localStorage.setItem("gh_pat_token", ghToken);
    localStorage.setItem("gh_owner", ghOwner);
    localStorage.setItem("gh_repo", ghRepo);

    const res = await onSyncGitHub(ghToken, ghOwner, ghRepo);
    setIsSyncing(false);
    if (res.success) {
      showNotification("success", res.message);
    } else {
      showNotification("error", res.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd) {
      setPwdMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPwd.length < 4) {
      setPwdMessage({ type: "error", text: "New password must be at least 4 characters." });
      return;
    }
    if (newPwd !== confirmNewPwd) {
      setPwdMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    const isCurrentValid = await verifyPassword(currentPwd);
    if (!isCurrentValid) {
      setPwdMessage({ type: "error", text: "Incorrect current password." });
      return;
    }

    const newHash = await hashPassword(newPwd);
    setStoredPasswordHash(newHash);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmNewPwd("");
    setPwdMessage({ type: "success", text: "Master password successfully updated!" });
    setTimeout(() => setPwdMessage(null), 4000);
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow text-sm">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-bold">CV Admin Control Panel</h2>
              <p className="text-xs text-slate-400">Authenticated Session</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              title="Lock Admin session"
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> Lock & Exit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications Bar */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 flex items-center text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-b border-emerald-200"
                : "bg-rose-50 text-rose-800 border-b border-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
            )}
            {statusMessage.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "personal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "skills"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-4 h-4" /> Technical Skills
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "experience"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Experience
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "projects"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Projects
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "education"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Education
          </button>
          <button
            onClick={() => setActiveTab("sync")}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "sync"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Github className="w-4 h-4" /> Security & Sync
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 text-slate-800">
          
          {/* Tab 1: Personal Info */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.title}
                    onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Professional Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.personalInfo.intro}
                  onChange={(e) => handlePersonalInfoChange("intro", e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location / Address
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.address}
                    onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GitHub Handle / URL
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.github}
                    onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    LinkedIn Handle / URL
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.image}
                    onChange={(e) => handlePersonalInfoChange("image", e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Technical Skills */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">
                  Manage categories and comma-separated technical skills.
                </p>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="space-y-3">
                {formData.technicalSkills.map((skill, index) => (
                  <div key={skill.id || index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row gap-3 items-start md:items-center">
                    <div className="w-full md:w-1/3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                      <input
                        type="text"
                        value={skill.category}
                        onChange={(e) => handleUpdateSkill(skill.id, "category", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-blue-500"
                        placeholder="Frontend, Backend, etc."
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={skill.skills}
                        onChange={(e) => handleUpdateSkill(skill.id, "skills", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-blue-500"
                        placeholder="React, TypeScript, Next.js..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition self-end md:self-center mt-2 md:mt-5"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Experience */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">
                  Add or edit professional work experience and bullet points.
                </p>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={exp.id || index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Experience #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Role / Designation</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleUpdateExperience(exp.id, "period", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                          placeholder="Hybrid | 2024 - Present"
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-600">Bullet Points</label>
                        <button
                          type="button"
                          onClick={() => handleAddExpBullet(exp.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {exp.description.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateExpBullet(exp.id, bIndex, e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteExpBullet(exp.id, bIndex)}
                            className="text-slate-400 hover:text-rose-500 p-1 mt-1 rounded"
                            title="Delete bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Projects */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">
                  Add or edit highlighted projects and research accomplishments.
                </p>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {formData.projects.map((proj, index) => (
                  <div key={proj.id || index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Project #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Repository URL</label>
                        <input
                          type="text"
                          value={proj.repo || ""}
                          onChange={(e) => handleUpdateProject(proj.id, "repo", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Tech Stack</label>
                        <input
                          type="text"
                          value={proj.tech}
                          onChange={(e) => handleUpdateProject(proj.id, "tech", e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                          placeholder="React, Docker, Python"
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-slate-600">Key Features / Bullets</label>
                        <button
                          type="button"
                          onClick={() => handleAddProjBullet(proj.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {proj.description.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex gap-2 items-start">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateProjBullet(proj.id, bIndex, e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteProjBullet(proj.id, bIndex)}
                            className="text-slate-400 hover:text-rose-500 p-1 mt-1 rounded"
                            title="Delete bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Education */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 font-medium">
                  Add degrees, academic programs, and graduation years.
                </p>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                >
                  <Plus className="w-4 h-4" /> Add Degree
                </button>
              </div>

              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div key={edu.id || index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="w-full sm:w-5/12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div className="w-full sm:w-4/12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">University / Institute</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div className="w-full sm:w-2/12">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(edu.id, "year", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition self-end sm:self-center mt-2 sm:mt-5"
                      title="Delete education entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Security & Sync */}
          {activeTab === "sync" && (
            <div className="space-y-6">
              
              {/* Change Master Password Section */}
              <div className="p-5 border border-amber-200 rounded-xl bg-amber-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700" /> Change Master Password
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">
                    SHA-256 Encrypted
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Update the master password used to authenticate and unlock this admin panel.
                </p>

                {pwdMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      pwdMessage.type === "success"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {pwdMessage.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    {pwdMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        placeholder="New password"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmNewPwd}
                        onChange={(e) => setConfirmNewPwd(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Local Storage & Backup Options */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  💾 Local Backup & Restore
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export your CV data as a JSON backup file to keep on your device, or import a previously saved JSON file.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow transition"
                  >
                    <Download className="w-4 h-4" /> Export JSON Backup
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition">
                    <Upload className="w-4 h-4 text-blue-600" /> Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reset all CV details to original default values?")) {
                        onReset();
                        showNotification("success", "Reset to original default values.");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset to Defaults
                  </button>
                </div>
              </div>

              {/* GitHub Repository Cloud Sync */}
              <div className="p-5 border border-blue-200 rounded-xl bg-blue-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-800" /> GitHub Repository Sync (Optional)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                    Direct Cloud Sync
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commit updated data directly to your GitHub repository so changes are permanently stored in version control.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      GitHub Username / Organization
                    </label>
                    <input
                      type="text"
                      value={ghOwner}
                      onChange={(e) => setGhOwner(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="e.g. PramudithaN"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value={ghRepo}
                      onChange={(e) => setGhRepo(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="e.g. pramuditha.cv"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white font-mono"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Needs repo permission to commit changes. Token is stored only in your local browser storage.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleSyncToGitHub}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-bold shadow-md transition"
                  >
                    {isSyncing ? "Committing to GitHub..." : "Commit & Push Changes to GitHub"}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500">
            Changes auto-save locally in real-time.
          </span>
          <button
            onClick={() => {
              showNotification("success", "All changes saved locally!");
              setTimeout(() => onClose(), 600);
            }}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition"
          >
            <Save className="w-4 h-4" /> Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};
