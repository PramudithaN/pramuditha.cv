import { defaultCVData } from "../defaultCV";

describe("defaultCV data integrity", () => {
  it("should contain valid personalInfo structure", () => {
    expect(defaultCVData.personalInfo).toBeDefined();
    expect(defaultCVData.personalInfo.name).toBeTruthy();
    expect(defaultCVData.personalInfo.email).toBeTruthy();
    expect(defaultCVData.personalInfo.github).toBeTruthy();
  });

  it("should contain non-empty technicalSkills categories", () => {
    expect(Array.isArray(defaultCVData.technicalSkills)).toBe(true);
    expect(defaultCVData.technicalSkills.length).toBeGreaterThan(0);
    defaultCVData.technicalSkills.forEach((skill) => {
      expect(skill.id).toBeTruthy();
      expect(skill.category).toBeTruthy();
      expect(skill.skills).toBeTruthy();
    });
  });

  it("should contain structured work experience items", () => {
    expect(Array.isArray(defaultCVData.experience)).toBe(true);
    expect(defaultCVData.experience.length).toBeGreaterThan(0);
    defaultCVData.experience.forEach((exp) => {
      expect(exp.id).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.role).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(Array.isArray(exp.description)).toBe(true);
    });
  });

  it("should contain project portfolio items", () => {
    expect(Array.isArray(defaultCVData.projects)).toBe(true);
    expect(defaultCVData.projects.length).toBeGreaterThan(0);
    defaultCVData.projects.forEach((proj) => {
      expect(proj.id).toBeTruthy();
      expect(proj.title).toBeTruthy();
      expect(proj.tech).toBeTruthy();
      expect(Array.isArray(proj.description)).toBe(true);
    });
  });

  it("should contain education history", () => {
    expect(Array.isArray(defaultCVData.education)).toBe(true);
    expect(defaultCVData.education.length).toBeGreaterThan(0);
    defaultCVData.education.forEach((edu) => {
      expect(edu.id).toBeTruthy();
      expect(edu.degree).toBeTruthy();
      expect(edu.school).toBeTruthy();
      expect(edu.year).toBeTruthy();
    });
  });
});
