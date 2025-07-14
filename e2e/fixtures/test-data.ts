export const testUsers = {
  admin: {
    email: 'admin@weddingsite.test',
    password: 'AdminPassword123!',
    role: 'admin'
  },
  guest: {
    email: 'guest@weddingsite.test',
    password: 'GuestPassword123!',
    role: 'guest'
  },
  newUser: {
    email: `new-user-${Date.now()}@weddingsite.test`,
    password: 'NewUserPassword123!',
    role: 'guest'
  }
};

export const testGuests = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    attending: true,
    dietary: 'No restrictions',
    plusOne: 'Jane Smith'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    attending: true,
    dietary: 'Vegetarian',
    plusOne: null
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    attending: false,
    dietary: null,
    plusOne: null
  }
];

export const testRSVPData = {
  positive: {
    attending: true,
    name: 'E2E Test Guest',
    email: 'e2e.guest@testing.com',
    dietary: 'No allergies',
    additionalGuests: 1,
    plusOneName: 'E2E Plus One',
    specialRequests: 'Window seat please'
  },
  negative: {
    attending: false,
    name: 'E2E Declining Guest',
    email: 'e2e.declining@testing.com',
    reason: 'Prior commitment'
  },
  invalid: {
    attending: true,
    name: '',
    email: 'invalid-email',
    dietary: ''
  }
};

export const testMessages = [
  {
    content: 'Hello from E2E test! 👋',
    type: 'text'
  },
  {
    content: 'This is a longer message to test how the chat handles extended content. It should wrap properly and maintain good readability.',
    type: 'text'
  },
  {
    content: 'Testing emoji support! 🎉🥳💒👰🤵💕',
    type: 'text'
  }
];

export const testAccommodation = {
  hotel: {
    name: 'Grand Wedding Hotel',
    address: '123 Wedding Street, Love City',
    phone: '+1 (555) 123-4567',
    website: 'https://grandweddinghotel.com',
    rating: 4.5,
    priceRange: '$150-250/night'
  },
  bnb: {
    name: 'Cozy Wedding B&B',
    address: '456 Romance Avenue, Love City',
    phone: '+1 (555) 234-5678',
    website: 'https://cozyweddingbnb.com',
    rating: 4.2,
    priceRange: '$80-120/night'
  }
};

export const testTransport = {
  bus: {
    departure: '2:00 PM',
    pickup: 'City Center Bus Station',
    arrival: '3:30 PM',
    dropoff: 'Wedding Venue',
    seats: 50,
    price: 'Free'
  },
  carpool: {
    driver: 'John Smith',
    seats: 3,
    departure: '2:15 PM',
    pickup: 'Shopping Mall Parking Lot',
    contact: 'john.smith@example.com'
  }
};

export const testVenues = {
  ceremony: {
    name: 'Beautiful Garden Chapel',
    address: '789 Garden Lane, Love City',
    time: '4:00 PM',
    duration: '45 minutes',
    capacity: 150
  },
  reception: {
    name: 'Elegant Ballroom',
    address: '321 Celebration Drive, Love City',
    time: '6:00 PM',
    duration: '5 hours',
    capacity: 200
  }
};

export const testEvents = [
  {
    name: 'Wedding Ceremony',
    date: '2024-06-15',
    time: '16:00',
    location: 'Beautiful Garden Chapel',
    description: 'The main wedding ceremony'
  },
  {
    name: 'Cocktail Hour',
    date: '2024-06-15',
    time: '17:00',
    location: 'Garden Terrace',
    description: 'Drinks and appetizers before dinner'
  },
  {
    name: 'Reception Dinner',
    date: '2024-06-15',
    time: '18:00',
    location: 'Elegant Ballroom',
    description: 'Dinner, dancing, and celebration'
  }
];

export const testFAQ = [
  {
    category: 'General',
    question: 'What time does the ceremony start?',
    answer: 'The ceremony begins at 4:00 PM sharp. Please arrive 15 minutes early.'
  },
  {
    category: 'Accommodation',
    question: 'Are there room blocks at nearby hotels?',
    answer: 'Yes, we have reserved blocks at the Grand Wedding Hotel and Cozy Wedding B&B.'
  },
  {
    category: 'Transportation',
    question: 'Is transportation provided?',
    answer: 'Yes, we have a complimentary bus service from the city center to the venue.'
  },
  {
    category: 'Attire',
    question: 'What is the dress code?',
    answer: 'Semi-formal attire. Think cocktail dress or suit and tie.'
  }
];

export const testPhotos = [
  {
    url: 'https://via.placeholder.com/800x600/FFB6C1/000000?text=Engagement+Photo+1',
    alt: 'Beautiful engagement photo at sunset',
    category: 'Engagement',
    likes: 15
  },
  {
    url: 'https://via.placeholder.com/800x600/E6E6FA/000000?text=Venue+Photo+1',
    alt: 'Wedding venue exterior view',
    category: 'Venue',
    likes: 8
  },
  {
    url: 'https://via.placeholder.com/800x600/F0E68C/000000?text=Pre-Wedding+Photo+1',
    alt: 'Couple photo at the beach',
    category: 'Pre-Wedding',
    likes: 23
  }
];

export const testFormData = {
  validContactForm: {
    name: 'E2E Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message from the E2E test suite.'
  },
  invalidContactForm: {
    name: '',
    email: 'invalid-email',
    subject: '',
    message: ''
  },
  validRSVPForm: {
    attending: 'yes',
    guestName: 'John Doe',
    email: 'john.doe@example.com',
    dietaryRestrictions: 'None',
    additionalGuests: '1',
    plusOneName: 'Jane Doe'
  }
};

export const testSelectors = {
  navigation: {
    home: 'a[href="/"], a[href="#home"]',
    rsvp: 'a[href="/rsvp"], button:has-text("RSVP")',
    gallery: 'a[href="/gallery"]',
    venue: 'a[href="/venue"]',
    accommodation: 'a[href="/accommodation"]',
    transport: 'a[href="/transport"]',
    faq: 'a[href="/faq"]',
    auth: 'a[href="/auth"], button:has-text("Sign In")'
  },
  forms: {
    rsvp: 'form[data-testid="rsvp-form"], .rsvp-form',
    contact: 'form[data-testid="contact-form"], .contact-form',
    auth: 'form[data-testid="auth-form"], .auth-form'
  },
  buttons: {
    submit: 'button[type="submit"], button:has-text("Submit")',
    save: 'button:has-text("Save")',
    cancel: 'button:has-text("Cancel")',
    delete: 'button:has-text("Delete")',
    edit: 'button:has-text("Edit")'
  },
  loading: {
    spinner: '.loading, .spinner, [data-testid="loading"]',
    skeleton: '.skeleton, [data-testid="skeleton"]',
    overlay: '.loading-overlay, [data-testid="loading-overlay"]'
  }
};

export const testTimeouts = {
  short: 2000,
  medium: 5000,
  long: 10000,
  navigation: 30000,
  networkIdle: 10000
};

export const testViewports = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'tablet-landscape' },
  { width: 1280, height: 720, name: 'laptop' },
  { width: 1920, height: 1080, name: 'desktop' }
];

export const testBrowsers = [
  'chromium',
  'firefox', 
  'webkit'
];

export const performanceThresholds = {
  loadTime: 3000, // 3 seconds
  firstContentfulPaint: 2500, // 2.5 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
  firstInputDelay: 100, // 100ms
  cumulativeLayoutShift: 0.1 // 0.1
};

export const accessibilityGuidelines = {
  colorContrast: 4.5, // WCAG AA ratio
  fontSize: 16, // Minimum font size in pixels
  clickTargetSize: 44 // Minimum click target size in pixels
};