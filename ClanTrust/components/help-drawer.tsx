'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from './ui/input';

export function HelpDrawer() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="relative">
      <Button variant="ghost" onClick={toggle}>
        Help & Support
      </Button>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg"
          >
            <h3 className="text-base font-semibold">Need help?</h3>
            <p className="mt-1 text-slate-600">
              Reach out to our paralegal desk or request a callback.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-slate-600">
              <li>How to upload and sign documents</li>
              <li>Security and privacy FAQs</li>
              <li>Contact WhatsApp: +256 700 000000</li>
            </ul>
            <form className="mt-3 flex flex-col gap-2">
              <Input placeholder="Phone number for callback" />
              <Button type="submit">Request callback</Button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
