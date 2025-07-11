import { createRoot } from 'react-dom/client'

// Apply critical RSVP fix BEFORE any other imports use Supabase
import './utils/fixUpsertIssues'

import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
