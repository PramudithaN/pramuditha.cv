import React, { useState } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {
  const [isDownloading, setIsDownloading] = useState(false);

  const personalInfo = {
    name: process.env.REACT_APP_NAME || "PRAMUDITHA NADUN",
    title: process.env.REACT_APP_TITLE || "ASSOCIATE SOFTWARE ENGINEER",
    intro: process.env.REACT_APP_INTRO || "Associate Software Engineer with 5 years of combined academic and professional experience building scalable applications, highly interactive frontends, and robust backend systems. Specializing in React, TypeScript, and Spring Boot, with a strong foundation in UI/UX and visual design. Adept at bridging the gap between technical architecture and modern user experience, utilizing CI/CD pipelines to ensure seamless deployments. Proven experience in developing complex, data-driven architectures, distributed asynchronous systems, and predictive modeling algorithms.",
    email: process.env.REACT_APP_EMAIL || "pramudithanadun@gmail.com",
    github: process.env.REACT_APP_GITHUB || "github.com/PramudithaN",
    linkedin: process.env.REACT_APP_LINKEDIN || "linkedin.com/in/pramuditha-nadun-612b1b204",
    phone: process.env.REACT_APP_PHONE || "+94-713-052-556",
    address: process.env.REACT_APP_ADDRESS || "Nugegoda, Sri Lanka",
    image: process.env.REACT_APP_IMAGE_URL || "https://avatars.githubusercontent.com/u/79605208?v=4",
  };

  const technicalSkills = [
    { category: "Frontend", skills: "React, TypeScript, JavaScript, React Hooks & Forms, Redux, Ant Design (AntD), HTML, CSS" },
    { category: "Backend & Databases", skills: "Spring Boot, Java, FastAPI, Python, PostgreSQL, Oracle Forms, Jasper Reports" },
    { category: "DevOps & Infrastructure", skills: "Docker, Git (commands & tagging), Jenkins, ArgoCD, Celery, Redis, AWS S3 / MinIO" },
    { category: "Design & UI/UX", skills: "Figma, Wireframing, Adobe Creative Suite (Photoshop, Illustrator, Premiere Pro, After Effects)" },
    { category: "Data & Analytics", skills: "XGBoost, GRU, ARIMA, Variational Mode Decomposition (VMD), FinBERT" },
  ];

  const experience = [
    {
      role: "Associate Software Engineer (Fusion X Team)",
      company: "LOLC Technologies",
      period: "Hybrid | 2024 - Present",
      description: [
        "Develop and maintain enterprise-scale web applications using React and TypeScript, leveraging Redux for state management and Ant Design for modern, responsive UI components.",
        "Architect and optimize backend functionalities using Spring Boot, ensuring efficient data processing, secure user access control, and precise screen permissions.",
        "Streamline deployment lifecycles across QA, UAT, and Production environments by actively managing and monitoring CI/CD pipelines via Jenkins and ArgoCD.",
        "Bridge technical and design workflows by conceptualizing and refining user interfaces in Figma, directly elevating the overall user experience and application usability.",
      ],
    },
    {
      role: "Trainee Software Engineer (Fusion Team)",
      company: "LOLC Technologies",
      period: "Hybrid | Mar 2022 - Oct 2024",
      description: [
        "Engineered interactive frontend components and responsive layouts, collaborating with cross-functional teams to translate business requirements into functional software solutions.",
        "Maintained and developed backend processes and reporting systems using Java and Oracle Forms.",
        "Designed and generated complex, data-driven dashboards utilizing Jasper Reports to facilitate high-level business decision-making.",
        "Contributed heavily to the UI/UX team, transforming user journeys into actionable Figma wireframes and high-fidelity designs.",
      ],
    },
  ];

  interface Project {
    title: string;
    repo?: string;
    tech: string;
    description: string[];
  }

  const projects: Project[] = [
    {
      title: "11LabsM - Neural Voice Synthesizer & Translator",
      repo: "https://github.com/PramudithaN/11labsM.git",
      tech: "React, FastAPI, Celery, Redis, PostgreSQL, Docker",
      description: [
        "Architected a distributed full-stack platform that simultaneously translates and synthesizes speech into 17+ languages utilizing the ElevenLabs, DeepL, and Google APIs.",
        "Orchestrated asynchronous background task processing using Celery and Redis to handle heavy text-to-speech workloads, providing users with real-time progress tracking.",
        "Engineered a SHA-256 content-addressed caching mechanism and integrated scalable object storage (MinIO/AWS S3) to significantly minimize external API costs and reduce response latency.",
        "Containerized the complete application infrastructure including the API, workers, cache, and database using Docker Compose for streamlined deployment.",
      ],
    },
    {
      title: "Brent Crude Oil Forecasting System",
      repo: "https://github.com/PramudithaN/petrocast-frontend.git",
      tech: "Python, XGBoost, GRU, ARIMA, VMD",
      description: [
        "Engineered a leakage-free ensemble machine learning model to execute a 5-day price prediction horizon for the crude oil market.",
        "Implemented Variational Mode Decomposition (VMD) to analyze and visualize non-linear frequency signals and Intrinsic Mode Functions (IMFs).",
        "Integrated natural language processing via FinBERT, strictly utilizing event-driven, lagged news sentiment to eliminate forward-filling data leakage.",
      ],
    },
  ];

  const education = [
    {
      degree: "BSc (Hons) Software Engineering",
      school: "University of Westminster, UK",
      year: "Feb 2022 - 2026",
    },
  ];

  const handleDownloadPDF = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const element = document.getElementById("resume-content");
      if (element) {
        // First capture the positions of all links relative to the resume-content container
        const containerRect = element.getBoundingClientRect();
        const links = Array.from(element.querySelectorAll('a')).map(link => {
          const rect = link.getBoundingClientRect();
          return {
            url: link.href,
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            w: rect.width,
            h: rect.height
          };
        });

        html2canvas(element, { 
          scale: 3, 
          useCORS: true,
          windowWidth: 794, 
          windowHeight: 1123,
          scrollY: 0,
          scrollX: 0
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          
          const imgWidth = 210; 
          const imgHeight = 297; 
          
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

          // Add interactive links on top of the image
          // Calculate scale factor from pixels to mm
          const pxToMm = imgWidth / 794; // Based on windowWidth used in html2canvas
          
          links.forEach(link => {
            pdf.link(
              link.x * pxToMm, 
              link.y * pxToMm, 
              link.w * pxToMm, 
              link.h * pxToMm, 
              { url: link.url }
            );
          });

          pdf.save("Pramuditha_Nadun_CV.pdf");
          setIsDownloading(false);
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 md:py-12 flex flex-col items-center overflow-auto font-sans text-slate-800">
      
      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className={`mb-8 flex items-center text-white px-8 py-3.5 rounded-full transition-all duration-300 font-semibold shadow-lg ${
          isDownloading 
            ? 'bg-blue-400 cursor-wait shadow-none' 
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95'
        }`}
      >
        {isDownloading ? "Generating PDF..." : <><Download className="w-5 h-5 mr-2" /> Download CV as PDF</>}
      </button>

      {/* Main Single-Column Container */}
      <div 
        id="resume-content" 
        className={`bg-white box-border shrink-0 transition-all duration-300 ${
          isDownloading 
            ? 'overflow-hidden rounded-none shadow-none' 
            : 'overflow-hidden rounded-2xl shadow-xl border border-slate-200'
        }`}
        style={isDownloading ? { width: '794px', height: '1123px' } : { width: '100%', maxWidth: '850px' }}
      >
        <div className={`${isDownloading ? 'px-10 py-8' : 'p-8 sm:p-10 md:p-12'} h-full flex flex-col`}>
          
          {/* Header Section: Left-aligned info, Right-aligned image */}
          <div className={`flex shrink-0 ${isDownloading ? 'mb-4 flex-row justify-between items-center text-left' : 'mb-8 flex-col md:flex-row md:justify-between items-center md:items-center text-center md:text-left'}`}>
            <div className="flex-grow">
              <h1 className={`font-bold text-[#2563eb] tracking-tight uppercase ${isDownloading ? 'text-2xl mb-1' : 'text-3xl md:text-4xl mb-2'}`}>
                {personalInfo.name}
              </h1>
              
              {/* Contact Info Row 1 */}
              <div className={`flex flex-wrap justify-center md:justify-start items-center text-black ${isDownloading ? 'text-[10px] gap-1.5 mb-2.5' : 'text-sm gap-2 sm:gap-3 mb-4'}`}>
                <span>{personalInfo.address}</span>
                <span className="text-slate-400">|</span>
                <span>{personalInfo.phone}</span>
                <span className="text-slate-400">|</span>
                <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  Email
                </a>
                <span className="text-slate-400">|</span>
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  GitHub
                </a>
                <span className="text-slate-400">|</span>
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  LinkedIn
                </a>
              </div>

              <h2 className={`font-bold text-black uppercase tracking-wide ${isDownloading ? 'text-[11px]' : 'text-base md:text-lg'}`}>
                {personalInfo.title}
              </h2>
            </div>

            <img
              src={personalInfo.image}
              alt={personalInfo.name}
              className={`rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0 ${
                isDownloading ? 'w-20 h-20 ml-4' : 'w-24 h-24 mt-6 md:mt-0 md:w-28 md:h-28 md:ml-6'
              }`}
            />
          </div>

          {/* Section: Professional Summary */}
          <section className={isDownloading ? 'mb-3.5' : 'mb-8'}>
            <div className={isDownloading ? 'mb-2' : 'mb-4'}>
              <h3 className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${isDownloading ? 'text-[11px]' : 'text-sm md:text-base'}`}>
                Professional Summary
              </h3>
              <div className={`w-full bg-blue-100 ${isDownloading ? 'h-[1.5px] mt-1.5' : 'h-[2px] mt-2'}`} />
            </div>
            <p className={`text-black text-justify ${isDownloading ? 'text-[10px] leading-snug' : 'text-sm md:text-base leading-relaxed'}`}>
              {personalInfo.intro}
            </p>
          </section>

          {/* Section: Technical Skills */}
          <section className={isDownloading ? 'mb-3.5' : 'mb-8'}>
            <div className={isDownloading ? 'mb-2' : 'mb-4'}>
              <h3 className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${isDownloading ? 'text-[11px]' : 'text-sm md:text-base'}`}>
                Technical Skills
              </h3>
              <div className={`w-full bg-blue-100 ${isDownloading ? 'h-[1.5px] mt-1.5' : 'h-[2px] mt-2'}`} />
            </div>
            <ul className={isDownloading ? 'space-y-0.5' : 'space-y-2'}>
              {technicalSkills.map((skill, index) => (
                <li key={index} className={`text-black flex items-start ${isDownloading ? 'text-[10px] leading-tight' : 'text-sm md:text-base'}`}>
                  <span className={`mr-1.5 ${isDownloading ? 'mt-[1px]' : 'mt-1'}`}>•</span>
                  <span>
                    <strong className="font-bold text-black">{skill.category}:</strong> {skill.skills}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Professional Experience */}
          <section className={isDownloading ? 'mb-3.5' : 'mb-8'}>
            <div className={isDownloading ? 'mb-2' : 'mb-4'}>
              <h3 className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${isDownloading ? 'text-[11px]' : 'text-sm md:text-base'}`}>
                Professional Experience
              </h3>
              <div className={`w-full bg-blue-100 ${isDownloading ? 'h-[1.5px] mt-1.5' : 'h-[2px] mt-2'}`} />
            </div>
            <div className={isDownloading ? 'space-y-3' : 'space-y-6'}>
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-end ${isDownloading ? 'mb-1' : 'mb-2'}`}>
                    <h4 className={`font-bold text-black ${isDownloading ? 'text-[11px]' : 'text-base md:text-lg'}`}>
                      {exp.company} <span className="font-normal mx-1 text-slate-400">|</span> {exp.role}
                    </h4>
                  </div>
                  <p className={`italic text-slate-600 ${isDownloading ? 'text-[10px] mb-1' : 'text-sm mb-3 font-medium'}`}>
                    {exp.period}
                  </p>
                  <ul className={isDownloading ? 'space-y-1' : 'space-y-2'}>
                    {exp.description.map((point, i) => (
                      <li key={i} className={`text-black flex items-start text-justify ${isDownloading ? 'text-[10px] leading-tight' : 'text-sm md:text-base leading-relaxed'}`}>
                        <span className={`mr-1.5 ${isDownloading ? 'mt-[1px]' : 'mt-1.5 text-[10px]'}`}>•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Selected Projects & Research */}
          <section className={isDownloading ? 'mb-3.5' : 'mb-8'}>
            <div className={isDownloading ? 'mb-2' : 'mb-4'}>
              <h3 className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${isDownloading ? 'text-[11px]' : 'text-sm md:text-base'}`}>
                Selected Projects & Research
              </h3>
              <div className={`w-full bg-blue-100 ${isDownloading ? 'h-[1.5px] mt-1.5' : 'h-[2px] mt-2'}`} />
            </div>
            <div className={isDownloading ? 'space-y-3' : 'space-y-6'}>
              {projects.map((project, index) => (
                <div key={index}>
                  <h4 className={`font-bold text-black ${isDownloading ? 'text-[11px] mb-1' : 'text-base md:text-lg mb-2'}`}>
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                      {project.title}
                    </a>
                    <span className="font-normal mx-1 text-slate-400">|</span> 
                    <span className="italic font-normal">{project.tech}</span>
                  </h4>
                  <ul className={isDownloading ? 'space-y-1' : 'space-y-2'}>
                    {project.description.map((point, i) => (
                      <li key={i} className={`text-black flex items-start text-justify ${isDownloading ? 'text-[10px] leading-tight' : 'text-sm md:text-base leading-relaxed'}`}>
                        <span className={`mr-1.5 ${isDownloading ? 'mt-[1px]' : 'mt-1.5 text-[10px]'}`}>•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Education */}
          <section>
            <div className={isDownloading ? 'mb-1.5' : 'mb-4'}>
              <h3 className={`font-bold text-[#2563eb] uppercase tracking-wider leading-none ${isDownloading ? 'text-[11px]' : 'text-sm md:text-base'}`}>
                Education
              </h3>
              <div className={`w-full bg-blue-100 ${isDownloading ? 'h-[1.5px] mt-1.5' : 'h-[2px] mt-2'}`} />
            </div>
            {education.map((edu, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h4 className={`font-bold text-black ${isDownloading ? 'text-[11px]' : 'text-base'}`}>
                    {edu.degree}
                  </h4>
                  <p className={`text-black ${isDownloading ? 'text-[10px] mt-0.5' : 'text-sm mt-1'}`}>
                    {edu.school} <span className="mx-1 text-slate-400">|</span> {edu.year}
                  </p>
                </div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </div>
  );
}

export default App;