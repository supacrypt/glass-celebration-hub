import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export interface RSVPValidationRule {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface RSVPFormData {
  selectedEventId: string;
  status: 'attending' | 'not_attending' | 'maybe';
  guestCount: string;
  dietaryRequirements: string;
  customDietaryRequirements: string[];
  message: string;
  [key: string]: any;
}

interface RSVPFormValidationProps {
  formData: RSVPFormData;
  errors: RSVPValidationRule[];
  warnings: RSVPValidationRule[];
  showValidation?: boolean;
}

export const validateRSVPForm = (formData: RSVPFormData): {
  errors: RSVPValidationRule[];
  warnings: RSVPValidationRule[];
  isValid: boolean;
} => {
  const errors: RSVPValidationRule[] = [];
  const warnings: RSVPValidationRule[] = [];

  // Required field validations
  if (!formData.selectedEventId) {
    errors.push({
      field: 'selectedEventId',
      message: 'Please select an event to RSVP for',
      severity: 'error'
    });
  }

  if (!formData.status) {
    errors.push({
      field: 'status',
      message: 'Please select your attendance status',
      severity: 'error'
    });
  }

  // Guest count validation for attending status
  if (formData.status === 'attending') {
    const guestCount = parseInt(formData.guestCount);
    
    if (!formData.guestCount || isNaN(guestCount)) {
      errors.push({
        field: 'guestCount',
        message: 'Please specify the number of guests',
        severity: 'error'
      });
    } else if (guestCount < 1) {
      errors.push({
        field: 'guestCount',
        message: 'Guest count must be at least 1',
        severity: 'error'
      });
    } else if (guestCount > 4) {
      errors.push({
        field: 'guestCount',
        message: 'Maximum 4 guests allowed per RSVP',
        severity: 'error'
      });
    } else if (guestCount > 2) {
      warnings.push({
        field: 'guestCount',
        message: 'Large party size - please confirm accommodation can handle this number',
        severity: 'warning'
      });
    }
  }

  // Dietary requirements validation
  if (formData.status === 'attending') {
    const hasDietary = formData.dietaryRequirements?.trim() || 
                      (formData.customDietaryRequirements?.length > 0);
    
    if (!hasDietary) {
      warnings.push({
        field: 'dietaryRequirements',
        message: 'Consider specifying if you have any dietary requirements or allergies',
        severity: 'warning'
      });
    }

    // Check for potential severe allergies without severity specification
    const potentialAllergies = ['nut', 'shellfish', 'dairy', 'gluten'];
    const dietaryText = (formData.dietaryRequirements || '').toLowerCase();
    
    for (const allergy of potentialAllergies) {
      if (dietaryText.includes(allergy) && !dietaryText.includes('severe') && !dietaryText.includes('mild')) {
        warnings.push({
          field: 'dietaryRequirements',
          message: `Please specify severity level for ${allergy} allergy to ensure proper kitchen preparation`,
          severity: 'warning'
        });
      }
    }
  }

  // Message validation
  if (formData.status === 'not_attending' && !formData.message?.trim()) {
    warnings.push({
      field: 'message',
      message: 'Consider leaving a message for the couple',
      severity: 'info'
    });
  }

  // Email format validation (if email field exists)
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
      severity: 'error'
    });
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  };
};

const RSVPFormValidation: React.FC<RSVPFormValidationProps> = ({
  errors,
  warnings,
  showValidation = true
}) => {
  if (!showValidation || (errors.length === 0 && warnings.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Errors */}
      {errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            <Badge variant="destructive" className="ml-2">
              Error
            </Badge>
          </AlertDescription>
        </Alert>
      ))}

      {/* Warnings */}
      {warnings.filter(w => w.severity === 'warning').map((warning, index) => (
        <Alert key={`warning-${index}`} className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-yellow-800">{warning.message}</span>
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              Warning
            </Badge>
          </AlertDescription>
        </Alert>
      ))}

      {/* Info messages */}
      {warnings.filter(w => w.severity === 'info').map((info, index) => (
        <Alert key={`info-${index}`} className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-blue-800">{info.message}</span>
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              Tip
            </Badge>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default RSVPFormValidation;