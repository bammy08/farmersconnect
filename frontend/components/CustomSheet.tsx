import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Close icon from lucide-react

interface CustomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string; // Allow dynamic width for larger screens
}

const CustomSheet = ({
  isOpen,
  onClose,
  children,
}: // width = '50%',
CustomSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Close when clicking outside
          />

          {/* Sheet Container */}
          <motion.div
            className="fixed right-0 top-0 h-full bg-white shadow-lg z-50 overflow-y-auto w-full sm:w-full md:w-[50%] max-w-full px-4 sm:px-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            {/* Sheet Content */}
            <div className="mt-12 w-full">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomSheet;
