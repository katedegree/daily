import { useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  label: string;
  doneLabel: string;
  className: string;
  onClick: () => void | Promise<void>;
}

export function FeedbackButton({ label, doneLabel, className, onClick }: Props) {
  const [done, setDone] = useState(false);

  const handleClick = async () => {
    await onClick();
    setDone(true);
    setTimeout(() => setDone(false), 1000);
  };

  return (
    <button
      className={`relative flex items-center justify-center gap-1.5 overflow-hidden ${className}`}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="done"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={14} strokeWidth={2.5} />
            {doneLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
