import { Link } from "react-router-dom";
import { ArrowRightLeft, DollarSign, Home, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/button";

export default function RentVsBuyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-navy md:text-5xl">Rent vs. Buy Analyzer</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Make the smartest financial decision for your future. Compare the long-term costs and equity building of renting versus buying a home in your target neighborhood.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-4">Assumptions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Property Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input type="number" defaultValue={500000} className="w-full rounded-md border border-border bg-background px-9 py-2 text-sm" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Monthly Rent (Equivalent)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input type="number" defaultValue={2500} className="w-full rounded-md border border-border bg-background px-9 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">Down Payment</label>
                  <input type="text" defaultValue="20%" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">Interest Rate</label>
                  <input type="text" defaultValue="6.5%" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              <Button className="w-full mt-2">Recalculate</Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="bg-navy p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Verdict: Buying is better after Year 6</h2>
              <p className="text-navy-100 mt-2 text-sm opacity-80">Based on a 4% property appreciation rate and 3% rent increase annually.</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Home className="h-5 w-5" />
                    <span className="font-bold">If you buy</span>
                  </div>
                  <p className="text-3xl font-extrabold text-navy">$245k</p>
                  <p className="text-sm text-muted-foreground mt-1">Net equity gained over 10 years</p>
                </div>
                
                <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    <span className="font-bold">If you rent</span>
                  </div>
                  <p className="text-3xl font-extrabold text-navy">-$343k</p>
                  <p className="text-sm text-muted-foreground mt-1">Sunk cost in rent over 10 years</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-navy">Breakdown (Year 10)</h4>
                
                <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Property Value</span>
                  <span className="font-semibold">$740,122</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Remaining Loan</span>
                  <span className="font-semibold text-red-500">-$342,810</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2 text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Total Paid in Rent</span>
                  <span className="font-semibold text-red-500">-$343,912</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
