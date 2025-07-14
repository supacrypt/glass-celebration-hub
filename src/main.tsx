import { createRoot } from 'react-dom/client'
import React from 'react'

// Apply critical RSVP fix BEFORE any other imports use Supabase
import './utils/fixUpsertIssues'

// Initialize security features immediately
import { initializeSecurity } from './utils/security'
initializeSecurity()

import App from './App.tsx'
import './index.css'
import SecurityHeaders from './components/security/SecurityHeaders'
import EnvironmentValidator from './components/security/EnvironmentValidator'

createRoot(document.getElementById("root")!).render(
  <EnvironmentValidator strict={false}>
    <SecurityHeaders />
    <App />
  </EnvironmentValidator>
);
