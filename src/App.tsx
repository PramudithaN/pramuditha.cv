import React, { useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCVData } from "./hooks/useCVData";
import { AdminPanel } from "./components/AdminPanel";
import { AdminToggle } from "./components/AdminToggle";
import { AdminAuthModal } from "./components/AdminAuthModal";
import { isSessionActive } from "./utils/auth";

function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(isSessionActive());

  const {
    cvData,
    updateCVData,
    resetToDefaults,
    exportJSON,
    importJSON,
    syncToGitHub,
  } = useCVData();

  const { personalInfo, technicalSkills, experience, projects, education } = cvData;

  const handleOpenAdmin = () => {
    if (isSessionActive()) {
      setIsAdminOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthenticated = () => {
    setIsSessionUnlocked(true);
    setIsAuthModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    setIsSessionUnlocked(false);
    setIsAdminOpen(false);
    setIsAuthModalOpen(false);
    // If URL has ?admin, clear it on logout to ensure clean visitor view
    if (window.location.search.includes("admin") || window.location.search.includes("edit")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const element = document.getElementById("resume-content");
      if (element) {
        // Capture positions of interactive links relative to container
        const containerRect = element.getBoundingClientRect();
        const links = Array.from(element.querySelectorAll("a")).map((link) => {
          const rect = link.getBoundingClientRect();
          return {
            url: link.href,
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            w: rect.width,
            h: rect.height,
          };
        });

        html2canvas(element, {
          scale: 3,
          useCORS: true,
          windowWidth: 794,
          windowHeight: 1123,
          scrollY: 0,
          scrollX: 0,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const imgWidth = 210;
          const imgHeight = 297;

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

          // Interactive clickable links overlay
          const pxToMm = imgWidth / 794;

          links.forEach((link) => {
            pdf.link(
              link.x * pxToMm,
              link.y * pxToMm,
              link.w * pxToMm,
              link.h * pxToMm,
              { url: link.url }
            );
          });

          pdf.save(`${personalInfo.name.replace(/\s+/g, "_")}_CV.pdf`);
          setIsDownloading(false);
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 md:py-12 flex flex-col items-center overflow-auto font-sans text-slate-800 relative">
      
      {/* Top Action Bar */}
      <div className="mb-8 flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className={`flex items-center text-white px-8 py-3.5 rounded-full transition-all duration-300 font-semibold shadow-lg ${
            isDownloading
              ? "bg-blue-400 cursor-wait shadow-none"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
          }`}
        >
          {isDownloading ? (
            "Generating PDF..."
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" /> Download CV as PDF
            </>
          )}
        </button>
      </div>

      {/* Main Single-Column CV Container */}
      <div
        id="resume-content"
        className={`bg-white box-border shrink-0 transition-all duration-300 ${
          isDownloading
            ? "overflow-hidden rounded-none shadow-none"
            : "overflow-hidden rounded-2xl shadow-xl border border-slate-200"
        }`}
        style={
          isDownloading
            ? { width: "794px", height: "1123px" }
            : { width: "100%", maxWidth: "850px" }
        }
      >
        <div
          className={`${
            isDownloading ? "px-10 py-8" : "p-8 sm:p-10 md:p-12"
          } h-full flex flex-col`}
        >
          {/* Header Section: Left-aligned info, Right-aligned image */}
          <div
            className={`flex shrink-0 ${
              isDownloading
                ? "mb-4 flex-row justify-between items-center text-left"
                : "mb-8 flex-col md:flex-row md:justify-between items-center md:items-center text-center md:text-left"
            }`}
          >
            <div className="flex-grow">
              <h1
                className={`font-bold text-[#2563eb] tracking-tight uppercase ${
                  isDownloading ? "text-2xl mb-1" : "text-3xl md:text-4xl mb-2"
                }`}
              >
                {personalInfo.name}
              </h1>

              {/* Contact Info Row 1 */}
              <div
                className={`flex flex-wrap justify-center md:justify-start items-center text-black ${
                  isDownloading
                    ? "text-[10px] gap-1.5 mb-2.5"
                    : "text-sm gap-2 sm:gap-3 mb-4"
                }`}
              >
                {personalInfo.address && <span>{personalInfo.address}</span>}
                {personalInfo.address && personalInfo.phone && (
                  <span className="text-slate-400">|</span>
                )}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.phone && personalInfo.email && (
                  <span className="text-slate-400">|</span>
                )}
                {personalInfo.email && (
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    Email
                  </a>
                )}
                {personalInfo.email && personalInfo.github && (
                  <span className="text-slate-400">|</span>
                )}
                {personalInfo.github && (
                  <a
                    href={
                      personalInfo.github.startsWith("http")
                        ? personalInfo.github
                        : `https://${personalInfo.github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    GitHub
                  </a>
                )}
                {personalInfo.github && personalInfo.linkedin && (
                  <span className="text-slate-400">|</span>
                )}
                {personalInfo.linkedin && (
                  <a
                    href={
                      personalInfo.linkedin.startsWith("http")
                        ? personalInfo.linkedin
                        : `https://${personalInfo.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              <h2
                className={`font-bold text-black uppercase tracking-wide ${
                  isDownloading ? "text-[11px]" : "text-base md:text-lg"
                }`}
              >
                {personalInfo.title}
              </h2>
            </div>

            {personalInfo.image && (
              <img
                src={personalInfo.image}
                alt={personalInfo.name}
                className={`rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0 ${
                  isDownloading
                    ? "w-20 h-20 ml-4"
                    : "w-24 h-24 mt-6 md:mt-0 md:w-28 md:h-28 md:ml-6"
                }`}
              />
            )}
          </div>

          {/* Section: Professional Summary */}
          {personalInfo.intro && (
            <section className={isDownloading ? "mb-3.5" : "mb-8"}>
              <div className={isDownloading ? "mb-2" : "mb-4"}>
                <h3
                  className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${
                    isDownloading ? "text-[11px]" : "text-sm md:text-base"
                  }`}
                >
                  Professional Summary
                </h3>
                <div
                  className={`w-full bg-blue-100 ${
                    isDownloading ? "h-[1.5px] mt-1.5" : "h-[2px] mt-2"
                  }`}
                />
              </div>
              <p
                className={`text-black text-justify ${
                  isDownloading
                    ? "text-[10px] leading-snug"
                    : "text-sm md:text-base leading-relaxed"
                }`}
              >
                {personalInfo.intro}
              </p>
            </section>
          )}

          {/* Section: Technical Skills */}
          {technicalSkills && technicalSkills.length > 0 && (
            <section className={isDownloading ? "mb-3.5" : "mb-8"}>
              <div className={isDownloading ? "mb-2" : "mb-4"}>
                <h3
                  className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${
                    isDownloading ? "text-[11px]" : "text-sm md:text-base"
                  }`}
                >
                  Technical Skills
                </h3>
                <div
                  className={`w-full bg-blue-100 ${
                    isDownloading ? "h-[1.5px] mt-1.5" : "h-[2px] mt-2"
                  }`}
                />
              </div>
              <ul className={isDownloading ? "space-y-0.5" : "space-y-2"}>
                {technicalSkills.map((skill, index) => (
                  <li
                    key={skill.id || index}
                    className={`text-black flex items-start ${
                      isDownloading
                        ? "text-[10px] leading-tight"
                        : "text-sm md:text-base"
                    }`}
                  >
                    <span className={`mr-1.5 ${isDownloading ? "mt-[1px]" : "mt-1"}`}>
                      •
                    </span>
                    <span>
                      <strong className="font-bold text-black">
                        {skill.category}:
                      </strong>{" "}
                      {skill.skills}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: Professional Experience */}
          {experience && experience.length > 0 && (
            <section className={isDownloading ? "mb-3.5" : "mb-8"}>
              <div className={isDownloading ? "mb-2" : "mb-4"}>
                <h3
                  className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${
                    isDownloading ? "text-[11px]" : "text-sm md:text-base"
                  }`}
                >
                  Professional Experience
                </h3>
                <div
                  className={`w-full bg-blue-100 ${
                    isDownloading ? "h-[1.5px] mt-1.5" : "h-[2px] mt-2"
                  }`}
                />
              </div>
              <div className={isDownloading ? "space-y-3" : "space-y-6"}>
                {experience.map((exp, index) => (
                  <div key={exp.id || index}>
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-end ${
                        isDownloading ? "mb-1" : "mb-2"
                      }`}
                    >
                      <h4
                        className={`font-bold text-black ${
                          isDownloading ? "text-[11px]" : "text-base md:text-lg"
                        }`}
                      >
                        {exp.company}{" "}
                        <span className="font-normal mx-1 text-slate-400">|</span>{" "}
                        {exp.role}
                      </h4>
                    </div>
                    <p
                      className={`italic text-slate-600 ${
                        isDownloading ? "text-[10px] mb-1" : "text-sm mb-3 font-medium"
                      }`}
                    >
                      {exp.period}
                    </p>
                    <ul className={isDownloading ? "space-y-1" : "space-y-2"}>
                      {exp.description.map((point, i) => (
                        <li
                          key={i}
                          className={`text-black flex items-start text-justify ${
                            isDownloading
                              ? "text-[10px] leading-tight"
                              : "text-sm md:text-base leading-relaxed"
                          }`}
                        >
                          <span
                            className={`mr-1.5 ${
                              isDownloading ? "mt-[1px]" : "mt-1.5 text-[10px]"
                            }`}
                          >
                            •
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Selected Projects & Research */}
          {projects && projects.length > 0 && (
            <section className={isDownloading ? "mb-3.5" : "mb-8"}>
              <div className={isDownloading ? "mb-2" : "mb-4"}>
                <h3
                  className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${
                    isDownloading ? "text-[11px]" : "text-sm md:text-base"
                  }`}
                >
                  Selected Projects & Research
                </h3>
                <div
                  className={`w-full bg-blue-100 ${
                    isDownloading ? "h-[1.5px] mt-1.5" : "h-[2px] mt-2"
                  }`}
                />
              </div>
              <div className={isDownloading ? "space-y-3" : "space-y-6"}>
                {projects.map((project, index) => (
                  <div key={project.id || index}>
                    <h4
                      className={`font-bold text-black ${
                        isDownloading ? "text-[11px] mb-1" : "text-base md:text-lg mb-2"
                      }`}
                    >
                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {project.title}
                        </a>
                      ) : (
                        <span>{project.title}</span>
                      )}
                      <span className="font-normal mx-1 text-slate-400">|</span>
                      <span className="italic font-normal">{project.tech}</span>
                    </h4>
                    <ul className={isDownloading ? "space-y-1" : "space-y-2"}>
                      {project.description.map((point, i) => (
                        <li
                          key={i}
                          className={`text-black flex items-start text-justify ${
                            isDownloading
                              ? "text-[10px] leading-tight"
                              : "text-sm md:text-base leading-relaxed"
                          }`}
                        >
                          <span
                            className={`mr-1.5 ${
                              isDownloading ? "mt-[1px]" : "mt-1.5 text-[10px]"
                            }`}
                          >
                            •
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Education */}
          {education && education.length > 0 && (
            <section>
              <div className={isDownloading ? "mb-1.5" : "mb-4"}>
                <h3
                  className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${
                    isDownloading ? "text-[11px]" : "text-sm md:text-base"
                  }`}
                >
                  Education
                </h3>
                <div
                  className={`w-full bg-blue-100 ${
                    isDownloading ? "h-[1.5px] mt-1.5" : "h-[2px] mt-2"
                  }`}
                />
              </div>
              {education.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start"
                >
                  <div>
                    <h4
                      className={`font-bold text-black ${
                        isDownloading ? "text-[11px]" : "text-base"
                      }`}
                    >
                      {edu.degree}
                    </h4>
                    <p
                      className={`text-black ${
                        isDownloading ? "text-[10px] mt-0.5" : "text-sm mt-1"
                      }`}
                    >
                      {edu.school} <span className="mx-1 text-slate-400">|</span>{" "}
                      {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Floating Admin Toggle Button */}
      <AdminToggle
        onOpen={handleOpenAdmin}
        isDownloading={isDownloading}
        isSessionUnlocked={isSessionUnlocked}
      />

      {/* Master Password Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onLogout={handleLogout}
        cvData={cvData}
        onUpdate={updateCVData}
        onReset={resetToDefaults}
        onExport={exportJSON}
        onImport={importJSON}
        onSyncGitHub={syncToGitHub}
      />
    </div>
  );
}

export default App;
