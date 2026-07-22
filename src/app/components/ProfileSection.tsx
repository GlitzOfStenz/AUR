"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, Mail, MapPin, Pencil, UserRound, X } from "lucide-react";
import { API_BASE_URL } from "../lib/universities";
import { useToast } from "./feedback/ToastContext";

type ProfileRole = "Student" | "Faculty";
type Profile = { id: string; email: string; first_name: string; last_name: string; country: string; profile_role: ProfileRole; profile_photo: string | null };
type Draft = { name: string; country: string; profile_role: ProfileRole; profile_photo: string | null };

const fullName = (profile: Profile) => [profile.first_name, profile.last_name === "-" ? "" : profile.last_name].filter(Boolean).join(" ");
const toDraft = (profile: Profile): Draft => ({ name: fullName(profile), country: profile.country, profile_role: profile.profile_role, profile_photo: profile.profile_photo });

async function apiError(response: Response, fallback: string) {
  try { const body = await response.json(); return typeof body.detail === "string" ? body.detail : fallback; }
  catch { return fallback; }
}

export default function ProfileSection() {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const token = sessionStorage.getItem("aur_access_token");
      if (!token) { setError("Please sign in to view your profile."); setLoading(false); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
        if (!response.ok) throw new Error(await apiError(response, "Unable to load your profile."));
        const data = await response.json() as Profile;
        setProfile(data); setDraft(toDraft(data));
      } catch (reason) {
        if ((reason as Error).name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load your profile.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, []);

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || !draft) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setErrors((value) => ({ ...value, photo: "Choose a JPEG, PNG, or WebP image." }));
    if (file.size > 2 * 1024 * 1024) return setErrors((value) => ({ ...value, photo: "Photo must be smaller than 2 MB." }));
    const reader = new FileReader();
    reader.onload = () => { setDraft((value) => value ? { ...value, profile_photo: String(reader.result) } : value); setErrors((value) => ({ ...value, photo: "" })); };
    reader.onerror = () => setErrors((value) => ({ ...value, photo: "Unable to read this image." }));
    reader.readAsDataURL(file);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const nextErrors: Record<string, string> = {};
    if (!draft.name.trim()) nextErrors.name = "Name is required.";
    if (!draft.country.trim()) nextErrors.country = "Country is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const token = sessionStorage.getItem("aur_access_token");
    if (!token) return setError("Your session has expired. Please sign in again.");
    setSaving(true); setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      if (!response.ok) throw new Error(await apiError(response, "Unable to save your changes."));
      const updated = await response.json() as Profile;
      setProfile(updated); setDraft(toDraft(updated)); setEditing(false);
      window.dispatchEvent(new Event("aur-profile-change"));
      showToast("Profile updated successfully.", "success");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save your changes."); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="flex min-h-[55vh] items-center justify-center text-[var(--aur-text-muted)]"><Loader2 className="mr-3 h-5 w-5 animate-spin" />Loading your profile…</div>;
  if (!profile || !draft) return <div role="alert" className="aur-card mx-auto mt-12 max-w-xl p-6 text-sm text-red-700">{error ?? "Profile unavailable."}</div>;

  const photo = editing ? draft.profile_photo : profile.profile_photo;
  const initials = `${profile.first_name[0] ?? ""}${profile.last_name !== "-" ? profile.last_name[0] ?? "" : ""}`.toUpperCase();

  return <section className="mx-auto w-full max-w-5xl pb-12" aria-labelledby="profile-title">
    <div className="mb-6"><p className="aur-caption">Account</p><h1 id="profile-title" className="aur-section-title mt-2 text-3xl sm:text-4xl">My Profile</h1><p className="mt-2 text-sm text-[var(--aur-text-muted)]">Manage your personal information and how you appear across AUR.</p></div>
    <form onSubmit={save} className="aur-card overflow-hidden">
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#d946ef] via-[#7e22ce] to-[#1e3a8a] sm:h-36">
        <div className="absolute right-6 top-5 h-3 w-3 rotate-45 bg-[#FBBF24] shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
        <div className="absolute bottom-5 right-6 flex flex-col gap-1.5 opacity-90"><span className="h-0.5 w-12 bg-[#FBBF24]" /><span className="h-0.5 w-12 bg-[#FBBF24]" /><span className="h-0.5 w-12 bg-[#FBBF24]" /></div>
      </div>
      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[#FBBF24] bg-[#1e3a8a] shadow-lg ring-4 ring-[var(--aur-surface)] sm:h-32 sm:w-32">
            {photo ? <Image src={photo} alt={`${fullName(profile)} profile`} fill unoptimized className="object-cover" /> : <span className="flex h-full items-center justify-center text-3xl font-bold text-white">{initials}</span>}
            {editing && <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/65 py-2 text-[11px] font-semibold text-white"><Camera className="h-3.5 w-3.5" />Change</button>}
          </div>
          {!editing && <button type="button" onClick={() => { setDraft(toDraft(profile)); setErrors({}); setError(null); setEditing(true); }} className="inline-flex items-center justify-center gap-2 bg-[#7e22ce] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#6b21a8]"><Pencil className="h-4 w-4" />Edit Profile</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} className="sr-only" aria-label="Upload profile photo" />
        {errors.photo && <p className="mt-2 text-xs text-red-600">{errors.photo}</p>}
        {error && <div role="alert" className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field icon={UserRound} label="Name" error={errors.name}>{editing ? <input className="aur-input" value={draft.name} maxLength={100} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} /> : <Value>{fullName(profile)}</Value>}</Field>
          <Field icon={Mail} label="Email"><Value>{profile.email}</Value>{editing && <p className="mt-1 text-[11px] text-[var(--aur-text-muted)]">Email cannot be changed.</p>}</Field>
          <Field icon={MapPin} label="Country" error={errors.country}>{editing ? <input className="aur-input" value={draft.country} maxLength={100} required placeholder="Enter your country" onChange={(e) => setDraft({ ...draft, country: e.target.value })} /> : <Value>{profile.country || "Not provided"}</Value>}</Field>
          <Field icon={UserRound} label="Role">{editing ? <select className="aur-input" value={draft.profile_role} required onChange={(e) => setDraft({ ...draft, profile_role: e.target.value as ProfileRole })}><option>Student</option><option>Faculty</option></select> : <span className="inline-flex rounded-full bg-[#A855F7]/10 px-3 py-1 text-xs font-bold text-[#7e22ce] ring-1 ring-[#A855F7]/20">{profile.profile_role}</span>}</Field>
        </div>
        {editing && <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--aur-border)] pt-6 sm:flex-row sm:justify-end">
          <button type="button" disabled={saving} onClick={() => { setDraft(toDraft(profile)); setErrors({}); setError(null); setEditing(false); }} className="inline-flex items-center justify-center gap-2 border border-[var(--aur-border-strong)] px-5 py-2.5 text-xs font-semibold text-[var(--aur-text)] hover:bg-[var(--aur-hover)]"><X className="h-4 w-4" />Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7e22ce] to-[#1e3a8a] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:from-[#6b21a8] hover:to-[#172e70] disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? "Saving…" : "Save Changes"}</button>
        </div>}
      </div>
    </form>
  </section>;
}

function Field({ icon: Icon, label, error, children }: { icon: typeof UserRound; label: string; error?: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)] p-4"><div className="mb-2 flex items-center gap-2 text-[var(--aur-text-muted)]"><Icon className="h-4 w-4" /><span className="aur-caption">{label}</span></div>{children}{error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}</div>;
}
function Value({ children }: { children: React.ReactNode }) { return <p className="break-words text-sm font-semibold text-[var(--aur-text)]">{children}</p>; }
