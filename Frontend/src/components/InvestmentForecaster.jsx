import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function InvestmentForecaster({ baseValue = 500000 }) {
  const [appreciationRate, setAppreciationRate] = useState(4.5);

  const data = Array.from({ length: 11 }).map((_, year) => {
    return {
      year: new Date().getFullYear() + year,
      value: Math.round(baseValue * Math.pow(1 + appreciationRate / 100, year)),
    };
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <h3 className="font-serif text-xl font-semibold">10-Year Value Forecaster</h3>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-md text-emerald-700 font-semibold text-sm">
          <span>Est. Growth:</span>
          <span>{appreciationRate}% / yr</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(val) => `$${(val / 1000)}k`}
              dx={-10}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, "Estimated Value"]}
              labelStyle={{ color: '#111827', fontWeight: 'bold' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Adjust expected appreciation rate:</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setAppreciationRate(Math.max(1, appreciationRate - 0.5))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold hover:bg-secondary/80">-</button>
          <span className="font-bold w-12 text-center">{appreciationRate}%</span>
          <button onClick={() => setAppreciationRate(Math.min(15, appreciationRate + 0.5))} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold hover:bg-secondary/80">+</button>
        </div>
      </div>
    </div>
  );
}
