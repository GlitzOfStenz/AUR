"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Image as ImageIcon, Users, BookOpen, 
  Plus, Trash2, CheckCircle2, Save, LogOut
} from "lucide-react";

type Course = {
  name: string;
  college: string;
  fee: string;
};

export default function RegisterUniversity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    description: "",
    registrationNumber: "",
  });
  const [demographics, setDemographics] = useState({
    students: "",
    staff: "",
  });
  const [colleges, setColleges] = useState<string[]>([""]);
  const [courses, setCourses] = useState<Course[]>([{ name: "", college: "", fee: "" }]);

  // Dummy file state for UI representation
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    // Basic route protection
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  // Handlers for dynamic arrays
  const addCollege = () => setColleges([...colleges, ""]);
  const updateCollege = (index: number, value: string) => {
    const newColleges = [...colleges];
    newColleges[index] = value;
    setColleges(newColleges);
  };
  const removeCollege = (index: number) => {
    if (colleges.length > 1) {
      setColleges(colleges.filter((_, i) => i !== index));
    }
  };

  const addCourse = () => setCourses([...courses, { name: "", college: "", fee: "" }]);
  const updateCourse = (index: number, field: keyof Course, value: string) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };
  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  // Validation
  const isFormValid = () => {
    if (!basicInfo.name || !basicInfo.description || !basicInfo.registrationNumber) return false;
    if (!demographics.students || !demographics.staff) return false;
    if (colleges.some(c => !c.trim())) return false;
    if (courses.some(c => !c.name.trim() || !c.college.trim() || !c.fee.trim())) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">University Registration</h1>
          <p className="text-neutral-400">Add a new university profile to the platform.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors text-sm font-medium border border-neutral-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl mb-8 flex items-center space-x-4"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-300">Registration Successful</h3>
            <p className="text-emerald-500/80 text-sm mt-1">The university profile has been added to the system.</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-neutral-900/80 p-4 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">1. Basic Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">University Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Stanford University"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Registration / Affiliation Code <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={basicInfo.registrationNumber}
                  onChange={(e) => setBasicInfo({...basicInfo, registrationNumber: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. REG-2023-XYZ"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Description <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={4}
                value={basicInfo.description}
                onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                placeholder="Detailed description of the university..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Media Uploads */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-neutral-900/80 p-4 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">2. Media Uploads</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">University Logo</label>
              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center bg-neutral-950/50 hover:bg-neutral-900 transition-colors group cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0]?.name || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-8 h-8 text-neutral-500 group-hover:text-purple-400 transition-colors mb-3" />
                <p className="text-sm text-neutral-400 text-center">
                  {logoFile ? <span className="text-purple-400 font-medium">{logoFile}</span> : "Click or drag logo image here"}
                </p>
                <p className="text-xs text-neutral-600 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">Images / Gallery</label>
              <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center bg-neutral-950/50 hover:bg-neutral-900 transition-colors group cursor-pointer relative">
                <input 
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={(e) => setGalleryCount(e.target.files?.length || 0)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex space-x-[-10px] mb-3">
                  <ImageIcon className="w-8 h-8 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                  <ImageIcon className="w-8 h-8 text-neutral-600 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-sm text-neutral-400 text-center">
                  {galleryCount > 0 ? <span className="text-purple-400 font-medium">{galleryCount} files selected</span> : "Click or drag multiple images"}
                </p>
                <p className="text-xs text-neutral-600 mt-1">Select multiple files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Demographics */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-neutral-900/80 p-4 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">3. Demographics</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Total Number of Students <span className="text-red-400">*</span></label>
              <input
                type="number"
                required
                min="0"
                value={demographics.students}
                onChange={(e) => setDemographics({...demographics, students: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g. 15000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Total Staff / Faculty <span className="text-red-400">*</span></label>
              <input
                type="number"
                required
                min="0"
                value={demographics.staff}
                onChange={(e) => setDemographics({...demographics, staff: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="e.g. 2000"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Dynamic Arrays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Affiliated Colleges */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="bg-neutral-900/80 p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Affiliated Colleges</h2>
              </div>
              <button 
                type="button" 
                onClick={addCollege}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {colleges.map((college, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => updateCollege(index, e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      placeholder={`College Name ${index + 1}`}
                    />
                  </div>
                  {colleges.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCollege(index)}
                      className="mt-1 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Courses & Fees */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="bg-neutral-900/80 p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Courses & Fees</h2>
              </div>
              <button 
                type="button" 
                onClick={addCourse}
                className="text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            <div className="p-6 space-y-6 flex-1">
              {courses.map((course, index) => (
                <div key={index} className="relative bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                  {courses.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCourse(index)}
                      className="absolute top-2 right-2 p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400 ml-1">Course Name</label>
                      <input
                        type="text"
                        required
                        value={course.name}
                        onChange={(e) => updateCourse(index, 'name', e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="e.g. B.Tech Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400 ml-1">College</label>
                        <input
                          type="text"
                          required
                          value={course.college}
                          onChange={(e) => updateCourse(index, 'college', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                          placeholder="College offering it"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-neutral-400 ml-1">Fee (per year)</label>
                        <input
                          type="text"
                          required
                          value={course.fee}
                          onChange={(e) => updateCourse(index, 'fee', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g. $15,000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 flex items-center justify-end border-t border-neutral-800">
          <button
            type="submit"
            disabled={!isFormValid() || submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            <Save className="w-5 h-5" />
            <span>{submitting ? "Saving Profile..." : "Complete Registration"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
