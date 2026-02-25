/* eslint-disable */

export interface Dictionary {
  common: {
    appName: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    submit: string;
    yes: string;
    no: string;
    or: string;
    error: string;
    success: string;
    close: string;
    optional: string;
    required: string;
    search: string;
    noResults: string;
    confirm: string;
    welcome: string;
  };
  landing: {
    hero: string;
    subtitle: string;
    getStarted: string;
    login: string;
    features: string;
    featureFlows: string;
    featureFlowsDesc: string;
    featureDocs: string;
    featureDocsDesc: string;
    featureDeadlines: string;
    featureDeadlinesDesc: string;
    featureI18n: string;
    featureI18nDesc: string;
    pricing: string;
    pricingSubtitle: string;
    free: string;
    premium: string;
    premiumPrice: string;
    premiumYearly: string;
    saveYearly: string;
    currentPlan: string;
    upgrade: string;
    freeTier1: string;
    freeTier2: string;
    freeTier3: string;
    freeTier4: string;
    premiumTier1: string;
    premiumTier2: string;
    premiumTier3: string;
    premiumTier4: string;
    premiumTier5: string;
    premiumTier6: string;
    premiumTier7: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginError: string;
    registerError: string;
    passwordMismatch: string;
    checkEmail: string;
    fullName: string;
    logout: string;
    signInLink: string;
    createOne: string;
    registerDesc: string;
    passwordHint: string;
    passwordTooShort: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    visaType: string;
    visaTypePlaceholder: string;
    applicationType: string;
    applicationTypePlaceholder: string;
    firstApplication: string;
    renewal: string;
    city: string;
    cityPlaceholder: string;
    zipCode: string;
    zipCodePlaceholder: string;
    zipCodeHint: string;
    visaExpiry: string;
    visaExpiryLabel: string;
    visaExpiryHint: string;
    complete: string;
    step: string;
    of: string;
    aboutYou: string;
    aboutYouDesc: string;
    fullName: string;
    fullNamePlaceholder: string;
    location: string;
    locationDesc: string;
    updateProfile: string;
    fillAllFields: string;
    selectCity: string;
  };
  dashboard: {
    title: string;
    welcomeBack: string;
    yourFlows: string;
    yourDocuments: string;
    upcomingDeadlines: string;
    quickActions: string;
    startNewFlow: string;
    addDocument: string;
    viewAllFlows: string;
    viewAllDocs: string;
    viewAllDeadlines: string;
    noFlows: string;
    noDocs: string;
    noDeadlines: string;
    progress: string;
    dueIn: string;
    days: string;
    overdue: string;
    today: string;
    premiumBanner: string;
    premiumBannerDesc: string;
    premiumBannerCta: string;
  };
  flows: {
    title: string;
    subtitle: string;
    startFlow: string;
    continueFlow: string;
    completed: string;
    inProgress: string;
    notStarted: string;
    steps: string;
    step: string;
    markDone: string;
    markUndone: string;
    notes: string;
    addNote: string;
    saveNote: string;
    requiredDocs: string;
    usefulLinks: string;
    tips: string;
    optional: string;
    flowProgress: string;
    noFlows: string;
    backToFlows: string;
    limitReached: string;
    limitReachedDesc: string;
    myFlows: string;
    myFlowsDesc: string;
    recommendedForYou: string;
    basedOnVisa: string;
    otherFlows: string;
    progress: string;
    stepsCompleted: string;
    stepOf: string;
    tip: string;
    yourNotes: string;
    notesPlaceholder: string;
    saveNotes: string;
    undo: string;
    markAsDone: string;
    completedSection: string;
  };
  docs: {
    title: string;
    subtitle: string;
    addDocument: string;
    editDocument: string;
    docType: string;
    docTypePlaceholder: string;
    docName: string;
    docNamePlaceholder: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    notes: string;
    notesPlaceholder: string;
    linkedFlow: string;
    noDocuments: string;
    noDocumentsDesc: string;
    valid: string;
    pending: string;
    expired: string;
    expiringSoon: string;
    notUploaded: string;
    deleteConfirm: string;
    limitReached: string;
    limitReachedDesc: string;
    documentVault: string;
    documentVaultDesc: string;
    addNewDocument: string;
    backToDocuments: string;
    selectTypeAndName: string;
    linkToFlow: string;
    none: string;
    issued: string;
    expires: string;
  };
  deadlines: {
    title: string;
    titleDesc: string;
    subtitle: string;
    addDeadline: string;
    addNewDeadline: string;
    editDeadline: string;
    deadlineTitle: string;
    deadlineTitlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    dueDate: string;
    due: string;
    daysLeft: string;
    remindAt: string;
    startReminding: string;
    startRemindingHint: string;
    markDone: string;
    markUndone: string;
    done: string;
    upcoming: string;
    overdue: string;
    today: string;
    noDeadlines: string;
    noPending: string;
    noPendingDesc: string;
    deleteConfirm: string;
    completedSection: string;
    titleAndDateRequired: string;
  };
  nav: {
    dashboard: string;
    flows: string;
    documents: string;
    deadlines: string;
    settings: string;
    logout: string;
    language: string;
    premium: string;
    upgrade: string;
  };
  visa: {
    student_visa: string;
    job_seeker_visa: string;
    blue_card: string;
    work_permit: string;
    family_reunion: string;
    freelance_visa: string;
    permanent_residence: string;
    other: string;
  };
  premium: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    monthlyPrice: string;
    yearlyPrice: string;
    savePercent: string;
    subscribe: string;
    manage: string;
    cancel: string;
    cancelConfirm: string;
    active: string;
    cancelled: string;
    expired: string;
    renewsOn: string;
    expiresOn: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    feature5: string;
    feature6: string;
    thankYou: string;
    welcomePremium: string;
    paymentSuccess: string;
    paymentCancelled: string;
    returnToDashboard: string;
    processing: string;
    error: string;
  };
  affiliates: {
    recommended: string;
    subtitle: string;
    banking: string;
    insurance: string;
    mobile: string;
    housing: string;
    learn: string;
    disclaimer: string;
    openAccount: string;
    getQuote: string;
    viewPlans: string;
    findHousing: string;
  };
  support: {
    tipTitle: string;
    tipSubtitle: string;
    tipAmount: string;
    tipCustom: string;
    tipSend: string;
    tipThankYou: string;
    tipOneTime: string;
  };
  ads: {
    sponsored: string;
    advertisement: string;
  };
}

const en: Dictionary = {
  common: {
    appName: 'Germany Guide',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    optional: 'Optional',
    required: 'Required',
    search: 'Search',
    noResults: 'No results found',
    confirm: 'Confirm',
    welcome: 'Welcome',
  },
  landing: {
    hero: 'Your Complete Guide to Living in Germany',
    subtitle: 'Navigate bureaucracy, manage documents, and track deadlines \u2014 all in one place.',
    getStarted: 'Get Started',
    login: 'Log In',
    features: 'Features',
    featureFlows: 'Step-by-Step Flows',
    featureFlowsDesc: 'Follow guided flows for visa applications, city registration, and more.',
    featureDocs: 'Document Vault',
    featureDocsDesc: 'Store and track all your important documents with expiry alerts.',
    featureDeadlines: 'Deadline Tracker',
    featureDeadlinesDesc: 'Never miss an appointment or renewal date again.',
    featureI18n: 'Multi-Language Support',
    featureI18nDesc: 'Available in 11 languages including Arabic, Turkish, Ukrainian, and more.',
    pricing: 'Pricing',
    pricingSubtitle: 'Choose the plan that works for you',
    free: 'Free',
    premium: 'Premium',
    premiumPrice: '\u20AC4.99/month',
    premiumYearly: '\u20AC39.99/year',
    saveYearly: 'Save 33%',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade Now',
    freeTier1: 'Up to 3 active flows',
    freeTier2: 'Up to 10 documents',
    freeTier3: 'Basic deadline tracking',
    freeTier4: 'Community support',
    premiumTier1: 'Unlimited flows',
    premiumTier2: 'Unlimited documents',
    premiumTier3: 'Priority email support',
    premiumTier4: 'Ad-free experience',
    premiumTier5: 'Export documents as PDF',
    premiumTier6: 'Advanced deadline reminders',
    premiumTier7: 'Personalized checklist',
  },
  auth: {
    login: 'Log In',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginError: 'Invalid email or password',
    registerError: 'Registration failed. Please try again.',
    passwordMismatch: 'Passwords do not match',
    checkEmail: 'Check your email to confirm your account',
    fullName: 'Full Name',
    logout: 'Log Out',
    signInLink: 'Sign in',
    createOne: 'Create one',
    registerDesc: 'Create your account to get started',
    passwordHint: 'Must be at least 6 characters',
    passwordTooShort: 'Password must be at least 6 characters',
  },
  onboarding: {
    title: "Let's Set Up Your Profile",
    subtitle: 'This helps us personalize your experience',
    step1Title: 'Visa Type',
    step1Desc: 'What type of visa do you have or are applying for?',
    step2Title: 'Application Details',
    step2Desc: 'Tell us more about your situation',
    step3Title: 'Location',
    step3Desc: 'Where are you in Germany?',
    visaType: 'Visa Type',
    visaTypePlaceholder: 'Select your visa type',
    applicationType: 'Is this your first application or a renewal?',
    applicationTypePlaceholder: 'Select application type',
    firstApplication: 'First Application',
    renewal: 'Renewal',
    city: 'City',
    cityPlaceholder: 'Select your city',
    zipCode: 'ZIP Code',
    zipCodePlaceholder: 'e.g. 10115',
    zipCodeHint: 'Your German postal code',
    visaExpiry: 'Visa Expiry Date',
    visaExpiryLabel: 'When does your visa expire?',
    visaExpiryHint: 'Leave blank if not applicable',
    complete: 'Complete Setup',
    step: 'Step',
    of: 'of',
    aboutYou: 'About You',
    aboutYouDesc: 'Tell us a bit about yourself',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    location: 'Location',
    locationDesc: 'Where are you located in Germany?',
    updateProfile: 'Update Profile',
    fillAllFields: 'Please fill in all required fields',
    selectCity: 'Please select a city',
  },
  dashboard: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
    yourFlows: 'Your Flows',
    yourDocuments: 'Your Documents',
    upcomingDeadlines: 'Upcoming Deadlines',
    quickActions: 'Quick Actions',
    startNewFlow: 'Start New Flow',
    addDocument: 'Add Document',
    viewAllFlows: 'View All Flows',
    viewAllDocs: 'View All Docs',
    viewAllDeadlines: 'View All Deadlines',
    noFlows: 'No active flows yet',
    noDocs: 'No documents yet',
    noDeadlines: 'No upcoming deadlines',
    progress: 'Progress',
    dueIn: 'Due in',
    days: 'days',
    overdue: 'Overdue',
    today: 'Today',
    premiumBanner: 'Upgrade to Premium',
    premiumBannerDesc: 'Unlimited flows, ad-free experience, and more.',
    premiumBannerCta: 'Learn More',
  },
  flows: {
    title: 'Flows',
    subtitle: 'Step-by-step guides tailored to your visa type',
    startFlow: 'Start Flow',
    continueFlow: 'Continue',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    steps: 'Steps',
    step: 'Step',
    markDone: 'Mark as Done',
    markUndone: 'Mark as Undone',
    notes: 'Notes',
    addNote: 'Add a note...',
    saveNote: 'Save Note',
    requiredDocs: 'Required Documents',
    usefulLinks: 'Useful Links',
    tips: 'Tips',
    optional: 'Optional Step',
    flowProgress: 'Flow Progress',
    noFlows: 'No flows available for your visa type',
    backToFlows: 'Back to Flows',
    limitReached: 'Free plan limit reached',
    limitReachedDesc: 'Upgrade to Premium for unlimited flows.',
    myFlows: 'My Flows',
    myFlowsDesc: 'Your active and completed flows',
    recommendedForYou: 'Recommended for You',
    basedOnVisa: 'Based on your visa type',
    otherFlows: 'Other Flows',
    progress: 'Progress',
    stepsCompleted: 'steps completed',
    stepOf: 'of',
    tip: 'Tip',
    yourNotes: 'Your Notes',
    notesPlaceholder: 'Write your notes here...',
    saveNotes: 'Save Notes',
    undo: 'Undo',
    markAsDone: 'Mark as Done',
    completedSection: 'Completed',
  },
  docs: {
    title: 'Documents',
    subtitle: 'Track all your important documents',
    addDocument: 'Add Document',
    editDocument: 'Edit Document',
    docType: 'Document Type',
    docTypePlaceholder: 'Select document type',
    docName: 'Document Name',
    docNamePlaceholder: 'Enter document name',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    status: 'Status',
    notes: 'Notes',
    notesPlaceholder: 'Add any notes...',
    linkedFlow: 'Linked Flow',
    noDocuments: 'No documents added yet',
    noDocumentsDesc: 'Add your first document to get started',
    valid: 'Valid',
    pending: 'Pending',
    expired: 'Expired',
    expiringSoon: 'Expiring Soon',
    notUploaded: 'Not Uploaded',
    deleteConfirm: 'Are you sure you want to delete this document?',
    limitReached: 'Free plan limit reached',
    limitReachedDesc: 'Upgrade to Premium for unlimited documents.',
    documentVault: 'Document Vault',
    documentVaultDesc: 'Store and manage all your important documents',
    addNewDocument: 'Add New Document',
    backToDocuments: 'Back to Documents',
    selectTypeAndName: 'Please select a type and enter a name',
    linkToFlow: 'Link to Flow',
    none: 'None',
    issued: 'Issued',
    expires: 'Expires',
  },
  deadlines: {
    title: 'Deadlines',
    titleDesc: 'Keep track of all your important dates',
    subtitle: 'Never miss an important date',
    addDeadline: 'Add Deadline',
    addNewDeadline: 'Add New Deadline',
    editDeadline: 'Edit Deadline',
    deadlineTitle: 'Title',
    deadlineTitlePlaceholder: 'e.g. Visa renewal appointment',
    description: 'Description',
    descriptionPlaceholder: 'Add details about this deadline...',
    dueDate: 'Due Date',
    due: 'Due',
    daysLeft: 'days left',
    remindAt: 'Reminder',
    startReminding: 'Start Reminding',
    startRemindingHint: 'When should we start reminding you?',
    markDone: 'Mark as Done',
    markUndone: 'Mark as Undone',
    done: 'Done',
    upcoming: 'Upcoming',
    overdue: 'Overdue',
    today: 'Today',
    noDeadlines: 'No deadlines set',
    noPending: 'No pending deadlines',
    noPendingDesc: 'You are all caught up!',
    deleteConfirm: 'Are you sure you want to delete this deadline?',
    completedSection: 'Completed Deadlines',
    titleAndDateRequired: 'Title and due date are required',
  },
  nav: {
    dashboard: 'Dashboard',
    flows: 'Flows',
    documents: 'Documents',
    deadlines: 'Deadlines',
    settings: 'Settings',
    logout: 'Log Out',
    language: 'Language',
    premium: 'Premium',
    upgrade: 'Upgrade',
  },
  visa: {
    student_visa: 'Student Visa',
    job_seeker_visa: 'Job Seeker Visa',
    blue_card: 'Blue Card',
    work_permit: 'Work Permit',
    family_reunion: 'Family Reunion',
    freelance_visa: 'Freelance Visa',
    permanent_residence: 'Permanent Residence',
    other: 'Other',
  },
  premium: {
    title: 'Upgrade to Premium',
    subtitle: 'Unlock the full power of Germany Guide',
    monthly: 'Monthly',
    yearly: 'Yearly',
    monthlyPrice: '\u20AC4.99/mo',
    yearlyPrice: '\u20AC39.99/yr',
    savePercent: 'Save 33%',
    subscribe: 'Subscribe Now',
    manage: 'Manage Subscription',
    cancel: 'Cancel Subscription',
    cancelConfirm: 'Are you sure you want to cancel your subscription?',
    active: 'Active',
    cancelled: 'Cancelled',
    expired: 'Expired',
    renewsOn: 'Renews on',
    expiresOn: 'Expires on',
    feature1: 'Unlimited flows and documents',
    feature2: 'Ad-free experience',
    feature3: 'Priority support',
    feature4: 'PDF export',
    feature5: 'Advanced reminders (SMS & Email)',
    feature6: 'Personalized checklists',
    thankYou: 'Thank you for subscribing!',
    welcomePremium: 'Welcome to Premium. Enjoy all features.',
    paymentSuccess: 'Payment successful',
    paymentCancelled: 'Payment cancelled',
    returnToDashboard: 'Return to Dashboard',
    processing: 'Processing your payment...',
    error: 'Something went wrong. Please try again.',
  },
  affiliates: {
    recommended: 'Recommended Services',
    subtitle: 'Trusted partners to help you settle in Germany',
    banking: 'Banking',
    insurance: 'Health Insurance',
    mobile: 'Mobile Plans',
    housing: 'Housing',
    learn: 'Learn More',
    disclaimer: 'We may receive a commission when you sign up through our links. This does not affect the price you pay.',
    openAccount: 'Open Account',
    getQuote: 'Get Quote',
    viewPlans: 'View Plans',
    findHousing: 'Find Housing',
  },
  support: {
    tipTitle: 'Support This Project',
    tipSubtitle: 'Help us keep this guide free and up to date',
    tipAmount: 'Choose an amount',
    tipCustom: 'Custom amount',
    tipSend: 'Send Tip',
    tipThankYou: 'Thank you for your support!',
    tipOneTime: 'One-time tip',
  },
  ads: {
    sponsored: 'Sponsored',
    advertisement: 'Advertisement',
  },
};

export default en;