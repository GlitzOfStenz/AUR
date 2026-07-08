"use client";

import React, { useState } from "react";
import { Calendar, Award, MapPin, Users, ArrowRight, ArrowLeft, Clock, User, CheckCircle, Loader2 } from "lucide-react";

export default function EventsAndAwards() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "submitting" | "success">("idle");

  const events = [
    {
      id: "ev-1",
      title: "Asia Higher Education Summit 2026",
      date: "August 12-14, 2026",
      location: "Singapore",
      type: "Conference",
      description: "Join leading academic minds and university chancellors to discuss the future of AI in higher education, institutional growth, and global partnerships.",
      detailedDescription: "The Asia Higher Education Summit brings together over 5,000 academic leaders, policymakers, and industry innovators. This three-day event features keynote addresses, interactive panel discussions, and hands-on workshops aimed at reshaping the landscape of tertiary education across the Asian continent. Attendees will explore topics such as sustainable campus operations, digital transformation, and cross-border research initiatives.",
      applicationUrl: "https://example.edu/register/summit-2026",
      speakers: [
        { name: "Dr. Elena Rostova", role: "Vice Chancellor", company: "National Tech University" },
        { name: "Prof. Kenji Sato", role: "Head of AI Research", company: "Tokyo Institute of Technology" }
      ],
      agenda: [
        { time: "09:00 AM", title: "Opening Keynote: The Digital Campus" },
        { time: "11:30 AM", title: "Panel: AI in Admissions" },
        { time: "02:00 PM", title: "Workshop: Building Global Partnerships" }
      ]
    },
    {
      id: "ev-2",
      title: "AUR Awards Gala",
      date: "November 5, 2026",
      location: "Tokyo, Japan",
      type: "Awards",
      description: "Celebrating the most innovative universities and outstanding contributors to research and employability in the Asian region.",
      detailedDescription: "The prestigious AUR Awards Gala is the most anticipated event of the academic calendar, recognizing excellence in teaching, research, and community impact. Nominations are open across 15 categories, including 'Most Innovative Curriculum', 'Excellence in Internationalization', and the 'Lifetime Achievement in Education' award. Join us for an evening of celebration, networking, and inspiration.",
      applicationUrl: "https://example.edu/events/aur-gala",
      speakers: [
        { name: "Sarah Lin", role: "President", company: "AUR Board of Directors" }
      ],
      agenda: [
        { time: "06:00 PM", title: "Red Carpet & Cocktail Reception" },
        { time: "07:30 PM", title: "Gala Dinner" },
        { time: "09:00 PM", title: "Awards Ceremony" }
      ]
    },
    {
      id: "ev-3",
      title: "International Student Mobility Forum",
      date: "January 20, 2027",
      location: "Virtual",
      type: "Webinar",
      description: "A deep dive into cross-border education trends, scholarship opportunities, and the changing landscape of international student mobility.",
      detailedDescription: "As the world becomes increasingly interconnected, understanding the dynamics of student mobility is crucial for modern universities. This virtual forum will analyze the latest data on international student flows, discuss strategies for attracting diverse student bodies, and highlight innovative support structures for international students.",
      applicationUrl: "https://example.edu/webinars/mobility-forum",
      speakers: [
        { name: "Dr. Anil Kumar", role: "Director of International Affairs", company: "Global Education Network" },
        { name: "Maria Gonzalez", role: "Policy Analyst", company: "Institute of International Education" }
      ],
      agenda: [
        { time: "10:00 AM", title: "State of Student Mobility 2027" },
        { time: "11:00 AM", title: "Breakout Rooms: Regional Trends" },
        { time: "12:30 PM", title: "Closing Remarks & Q&A" }
      ]
    }
  ];

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const handleBack = () => {
    setSelectedEventId(null);
    setShowRegistrationForm(false);
    setRegistrationStatus("idle");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationStatus("submitting");
    // Simulate network latency for submission
    setTimeout(() => {
      setRegistrationStatus("success");
    }, 1500);
  };

  return (
    <div className="aur-rankings-shell mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 py-6 sm:py-8 font-sans flex-grow">
      
      {!selectedEvent ? (
        <>
          <div className="aur-rankings-hero mb-6 sm:mb-8 aur-hero-accent flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <span className="aur-caption">Community & Recognition</span>
              <h2 className="aur-section-title text-3xl md:text-4xl leading-tight mt-2">
                Events & Awards
              </h2>
              <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-3 tracking-wide">
                Discover upcoming conferences, summits, and prestigious awards.
              </p>
            </div>
            
            <button
              type="button"
              className="aur-btn-primary mt-2 md:mt-0 inline-flex w-full sm:w-auto items-center justify-center px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all aur-focus-ring"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Submit an Event
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="aur-card p-6 flex flex-col h-full hover:border-[var(--aur-text)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="aur-chip bg-[var(--aur-surface-2)] text-[var(--aur-text-secondary)]">
                    {event.type === "Awards" ? <Award className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                    {event.type}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--aur-text-muted)]">{event.date}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--aur-text)] mb-3">{event.title}</h3>
                <p className="text-sm text-[var(--aur-text-secondary)] mb-6 flex-grow leading-relaxed">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--aur-border)]">
                  <div className="flex items-center text-xs text-[var(--aur-text-muted)]">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {event.location}
                  </div>
                  <button 
                    onClick={() => setSelectedEventId(event.id)}
                    className="aur-btn-ghost inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Learn More <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </button>
          
          <div className="aur-card overflow-hidden">
            <div className="aur-hero-accent p-8 md:p-12 border-b border-[var(--aur-border)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="aur-chip bg-[var(--aur-surface-2)] text-[var(--aur-text)]">
                  {selectedEvent.type === "Awards" ? <Award className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                  {selectedEvent.type}
                </span>
                <span className="text-[12px] font-mono text-[var(--aur-text-muted)] flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> {selectedEvent.date}
                </span>
                <span className="text-[12px] font-mono text-[var(--aur-text-muted)] flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" /> {selectedEvent.location}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--aur-text)] leading-tight mb-6">
                {selectedEvent.title}
              </h2>
              {!showRegistrationForm && registrationStatus !== "success" && (
                <button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="aur-btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center text-center"
                >
                  Register Now
                </button>
              )}
            </div>
            
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {showRegistrationForm ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-600 dark:text-cyber-yellow" /> Complete Your Registration
                    </h3>
                    
                    {registrationStatus === "success" ? (
                      <div className="p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Registration Confirmed</h4>
                        <p className="text-green-700 dark:text-green-400/80 text-sm max-w-md">
                          You have successfully registered for {selectedEvent.title}. A confirmation email has been sent to your inbox.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleRegisterSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Full Name</label>
                            <input required type="text" className="aur-input w-full px-4 py-2.5 text-sm" placeholder="Dr. John Doe" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Email Address</label>
                            <input required type="email" className="aur-input w-full px-4 py-2.5 text-sm" placeholder="j.doe@university.edu" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Job Title</label>
                            <input required type="text" className="aur-input w-full px-4 py-2.5 text-sm" placeholder="e.g. Dean of Admissions" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Organization</label>
                            <input required type="text" className="aur-input w-full px-4 py-2.5 text-sm" placeholder="e.g. Tokyo Institute of Technology" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Special Requirements</label>
                          <textarea className="aur-input w-full px-4 py-2.5 text-sm min-h-[100px] resize-none" placeholder="Dietary needs, accessibility requirements, etc."></textarea>
                        </div>
                        
                        <div className="pt-4 flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setShowRegistrationForm(false)}
                            className="aur-btn-ghost px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={registrationStatus === "submitting"}
                            className="aur-btn-primary px-8 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center"
                          >
                            {registrationStatus === "submitting" ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing</>
                            ) : (
                              "Confirm Registration"
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">About this Event</h3>
                    <p className="text-[var(--aur-text-secondary)] leading-relaxed mb-8">
                      {selectedEvent.detailedDescription}
                    </p>
                    
                    <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">Agenda</h3>
                    <div className="space-y-4">
                      {selectedEvent.agenda.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)]">
                          <div className="text-[11px] font-mono text-[var(--aur-text-muted)] flex-shrink-0 pt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" /> {item.time}
                          </div>
                          <div className="font-medium text-[var(--aur-text)]">
                            {item.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">Featured Speakers</h3>
                <div className="space-y-6">
                  {selectedEvent.speakers.map((speaker, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[var(--aur-text-muted)]" />
                      </div>
                      <div>
                        <div className="font-bold text-[var(--aur-text)]">{speaker.name}</div>
                        <div className="text-xs text-[var(--aur-text-secondary)]">{speaker.role}</div>
                        <div className="text-[10px] text-[var(--aur-text-muted)] font-mono mt-1">{speaker.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

