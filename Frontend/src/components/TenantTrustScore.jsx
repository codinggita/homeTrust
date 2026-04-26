import { CheckCircle2, ShieldCheck, AlertCircle, FileText, Upload } from "lucide-react";
import { Progress } from "@/components/progress";

export default function TenantTrustScore() {
  const score = 850;
  const maxScore = 1000;
  const percentage = (score / maxScore) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="font-serif text-2xl font-bold">Tenant Trust Score</h2>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-navy">{score}</span>
          <span className="text-sm font-semibold text-muted-foreground"> / {maxScore}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-semibold">
          <span className="text-emerald-700">Excellent Candidate</span>
          <span className="text-muted-foreground">Top 15% of renters</span>
        </div>
        <Progress value={percentage} className="h-3 bg-secondary" indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border p-4 bg-secondary/30">
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Verified Elements</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Govt. ID (Aadhaar/PAN)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Employment Letter</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Linkedin Profile</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Phone & Email</li>
          </ul>
        </div>
        
        <div className="rounded-lg border border-amber-200 p-4 bg-amber-50">
          <h3 className="text-sm font-semibold text-amber-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> Boost Your Score
          </h3>
          <ul className="space-y-3 text-sm text-amber-700/80">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Previous Landlord Ref</span>
              <span className="font-bold text-amber-600">+50 pts</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Last 3 Months Bank Statement</span>
              <span className="font-bold text-amber-600">+100 pts</span>
            </li>
          </ul>
          <button className="mt-4 w-full bg-white border border-amber-300 text-amber-700 py-2 rounded-md font-semibold text-sm hover:bg-amber-100 transition-colors">
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  );
}
