"use client";

import React, { useState } from "react";
import { Calendar, Award, Users, ArrowRight, ArrowLeft, Loader2, CheckCircle, Upload } from "lucide-react";
import { API_BASE_URL } from "../lib/universities";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  eligibility_criteria: string | null;
  deadline: string | null;
  status: string;
};

type DirectoryUniversity = { id: string; name: string };

export default function EventsAndAwards() {
  const [universities, setUniversities] = useState<DirectoryUniversity[]>([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/universities/directory`)
      .then((res) => res.json())
      .then(setUniversities)
      .catch(() => setUniversities([]));
  }, []);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/events-awards/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleBack = () => {
    setSelectedEventId(null);
    setShowApplicationForm(false);
    setApplicationStatus("idle");
    setApplicationError(null);
    setSelectedUniversityId("");
    setFiles(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setApplicationStatus("submitting");
    setApplicationError(null);

    const formData = new FormData();
    formData.append("event_id", selectedEvent.id);
    formData.append("university_id", selectedUniversityId);
    if (files) {
      Array.from(files).forEach((f) => formData.append("files", f));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/events-awards/applications`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Failed to submit application");
      }
      setApplicationStatus("success");
    } catch (err: any) {
      setApplicationStatus("error");
      setApplicationError(err.message);
    }
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
                Discover upcoming events and prestigious awards.
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-sm text-[var(--aur-text-muted)]">Loading events...</div>
          )}
          {loadError && (
            <div className="text-sm text-red-600">{loadError}</div>
          )}

          {!loading && !loadError && events.length === 0 && (
            <div className="text-sm text-[var(--aur-text-muted)]">No events or awards are currently listed.</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="aur-card p-6 flex flex-col h-full hover:border-[var(--aur-text)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="aur-chip bg-[var(--aur-surface-2)] text-[var(--aur-text-secondary)]">
                    {event.type === "award" ? <Award className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                    {event.type === "award" ? "Award" : "Event"}
                  </span>
                  {event.deadline && (
                    <span className="text-[10px] font-mono text-[var(--aur-text-muted)]">
                      Deadline: {event.deadline}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[var(--aur-text)] mb-3">{event.title}</h3>
                <p className="text-sm text-[var(--aur-text-secondary)] mb-6 flex-grow leading-relaxed">
                  {event.description}
                </p>

                <div className="flex items-center justify-end mt-auto pt-4 border-t border-[var(--aur-border)]">
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
                  {selectedEvent.type === "award" ? <Award className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                  {selectedEvent.type === "award" ? "Award" : "Event"}
                </span>
                {selectedEvent.deadline && (
                  <span className="text-[12px] font-mono text-[var(--aur-text-muted)] flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" /> Deadline: {selectedEvent.deadline}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--aur-text)] leading-tight mb-6">
                {selectedEvent.title}
              </h2>
              {!showApplicationForm && applicationStatus !== "success" && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="aur-btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center text-center"
                >
                  Apply
                </button>
              )}
            </div>

            <div className="p-8 md:p-12">
              {showApplicationForm ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xl">
                  <h3 className="text-xl font-bold text-[var(--aur-text)] mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600 dark:text-cyber-yellow" /> Submit Application
                  </h3>

                  {applicationStatus === "success" ? (
                    <div className="p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Application Submitted</h4>
                      <p className="text-green-700 dark:text-green-400/80 text-sm max-w-md">
                        Your application for {selectedEvent.title} has been submitted and is now under review.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplySubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Applying University</label>
                        <select
                          required
                          value={selectedUniversityId}
                          onChange={(e) => setSelectedUniversityId(e.target.value)}
                          className="aur-input w-full px-4 py-2.5 text-sm"
                        >
                          <option value="">Select a university</option>
                          {universities.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Supporting Documents (optional)</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setFiles(e.target.files)}
                          className="aur-input w-full px-4 py-2.5 text-sm"
                        />
                      </div>

                      {applicationStatus === "error" && applicationError && (
                        <div className="text-sm text-red-600">{applicationError}</div>
                      )}

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
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in duration-300 max-w-2xl">
                  <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">About this {selectedEvent.type === "award" ? "Award" : "Event"}</h3>
                  <p className="text-[var(--aur-text-secondary)] leading-relaxed mb-8">
                    {selectedEvent.description}
                  </p>

                  {selectedEvent.eligibility_criteria && (
                    <>
                      <h3 className="text-xl font-bold text-[var(--aur-text)] mb-4">Eligibility Criteria</h3>
                      <p className="text-[var(--aur-text-secondary)] leading-relaxed">
                        {selectedEvent.eligibility_criteria}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
