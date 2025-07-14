import React, { useState } from 'react';
import { AlertCircle, X, MapPin, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VenueChangeNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative mb-6"
      >
        <div className="glass-card border-l-4 border-l-wedding-gold bg-gradient-to-r from-wedding-gold/5 to-transparent">
          <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-wedding-gold" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-wedding-navy mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Important Venue Update
              </h3>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-wedding-navy">Venue changed from The Edwards to Ben Ean</span> due to the original venue going into liquidation in February 2025.
                </p>
                
                <div className="flex items-start gap-2 bg-white/50 rounded-lg p-3 mt-3">
                  <Bus className="w-4 h-4 text-wedding-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-wedding-navy text-xs mb-1">Coach Transport Available</p>
                    <p className="text-xs">We've arranged coach transport to help with the change. Thank you for your understanding!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 hover:bg-wedding-gold/10 rounded-full transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4 text-wedding-navy/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VenueChangeNotice;