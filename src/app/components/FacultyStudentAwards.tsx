"use client";

import React, { useState } from "react";
import { Award, Users, BookOpen, Star, ArrowRight, ArrowLeft, CheckCircle, Loader2, Trophy, GraduationCap } from "lucide-react";
import { useUniversityData } from "./data/UniversityDataProvider";
import { API_BASE_URL } from "../lib/universities";

export default function FacultyStudentAwards() {
  const [activeTab, setActiveTab] = useState<"faculty" | "student">("faculty");
  const [selectedAwardId, setSelectedAwardId] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitting" | "success">("idle");
  const { universities } = useUniversityData();
  const isLoggedIn = typeof window !== "undefined" && sessionStorage.getItem("aur_access_token");

  const [formData, setFormData] = useState({
    nomineeName: "",
    nomineeEmail: "",
    department: "",
    universityId: "",
    justification: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const facultyAwards = [
    {
      id: "fa-1",
      title: "Excellence in Research Award",
      category: "Research",
      deadline: "October 15, 2026",
      description: "Recognizing outstanding contributions to academic research, publications, and scientific discovery.",
      eligibility: [
        "Full-time faculty member at a recognized university for at least 3 years.",
        "Must have published at least 2 peer-reviewed articles in the last 12 months.",
        "Demonstrated impact on the academic community."
      ],
      prize: "$10,000 Research Grant"
    },
    {
      id: "fa-2",
      title: "Innovative Teaching Award",
      category: "Teaching",
      deadline: "November 1, 2026",
      description: "Honoring educators who employ creative, effective, and inclusive pedagogies in their classrooms.",
      eligibility: [
        "Currently teaching undergraduate or postgraduate courses.",
        "Evidence of innovative teaching methodologies (e.g., tech integration, flipped classrooms).",
        "Strong student evaluation scores."
      ],
      prize: "$5,000 Cash Prize & Certificate"
    },
    {
      id: "fa-3",
      title: "Lifetime Achievement in Academia",
      category: "Lifetime",
      deadline: "December 30, 2026",
      description: "A prestigious award for a career dedicated to advancing higher education and mentoring future leaders.",
      eligibility: [
        "Minimum 25 years of service in higher education.",
        "Significant leadership roles (e.g., Dean, Provost, or prolific researcher).",
        "Record of mentoring successful students and junior faculty."
      ],
      prize: "Honorary Plaque & Gala Recognition"
    }
  ];

  const studentAwards = [
    {
      id: "sa-1",
      title: "Emerging Scholar Award",
      category: "Academic",
      deadline: "September 20, 2026",
      description: "Awarded to an undergraduate student showing exceptional promise in their field of study.",
      eligibility: [
        "Currently enrolled as a full-time undergraduate student.",
        "Minimum GPA of 3.8/4.0 (or equivalent).",
        "Letter of recommendation from a department head."
      ],
      prize: "Full Tuition Scholarship for 1 Year"
    },
    {
      id: "sa-2",
      title: "Student Leadership & Impact Award",
      category: "Leadership",
      deadline: "October 5, 2026",
      description: "Celebrating students who have made a significant positive impact on their campus or local community.",
      eligibility: [
        "Demonstrated leadership in a student organization or community project.",
        "Good academic standing.",
        "Impact report or portfolio submission."
      ],
      prize: "$2,000 Cash Prize & Mentorship Program"
    }
  ];

  const winners = [
    {
      id: "w-1",
      name: "Dr. Kenji Sato",
      role: "Head of AI Research",
      institution: "Tokyo Institute of Technology",
      award: "Excellence in Research Award 2025",
      type: "faculty",
      image: "KS"
    },
    {
      id: "w-2",
      name: "Prof. Elena Rostova",
      role: "Professor of Literature",
      institution: "National Tech University",
      award: "Innovative Teaching Award 2025",
      type: "faculty",
      image: "ER"
    },
    {
      id: "w-3",
      name: "Arjun Mehta",
      role: "Computer Science Undergraduate",
      institution: "Indian Institute of Science",
      award: "Emerging Scholar Award 2025",
      type: "student",
      image: "AM"
    },
    {
      id: "w-4",
      name: "Sarah Lin",
      role: "Student Body President",
      institution: "National University of Singapore",
      award: "Student Leadership & Impact Award 2025",
      type: "student",
      image: "SL"
    }
  ];

  const currentAwards = activeTab === "faculty" ? facultyAwards : studentAwards;
  const currentWinners = winners.filter(w => w.type === activeTab);
  const selectedAward = [...facultyAwards, ...studentAwards].find(a => a.id === selectedAwardId);

  const handleBack = () => {
    setSelectedAwardId(null);
    setShowApplicationForm(false);
    setApplicationStatus("idle");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setApplicationStatus("submitting");

    const token = sessionStorage.getItem("aur_access_token");
    if (!token) {
      setSubmitError("You must be logged in to submit a nomination.");
      setApplicationStatus("idle");
      return;
    }

    const body = new FormData();
    body.append("nominee_name", formData.nomineeName);
    body.append("nominee_email", formData.nomineeEmail);
    body.append("category", activeTab === "faculty" ? "Faculty" : "Student");
    body.append("department", formData.department);
    body.append("university_id", formData.universityId);
    body.append("justification", formData.justification);
    files.forEach((f) => body.append("files", f));

    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty-student-awards/nominate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Submission failed. Please try again.");
      }

      setApplicationStatus("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setApplicationStatus("idle");
    }
  };

  return (
    <div className="aur-rankings-shell mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 py-6 sm:py-8 font-sans flex-grow">
      
      {!selectedAward ? (
        <>
          <div className="aur-rankings-hero mb-6 sm:mb-8 aur-hero-accent flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <span className="aur-caption">Recognition & Grants</span>
              <h2 className="aur-section-title text-3xl md:text-4xl leading-tight mt-2 flex items-center gap-3">
                Faculty & Student Awards <Trophy className="h-8 w-8 text-amber-500" />
              </h2>
              <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-3 tracking-wide max-w-2xl">
                Celebrate academic excellence. Apply for prestigious awards, research grants, and scholarships designed to recognize outstanding contributions from both faculty and students.
              </p>
            </div>
          </div>

          <div className="mb-8 flex border-b border-[var(--aur-border)]">
            <button
              onClick={() => setActiveTab("faculty")}
              className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "faculty" 
                  ? "border-[var(--aur-text)] text-[var(--aur-text)]" 
                  : "border-transparent text-[var(--aur-text-muted)] hover:text-[var(--aur-text-secondary)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Faculty Awards
              </div>
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "student" 
                  ? "border-[var(--aur-text)] text-[var(--aur-text)]" 
                  : "border-transparent text-[var(--aur-text-muted)] hover:text-[var(--aur-text-secondary)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Student Awards
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {currentAwards.map((award) => (
              <div key={award.id} className="aur-card p-6 flex flex-col h-full hover:border-[var(--aur-text)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="aur-chip bg-[var(--aur-surface-2)] text-[var(--aur-text-secondary)]">
                    <Star className="w-3 h-3 mr-1" />
                    {award.category}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--aur-text-muted)]">Deadline: {award.deadline}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--aur-text)] mb-3">{award.title}</h3>
                <p className="text-sm text-[var(--aur-text-secondary)] mb-6 flex-grow leading-relaxed">
                  {award.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-[var(--aur-border)] flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-500">
                    {award.prize}
                  </div>
                  <button 
                    onClick={() => setSelectedAwardId(award.id)}
                    className="aur-btn-ghost inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 mb-8 animate-in fade-in duration-500 delay-150">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="text-2xl font-bold text-[var(--aur-text)]">
                {activeTab === "faculty" ? "Recent Faculty Winners" : "Recent Student Winners"}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentWinners.map((winner) => (
                <div key={winner.id} className="aur-card p-6 flex flex-col items-center text-center hover:border-amber-500/50 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 border-2 border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-2xl mb-4 shadow-sm">
                    {winner.image}
                  </div>
                  <h4 className="font-bold text-[var(--aur-text)] text-lg mb-1">{winner.name}</h4>
                  <p className="text-xs text-[var(--aur-text-secondary)] font-medium mb-3">{winner.role}</p>
                  <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mb-4 px-2">{winner.institution}</p>
                  <div className="mt-auto pt-4 border-t border-[var(--aur-border)] w-full">
                    <span className="inline-flex items-center text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                      <Star className="w-3 h-3 mr-1.5" />
                      {winner.award}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Awards
          </button>
          
          <div className="aur-card overflow-hidden">
            <div className="aur-hero-accent p-8 md:p-12 border-b border-[var(--aur-border)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="aur-chip bg-[var(--aur-surface-2)] text-[var(--aur-text)]">
                  {activeTab === "faculty" ? <BookOpen className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                  {activeTab === "faculty" ? "Faculty Award" : "Student Award"}
                </span>
                <span className="text-[12px] font-mono text-[var(--aur-text-muted)] flex items-center">
                   Deadline: {selectedAward.deadline}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--aur-text)] leading-tight mb-4">
                {selectedAward.title}
              </h2>
              <div className="inline-flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-lg mb-6 border border-amber-200 dark:border-amber-800/30">
                Prize: {selectedAward.prize}
              </div>
              
              {!showApplicationForm && applicationStatus !== "success" && (
                <div className="mt-2">
                  {isLoggedIn ? (
                    <button 
                      onClick={() => setShowApplicationForm(true)}
                      className="aur-btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center text-center"
                    >
                      Apply for this Award
                    </button>
                  ) : (
                    <p className="text-sm text-[var(--aur-text-muted)]">
                      Please <span className="font-bold text-[var(--aur-text)]">log in</span> to submit a nomination.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {showApplicationForm ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-6 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-600 dark:text-cyber-yellow" /> Award Application Form
                    </h3>
                    
                    {applicationStatus === "success" ? (
                      <div className="p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Application Submitted!</h4>
                        <p className="text-green-700 dark:text-green-400/80 text-sm max-w-md">
                          Your application for the <strong>{selectedAward.title}</strong> has been received and is now under review. You can track the status in your dashboard.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleApplySubmit} className="space-y-5">
                        {submitError && (
                          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-sm text-red-700 dark:text-red-400">
                            {submitError}
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Full Name</label>
                            <input
                              required
                              type="text"
                              value={formData.nomineeName}
                              onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                              className="aur-input w-full px-4 py-2.5 text-sm"
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Email Address</label>
                            <input
                              required
                              type="email"
                              value={formData.nomineeEmail}
                              onChange={(e) => setFormData({ ...formData, nomineeEmail: e.target.value })}
                              className="aur-input w-full px-4 py-2.5 text-sm"
                              placeholder="university email"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                              {activeTab === "faculty" ? "Department / Faculty" : "Major / Program"}
                            </label>
                            <input
                              required
                              type="text"
                              value={formData.department}
                              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                              className="aur-input w-full px-4 py-2.5 text-sm"
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Institution</label>
                            <select
                              required
                              value={formData.universityId}
                              onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                              className="aur-input w-full px-4 py-2.5 text-sm"
                            >
                              <option value="">Select your university</option>
                              {universities.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Statement of Purpose / Justification</label>
                          <textarea
                            required
                            value={formData.justification}
                            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                            className="aur-input w-full px-4 py-2.5 text-sm min-h-[150px] resize-none"
                            placeholder="Explain why you meet the criteria for this award..."
                          ></textarea>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Supporting Documents</label>
                          <div className="border-2 border-dashed border-[var(--aur-border)] rounded-xl p-6 text-center bg-[var(--aur-surface-2)]">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
                              className="w-full text-sm"
                            />
                            <p className="text-xs text-[var(--aur-text-muted)] mt-2">PDF, DOCX up to 10MB (CV, Portfolio, Recommendations)</p>
                            {files.length > 0 && (
                              <p className="text-xs text-[var(--aur-text)] mt-2 font-medium">{files.length} file(s) selected</p>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setShowApplicationForm(false)}
                            className="aur-btn-ghost px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={applicationStatus === "submitting"}
                            className="aur-btn-primary px-8 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center"
                          >
                            {applicationStatus === "submitting" ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                            ) : (
                              "Submit Application"
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">About this Award</h3>
                    <p className="text-[var(--aur-text-secondary)] leading-relaxed mb-8">
                      {selectedAward.description}
                    </p>
                    
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">Eligibility Criteria</h3>
                    <ul className="space-y-3">
                      {selectedAward.eligibility.map((criterion, idx) => (
                        <li key={idx} className="flex gap-3 text-[var(--aur-text-secondary)]">
                          <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">Important Information</h3>
                <div className="space-y-4 p-5 rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)]">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] mb-1">Status</div>
                    <div className="font-medium text-[var(--aur-text)] flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span> Accepting Applications
                    </div>
                  </div>
                  <div className="border-t border-[var(--aur-border)] pt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] mb-1">Review Process</div>
                    <div className="text-sm text-[var(--aur-text-secondary)] leading-relaxed">
                       Applications will be reviewed by a panel of 5 independent judges. Shortlisted candidates may be called for an interview.
                    </div>
                  </div>
                   <div className="border-t border-[var(--aur-border)] pt-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] mb-1">Winner Announcement</div>
                    <div className="text-sm text-[var(--aur-text-secondary)] leading-relaxed">
                       Winners will be announced at the Annual AUR Awards Gala.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}