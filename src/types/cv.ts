export interface PersonalInfo {
  name: string;
  title: string;
  intro: string;
  email: string;
  github: string;
  linkedin: string;
  phone: string;
  address: string;
  image: string;
}

export interface SkillItem {
  id: string;
  category: string;
  skills: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  repo?: string;
  tech: string;
  description: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  technicalSkills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}
