import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Info } from 'lucide-react';

interface BaseCountProps {
  baseCount: {
    A: number;
    T: number;
    G: number;
    C: number;
    Other?: number;
  };
}

const BaseCountAnalysis: React.FC<BaseCountProps> = ({ baseCount }) => {
  const chartData = [
    { name: 'Adenine', short: 'A', count: baseCount.A, color: 'hsl(var(--dna-a))' },
    { name: 'Thymine', short: 'T', count: baseCount.T, color: 'hsl(var(--dna-t))' },
    { name: 'Guanine', short: 'G', count: baseCount.G, color: 'hsl(var(--dna-g))' },
    { name: 'Cytosine', short: 'C', count: baseCount.C, color: 'hsl(var(--dna-c))' },
  ];

  if (baseCount.Other && baseCount.Other > 0) {
    chartData.push({ name: 'Other', short: 'N', count: baseCount.Other, color: '#94a3b8' });
  }

  const totalBases = Object.values(baseCount).reduce((sum, count) => sum + count, 0);
  const gcContent = (((baseCount.G + baseCount.C) / totalBases) * 100).toFixed(1);

  return (
    <Card className="glass-card border-none shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Nucleotide Distribution</CardTitle>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Compositional Analysis</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-primary tracking-tighter">{gcContent}%</span>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">GC Density</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-12 xl:col-span-7 h-[300px] glass rounded-3xl p-6 border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="short"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12, fontWeight: 'bold' }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass p-3 rounded-xl border-border/50 shadow-2xl">
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{data.name}</p>
                          <p className="text-lg font-black" style={{ color: data.color }}>{data.count.toLocaleString()}</p>
                          <p className="text-[10px] font-bold opacity-60">{((data.count / totalBases) * 100).toFixed(2)}% Frequency</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
            {chartData.map((base) => (
              <div key={base.short} className="glass p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: base.color }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{base.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight">{base.count.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">BP</span>
                </div>
                <div className="w-full bg-muted/30 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ backgroundColor: base.color, width: `${(base.count / totalBases) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 glass rounded-2xl border-border/50 border-dashed">
          <div className="flex items-center gap-3">
            <Info className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-muted-foreground">
              Total Genome Length: <span className="text-foreground">{totalBases.toLocaleString()} Nucleotides</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {['A', 'T', 'G', 'C'].map(b => (
                <div key={b} className="text-[8px] font-black px-1.5 py-0.5 rounded bg-muted/50 border border-border/50 uppercase">{b}</div>
              ))}
            </div>
            <span className="text-[10px] font-mono opacity-40">Ready for Downstream Processing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseCountAnalysis;
