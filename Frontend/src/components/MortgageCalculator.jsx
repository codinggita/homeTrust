import { useState } from "react";
import { Calculator, DollarSign, Percent, Clock } from "lucide-react";
import { Slider } from "@/components/slider";

export default function MortgageCalculator({ propertyPrice = 500000 }) {
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const downPaymentAmount = (propertyPrice * downPayment) / 100;
  const principal = propertyPrice - downPaymentAmount;
  const monthlyInterest = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  const monthlyEMI =
    (principal * monthlyInterest * Math.pow(1 + monthlyInterest, numPayments)) /
    (Math.pow(1 + monthlyInterest, numPayments) - 1);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
        <Calculator className="h-5 w-5 text-navy" />
        <h3 className="font-serif text-xl font-semibold">Mortgage & Affordability Calculator</h3>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3"/> Down Payment</span>
              <span className="font-bold text-navy">{downPayment}% (${downPaymentAmount.toLocaleString()})</span>
            </div>
            <Slider
              value={[downPayment]}
              onValueChange={(val) => setDownPayment(val[0])}
              max={100}
              step={1}
              className="py-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Percent className="h-3 w-3"/> Interest Rate</span>
              <span className="font-bold text-navy">{interestRate}%</span>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={(val) => setInterestRate(val[0])}
              max={15}
              step={0.1}
              className="py-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> Loan Term</span>
              <span className="font-bold text-navy">{loanTerm} Years</span>
            </div>
            <Slider
              value={[loanTerm]}
              onValueChange={(val) => setLoanTerm(val[0])}
              min={5}
              max={30}
              step={5}
              className="py-2"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-secondary/50 p-6 text-center ring-1 ring-black/5">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimated Monthly EMI</p>
          <p className="mt-2 text-5xl font-extrabold text-navy">
            ${isNaN(monthlyEMI) || !isFinite(monthlyEMI) ? 0 : Math.round(monthlyEMI).toLocaleString()}
          </p>
          <div className="mt-6 w-full space-y-2 text-sm text-left">
            <div className="flex justify-between border-b border-border pb-1">
              <span className="text-muted-foreground">Principal Loan:</span>
              <span className="font-semibold">${principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-1">
              <span className="text-muted-foreground">Total Interest:</span>
              <span className="font-semibold">${(monthlyEMI * numPayments - principal).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
