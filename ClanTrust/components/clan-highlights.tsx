'use client';

import { clans } from '@/lib/constants';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function ClanHighlights() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {clans.map((clan, index) => (
        <motion.div
          key={clan.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-xl bg-white p-4 shadow"
        >
          <h3 className="text-xl font-semibold">{clan.label}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Files stored under secure Google Drive folders with delegated admin control.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            <ShieldCheck className="h-3 w-3" />
            Audit ready
          </div>
        </motion.div>
      ))}
    </section>
  );
}
