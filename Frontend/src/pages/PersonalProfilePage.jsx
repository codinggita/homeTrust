import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle2, ShieldAlert, Building, User, Mail, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { useAuthStore } from "@/stores";

export default function PersonalProfilePage() {
  const { name, email } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: name || "Parth",
    email: email || "parth@example.com",
    phone: "+91 98765 43210",
    dob: "1998-05-15",
    company: "Google India",
    role: "Software Engineer",
    salary: "₹15L - ₹20L",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <Link
        to="/profile/settings"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Settings
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-navy">Personal Information</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your personal details, employment information, and verified documents to boost your Tenant Trust Score.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column - Avatar & Quick Info */}
        <div className="space-y-6 md:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg mb-4">
              <AvatarFallback className="bg-navy text-gold text-3xl font-bold">
                {formData.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="mb-2">
              <Upload className="h-4 w-4 mr-2" /> Change Photo
            </Button>
            <div className="w-full mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Identity Verified</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-800">Missing Documents</h3>
            </div>
            <p className="text-xs text-amber-700/80 mb-4">
              Upload your latest salary slip to increase your trust score by 50 points and stand out to landlords.
            </p>
            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              Upload Now
            </Button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6 md:col-span-2">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-navy" /> Basic Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-navy" /> Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-navy" /> Employment Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-foreground">Annual Salary Bracket</label>
                <select
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  <option value="Below ₹5L">Below ₹5L</option>
                  <option value="₹5L - ₹10L">₹5L - ₹10L</option>
                  <option value="₹10L - ₹15L">₹10L - ₹15L</option>
                  <option value="₹15L - ₹20L">₹15L - ₹20L</option>
                  <option value="Above ₹20L">Above ₹20L</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-navy text-white hover:bg-navy/90 px-8">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
