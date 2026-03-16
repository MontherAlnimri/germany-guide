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
    search: string;
    filter: string;
    sortBy: string;
    noResults: string;
    error: string;
    success: string;
    confirm: string;
    yes: string;
    no: string;
    close: string;
    language: string;
    logout: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    getStarted: string;
    login: string;
    whyTitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    feature5Title: string;
    feature5Desc: string;
    feature6Title: string;
    feature6Desc: string;
    pricingTitle: string;
    pricingFree: string;
    pricingPremium: string;
    pricingFreePriceLabel: string;
    pricingPremiumPriceLabel: string;
    pricingFreeFeatures: string[];
    pricingPremiumFeatures: string[];
    pricingFreeButton: string;
    pricingPremiumButton: string;
    footerRights: string;
    footerPrivacy: string;
    footerTerms: string;
    footerAbout: string;
    perMonth: string;
    perYear: string;
    howItWorksTitle: string;
    pricingSubtitle: string;
    premiumMonthly: string;
    premiumYearly: string;
    freeTier: string;
    freePriceLabel: string;
    freeFeature1: string;
    freeFeature2: string;
    freeFeature3: string;
    freeFeature4: string;
    premiumTier: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    learnMore: string;
    featuresTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    hasAccount: string;
    loginLink: string;
    registerLink: string;
    orContinueWith: string;
    forgotPassword: string;
    forgotPasswordTitle: string;
    forgotPasswordDesc: string;
    forgotPasswordButton: string;
    forgotPasswordSuccess: string;
    forgotPasswordSuccessDesc: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    newPassword: string;
    confirmNewPassword: string;
    resetPasswordButton: string;
    resetPasswordSuccess: string;
    resetPasswordSuccessDesc: string;
    goToLogin: string;
    passwordMismatch: string;
    passwordTooShort: string;
    emailNotConfirmed: string;
    resendConfirmation: string;
    confirmationResent: string;
    backToLogin: string;
    loginSubtitle: string;
    signIn: string;
    createOne: string;
    forgotPasswordSubtitle: string;
    sendResetLink: string;
    resetLinkSent: string;
    resetLinkSentDesc: string;
    resetPasswordSubtitle: string;
    resetPassword: string;
    passwordHint: string;
    passwordResetSuccess: string;
    passwordResetSuccessDesc: string;
    registerDesc: string;
    signInLink: string;
    signUp: string;
    errors: {
      invalidCredentials: string;
      emailInUse: string;
      weakPassword: string;
      generic: string;
    };
  };
  onboarding: {
    welcome: string;
    welcomeDesc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    visaType: string;
    applicationType: string;
    first: string;
    renewal: string;
    city: string;
    zipCode: string;
    visaExpiry: string;
    visaExpiryHelp: string;
    selectVisa: string;
    selectCity: string;
    completeSetup: string;
    updateProfile: string;
    letsGo: string;
    stepOf: string;
    visaLabels: {
      student_visa: string;
      job_seeker_visa: string;
      blue_card: string;
      work_permit: string;
      family_reunion: string;
      freelance_visa: string;
      permanent_residence: string;
      other: string;
    };
    applicationLabels: {
      first: string;
      renewal: string;
    };
    profileSaved: string;
    profileSavedDesc: string;
    aboutYou: string;
    cityPlaceholder: string;
    expiryHint: string;
    firstApplication: string;
    location: string;
    saveChanges: string;
    selectVisaType: string;
    visaPlaceholder: string;
    zipPlaceholder: string;
    title: string;
    progress: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    activeFlows: string;
    documents: string;
    upcomingDeadlines: string;
    overallProgress: string;
    quickActions: string;
    startNewFlow: string;
    addDocument: string;
    addDeadline: string;
    viewAll: string;
    noFlows: string;
    noDocs: string;
    noDeadlines: string;
    premiumBanner: string;
    premiumBannerDesc: string;
    upgrade: string;
    daysLeft: string;
    overdue: string;
    complete: string;
    recentActivity: string;
    completedSteps: string;
    overview: string;
    recentFlows: string;
    totalDocuments: string;
    yourProgress: string;
    startFlow: string;
  };
  flows: {
    title: string;
    subtitle: string;
    startFlow: string;
    continueFlow: string;
    restartFlow: string;
    progress: string;
    steps: string;
    step: string;
    completed: string;
    inProgress: string;
    notStarted: string;
    markDone: string;
    markUndone: string;
    notes: string;
    addNote: string;
    saveNote: string;
    requiredDocs: string;
    usefulLinks: string;
    tips: string;
    optional: string;
    required: string;
    flowComplete: string;
    flowCompleteDesc: string;
    exportPDF: string;
    noFlows: string;
    noFlowsDesc: string;
    stepProgress: string;
    previousStep: string;
    nextStep: string;
    backToFlows: string;
    limitReached: string;
    limitReachedDesc: string;
    basedOnVisa: string;
    myFlows: string;
    otherFlows: string;
    recommendedForYou: string;
    startNew: string;
    flowCompleted: string;
    allStepsDone: string;
    yourNotes: string;
    undo: string;
    markAsDone: string;
    stepOf: string;
  };
  docs: {
    title: string;
    subtitle: string;
    addDocument: string;
    editDocument: string;
    docType: string;
    docName: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    notes: string;
    selectType: string;
    selectStatus: string;
    valid: string;
    pending: string;
    expired: string;
    notUploaded: string;
    noDocuments: string;
    noDocumentsDesc: string;
    deleteConfirm: string;
    exportPDF: string;
    limitReached: string;
    limitReachedDesc: string;
    addNewDocument: string;
    backToDocuments: string;
    enterDocName: string;
    notesPlaceholder: string;
    saveDocument: string;
    selectDocType: string;
    documentVault: string;
    expiringSoon: string;
    issued: string;
    expires: string;
    addFirst: string;
    docTypes: {
      passport: string;
      visa: string;
      anmeldung: string;
      insurance: string;
      bankStatement: string;
      contract: string;
      diploma: string;
      transcript: string;
      photo: string;
      birthCertificate: string;
      marriageCertificate: string;
      criminalRecord: string;
      healthCertificate: string;
      taxId: string;
      socialSecurity: string;
      other: string;
    };
  };
  deadlines: {
    title: string;
    subtitle: string;
    addDeadline: string;
    editDeadline: string;
    deadlineTitle: string;
    description: string;
    dueDate: string;
    remindAt: string;
    markDone: string;
    markUndone: string;
    done: string;
    pending: string;
    overdue: string;
    daysLeft: string;
    today: string;
    noDeadlines: string;
    noDeadlinesDesc: string;
    deleteConfirm: string;
    upcoming: string;
    past: string;
    all: string;
    addReminder: string;
    reminderSet: string;
    noReminder: string;
    dueToday: string;
    tomorrow: string;
    due: string;
    addFirst: string;
    addNew: string;
    addNewDeadline: string;
    completedSection: string;
    descPlaceholder: string;
    noPending: string;
    startReminding: string;
    titleAndDateRequired: string;
    titleDesc: string;
    titlePlaceholder: string;
  };
  nav: {
    dashboard: string;
    flows: string;
    documents: string;
    deadlines: string;
    settings: string;
    help: string;
    profile: string;
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
    currentPlan: string;
    freePlan: string;
    premiumPlan: string;
    monthly: string;
    yearly: string;
    monthlyPrice: string;
    yearlyPrice: string;
    subscribe: string;
    manage: string;
    cancel: string;
    features: string;
    unlimitedFlows: string;
    unlimitedDocs: string;
    pdfExport: string;
    prioritySupport: string;
    adFree: string;
    noAds: string;
    savePercent: string;
    mostPopular: string;
    currentPlanBadge: string;
    upgradeNow: string;
    successTitle: string;
    successDesc: string;
    goToDashboard: string;
    billingPortal: string;
    premiumFeature: string;
    premiumRequired: string;
    billedMonthly: string;
    billedYearly: string;
    cancelAnytime: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    feature5: string;
    feature6: string;
    managePlan: string;
    premiumBadge: string;
    free: string;
    perMonth: string;
    perYear: string;
  };
  affiliates: {
    title: string;
    subtitle: string;
    banking: string;
    bankingDesc: string;
    insurance: string;
    insuranceDesc: string;
    mobile: string;
    mobileDesc: string;
    housing: string;
    housingDesc: string;
    learnMore: string;
    bankingName: string;
    insuranceName: string;
    mobileName: string;
    housingName: string;
    disclaimer: string;
    recommended: string;
    visitSite: string;
    sponsored: string;
  };
  support: {
    title: string;
    subtitle: string;
    tipAmount: string;
    customAmount: string;
    sendTip: string;
    thankYouTitle: string;
    thankYouDesc: string;
  };
  ads: {
    sponsoredContent: string;
    hideAds: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    intro: string;
    section1Title: string;
    section1Content: string;
    section2Title: string;
    section2Content: string;
    section3Title: string;
    section3Content: string;
    section4Title: string;
    section4Content: string;
    section5Title: string;
    section5Content: string;
    section6Title: string;
    section6Content: string;
    section7Title: string;
    section7Content: string;
    section8Title: string;
    section8Content: string;
    section9Title: string;
    section9Content: string;
    section10Title: string;
    section10Content: string;
    contactEmail: string;
  };
  terms: {
    title: string;
    lastUpdated: string;
    intro: string;
    section1Title: string;
    section1Content: string;
    section2Title: string;
    section2Content: string;
    section3Title: string;
    section3Content: string;
    section4Title: string;
    section4Content: string;
    section5Title: string;
    section5Content: string;
    section6Title: string;
    section6Content: string;
    terms: string;
    section7Title: string;
    section7Content: string;
    section8Title: string;
    section8Content: string;
    section9Title: string;
    section9Content: string;
    section10Title: string;
    section10Content: string;
    section11Title: string;
    section11Content: string;
    section12Title: string;
    section12Content: string;
  };
  about: {
    title: string;
    subtitle: string;
    missionTitle: string;
    missionContent: string;
    storyTitle: string;
    storyContent: string;
    featuresTitle: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    contactTitle: string;
    contactContent: string;
    contactEmail: string;
    whatWeDoTitle: string;
    whatWeDoContent: string;
    whoWeAreTitle: string;
    whoWeAreContent: string;
    ctaTitle: string;
    ctaContent: string;
    ctaButton: string;
  };
  settings: {
    title: string;
    subtitle: string;
    accountInfo: string;
    profileSection: string;
    changePassword: string;
    updatePassword: string;
    passwordChanged: string;
    dangerZone: string;
    deleteAccount: string;
    deleteAccountDesc: string;
    deleteAccountConfirmTitle: string;
    deleteAccountWarning: string;
    deleteItem1: string;
    deleteItem2: string;
    deleteItem3: string;
    deleteItem4: string;
    deleteItem5: string;
    typeDeleteConfirm: string;
    toConfirm: string;
    confirmDelete: string;
    plan: string;
    memberSince: string;
    ok: string;
  };
  verification: {
    bannerTitle: string;
    bannerDesc: string;
    resendButton: string;
    sentButton: string;
    resent: string;
    checkEmailTitle: string;
    checkEmailDesc: string;
    checkEmailHint: string;
    verified: string;
    notVerified: string;
  };
  guides: {
    sectionTitle: string;
    sectionSubtitle: string;
    viewAll: string;
    minRead: string;
    guide1Category: string;
    guide1Title: string;
    guide1Desc: string;
    guide1Time: string;
    guide2Category: string;
    guide2Title: string;
    guide2Desc: string;
    guide2Time: string;
    guide3Category: string;
    guide3Title: string;
    guide3Desc: string;
    guide3Time: string;
    guide4Category: string;
    guide4Title: string;
    guide4Desc: string;
    guide4Time: string;
    guide5Category: string;
    guide5Title: string;
    guide5Desc: string;
    guide5Time: string;
    guide6Category: string;
    guide6Title: string;
    guide6Desc: string;
    guide6Time: string;
  };
  faq: {
    sectionTitle: string;
    sectionSubtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
    q6: string;
    a6: string;
    q7: string;
    a7: string;
    q8: string;
    a8: string;
  };
}
const en: Dictionary = {
  common: {
    appName: "Germany Guide",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sortBy: "Sort by",
    noResults: "No results found",
    error: "Something went wrong",
    success: "Success!",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    close: "Close",
    language: "Language",
    logout: "Log out",
  },
  landing: {
    heroTitle: "Navigate German Bureaucracy with Confidence",
    heroSubtitle: "Step-by-step guides for visas, registration, insurance, and more. Built for international students and migrants in Germany.",
    getStarted: "Get Started Free",
    login: "Log In",
    whyTitle: "Everything You Need in One Place",
    feature1Title: "Step-by-Step Guides",
    feature1Desc: "Follow clear, detailed guides tailored to your visa type and situation.",
    feature2Title: "Document Tracker",
    feature2Desc: "Keep all your important documents organized with expiry alerts.",
    feature3Title: "Deadline Reminders",
    feature3Desc: "Never miss a deadline with smart reminders for appointments and renewals.",
    feature4Title: "11 Languages",
    feature4Desc: "Use the app in your native language including Arabic, Turkish, and Ukrainian.",
    feature5Title: "City-Specific Info",
    feature5Desc: "Get information relevant to your city, from registration offices to tips.",
    feature6Title: "Visa Renewal Tracking",
    feature6Desc: "Track your visa status and get reminded before it expires.",
    pricingTitle: "Simple, Transparent Pricing",
    pricingFree: "Free",
    pricingPremium: "Premium",
    pricingFreePriceLabel: "Free forever",
    pricingPremiumPriceLabel: "per month",
    pricingFreeFeatures: [
      "Up to 3 active guides",
      "Up to 10 documents",
      "Deadline reminders",
      "11 languages",
      "Community support",
    ],
    pricingPremiumFeatures: [
      "Unlimited guides",
      "Unlimited documents",
      "PDF export",
      "Priority support",
      "Ad-free experience",
      "Visa expiry alerts",
    ],
    pricingFreeButton: "Get Started",
    pricingPremiumButton: "Go Premium",
    footerRights: "All rights reserved.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerAbout: "About",
    perMonth: "/month",
    perYear: "/year",
    howItWorksTitle: "How It Works",
    pricingSubtitle: "Choose the plan that works for you",
    premiumMonthly: "Premium Monthly",
    premiumYearly: "Premium Yearly",
    freeTier: "Free",
    freePriceLabel: "Free forever",
    freeFeature1: "Up to 3 active guides",
    freeFeature2: "Up to 10 documents",
    freeFeature3: "Deadline reminders",
    freeFeature4: "11 languages",
    premiumTier: "Premium",
    ctaTitle: "Ready to Start Your Journey?",
    ctaSubtitle: "Join thousands of migrants and students navigating German bureaucracy with confidence.",
    ctaButton: "Get Started Free",
    learnMore: "Learn More",
    featuresTitle: "Key Features",
    step1Title: "Create Your Profile",
    step1Desc: "Tell us about your visa type and location so we can personalize your experience.",
    step2Title: "Follow Step-by-Step Guides",
    step2Desc: "Get clear instructions for every bureaucratic process, tailored to your situation.",
    step3Title: "Track Everything",
    step3Desc: "Keep your documents organized and never miss a deadline with smart reminders.",
  },
  auth: {
    loginTitle: "Welcome Back",
    registerTitle: "Create Account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    loginButton: "Log In",
    registerButton: "Create Account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    loginLink: "Log in",
    registerLink: "Sign up",
    orContinueWith: "Or continue with",
    forgotPassword: "Forgot password?",
    forgotPasswordTitle: "Reset Your Password",
    forgotPasswordDesc: "Enter your email and we'll send you a link to reset your password.",
    forgotPasswordButton: "Send Reset Link",
    forgotPasswordSuccess: "Check Your Email",
    forgotPasswordSuccessDesc: "We've sent a password reset link to your email. Click the link to set a new password.",
    resetPasswordTitle: "Set New Password",
    resetPasswordDesc: "Enter your new password below.",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    resetPasswordButton: "Update Password",
    resetPasswordSuccess: "Password Updated",
    resetPasswordSuccessDesc: "Your password has been successfully updated. You can now log in with your new password.",
    goToLogin: "Go to Login",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    emailNotConfirmed: "Please verify your email before logging in.",
    resendConfirmation: "Resend verification email",
    confirmationResent: "Verification email sent!",
    backToLogin: "Back to login",
    loginSubtitle: "Sign in to your account to continue",
    signIn: "Sign In",
    createOne: "Create one",
    forgotPasswordSubtitle: "Enter your email and we will send you a reset link.",
    sendResetLink: "Send Reset Link",
    resetLinkSent: "Check Your Email",
    resetLinkSentDesc: "We sent a password reset link to your email. Click the link to set a new password.",
    resetPasswordSubtitle: "Enter your new password below.",
    resetPassword: "Reset Password",
    passwordHint: "Must be at least 6 characters",
    passwordResetSuccess: "Password Updated!",
    passwordResetSuccessDesc: "Your password has been successfully updated. You can now sign in with your new password.",
    registerDesc: "Create your account to start your journey in Germany",
    signInLink: "Sign in",
    signUp: "Sign Up",
    errors: {
      invalidCredentials: "Invalid email or password",
      emailInUse: "This email is already registered",
      weakPassword: "Password is too weak",
      generic: "Something went wrong. Please try again.",
    },
  },
  onboarding: {
    welcome: "Welcome to Germany Guide!",
    welcomeDesc: "Let's set up your profile so we can give you personalized guidance.",
    step1Title: "Visa Information",
    step1Desc: "Tell us about your visa type and application status.",
    step2Title: "Location",
    step2Desc: "Where are you located in Germany?",
    step3Title: "Important Dates",
    step3Desc: "When does your current visa expire?",
    visaType: "Visa Type",
    applicationType: "Application Type",
    first: "First Application",
    renewal: "Renewal",
    city: "City",
    zipCode: "ZIP Code",
    visaExpiry: "Visa Expiry Date",
    visaExpiryHelp: "Leave blank if you haven't received your visa yet.",
    selectVisa: "Select your visa type",
    selectCity: "Select your city",
    completeSetup: "Complete Setup",
    updateProfile: "Update Profile",
    letsGo: "Let's Go!",
    stepOf: "of",
    visaLabels: {
      student_visa: "Student Visa",
      job_seeker_visa: "Job Seeker Visa",
      blue_card: "EU Blue Card",
      work_permit: "Work Permit",
      family_reunion: "Family Reunion Visa",
      freelance_visa: "Freelance Visa",
      permanent_residence: "Permanent Residence",
      other: "Other",
    },
    applicationLabels: {
      first: "First Application",
      renewal: "Renewal / Extension",
    },
    profileSaved: "Profile Saved!",
    profileSavedDesc: "Your profile has been updated successfully.",
    aboutYou: "About You",
    cityPlaceholder: "Select your city",
    expiryHint: "Leave blank if not applicable",
    firstApplication: "First Application",
    location: "Location",
    saveChanges: "Save Changes",
    selectVisaType: "Select visa type",
    visaPlaceholder: "Select visa type",
    zipPlaceholder: "e.g. 10115",
    title: "Update Your Profile",
    progress: "Progress",
  },
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back",
    activeFlows: "Active Guides",
    documents: "Documents",
    upcomingDeadlines: "Upcoming Deadlines",
    overallProgress: "Overall Progress",
    quickActions: "Quick Actions",
    startNewFlow: "Start New Guide",
    addDocument: "Add Document",
    addDeadline: "Add Deadline",
    viewAll: "View All",
    noFlows: "No active guides yet",
    noDocs: "No documents tracked yet",
    noDeadlines: "No upcoming deadlines",
    premiumBanner: "Unlock Premium Features",
    premiumBannerDesc: "Get unlimited guides, documents, PDF export, and more.",
    upgrade: "Upgrade Now",
    daysLeft: "days left",
    overdue: "Overdue",
    complete: "Complete",
    recentActivity: "Recent Activity",
    completedSteps: "Completed Steps",
    overview: "Overview",
    recentFlows: "Recent Guides",
    totalDocuments: "Total Documents",
    yourProgress: "Your Progress",
    startFlow: "Start Guide",
  },
  flows: {
    title: "Bureaucratic Guides",
    subtitle: "Step-by-step guides tailored to your visa type",
    startFlow: "Start Guide",
    continueFlow: "Continue",
    restartFlow: "Restart",
    progress: "Progress",
    steps: "Steps",
    step: "Step",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    markDone: "Mark as Done",
    markUndone: "Mark as Not Done",
    notes: "Notes",
    addNote: "Add a note...",
    saveNote: "Save Note",
    requiredDocs: "Required Documents",
    usefulLinks: "Useful Links",
    tips: "Tips",
    optional: "Optional",
    required: "Required",
    flowComplete: "Guide Complete!",
    flowCompleteDesc: "Congratulations! You have completed all the steps.",
    exportPDF: "Export as PDF",
    noFlows: "No guides available",
    noFlowsDesc: "Complete onboarding to see guides tailored to your visa type.",
    stepProgress: "Step {current} of {total}",
    previousStep: "Previous Step",
    nextStep: "Next Step",
    backToFlows: "Back to Guides",
    limitReached: "Guide Limit Reached",
    limitReachedDesc: "Free users can have up to 3 active guides. Upgrade to Premium for unlimited guides.",
    basedOnVisa: "Based on your visa type",
    myFlows: "My Guides",
    otherFlows: "Other Guides",
    recommendedForYou: "Recommended for You",
    startNew: "Start New Guide",
    flowCompleted: "Guide Completed!",
    allStepsDone: "All steps have been completed.",
    yourNotes: "Your Notes",
    undo: "Undo",
    markAsDone: "Mark as Done",
    stepOf: "Step {current} of {total}",
  },
  docs: {
    title: "Document Tracker",
    subtitle: "Keep all your important documents organized",
    addDocument: "Add Document",
    editDocument: "Edit Document",
    docType: "Document Type",
    docName: "Document Name",
    issueDate: "Issue Date",
    expiryDate: "Expiry Date",
    status: "Status",
    notes: "Notes",
    selectType: "Select document type",
    selectStatus: "Select status",
    valid: "Valid",
    pending: "Pending",
    expired: "Expired",
    notUploaded: "Not Uploaded",
    noDocuments: "No documents yet",
    noDocumentsDesc: "Start tracking your documents by adding your first one.",
    deleteConfirm: "Are you sure you want to delete this document?",
    exportPDF: "Export as PDF",
    limitReached: "Document Limit Reached",
    limitReachedDesc: "Free users can track up to 10 documents. Upgrade to Premium for unlimited documents.",
    addNewDocument: "Add New Document",
    backToDocuments: "Back to Documents",
    enterDocName: "Enter document name",
    notesPlaceholder: "Optional notes about this document...",
    saveDocument: "Save Document",
    selectDocType: "Select document type",
    documentVault: "Document Vault",
    expiringSoon: "Expiring Soon",
    issued: "Issued",
    expires: "Expires",
    addFirst: "Add your first document to start tracking",
    docTypes: {
      passport: "Passport",
      visa: "Visa / Residence Permit",
      anmeldung: "Anmeldung Certificate",
      insurance: "Health Insurance Card",
      bankStatement: "Bank Statement",
      contract: "Employment Contract",
      diploma: "Diploma / Degree",
      transcript: "Transcript",
      photo: "Biometric Photo",
      birthCertificate: "Birth Certificate",
      marriageCertificate: "Marriage Certificate",
      criminalRecord: "Criminal Record Check",
      healthCertificate: "Health Certificate",
      taxId: "Tax ID (Steuer-ID)",
      socialSecurity: "Social Security Number",
      other: "Other",
    },
  },
  deadlines: {
    title: "Deadline Manager",
    subtitle: "Never miss an important date",
    addDeadline: "Add Deadline",
    editDeadline: "Edit Deadline",
    deadlineTitle: "Title",
    description: "Description",
    dueDate: "Due Date",
    remindAt: "Remind Me On",
    markDone: "Mark as Done",
    markUndone: "Mark as Not Done",
    done: "Done",
    pending: "Pending",
    overdue: "Overdue",
    daysLeft: "days left",
    today: "Today",
    noDeadlines: "No deadlines yet",
    noDeadlinesDesc: "Add your first deadline to stay on top of important dates.",
    deleteConfirm: "Are you sure you want to delete this deadline?",
    upcoming: "Upcoming",
    past: "Past",
    all: "All",
    addReminder: "Add Reminder",
    reminderSet: "Reminder set",
    noReminder: "No reminder",
    dueToday: "Due today",
    tomorrow: "Tomorrow",
    due: "Due",
    addFirst: "Add your first deadline",
    addNew: "Add New",
    addNewDeadline: "Add New Deadline",
    completedSection: "Completed",
    descPlaceholder: "Optional description...",
    noPending: "No pending deadlines",
    startReminding: "Start reminding me",
    titleAndDateRequired: "Title and due date are required",
    titleDesc: "Deadline Details",
    titlePlaceholder: "e.g. Visa appointment, Document submission...",
  },
  nav: {
    dashboard: "Dashboard",
    flows: "Guides",
    documents: "Documents",
    deadlines: "Deadlines",
    settings: "Settings",
    help: "Help",
    profile: "Profile",
    premium: "Premium",
    upgrade: "Upgrade",
  },
  visa: {
    student_visa: "Student Visa",
    job_seeker_visa: "Job Seeker Visa",
    blue_card: "EU Blue Card",
    work_permit: "Work Permit",
    family_reunion: "Family Reunion Visa",
    freelance_visa: "Freelance Visa",
    permanent_residence: "Permanent Residence",
    other: "Other",
  },
  premium: {
    title: "Premium Plan",
    subtitle: "Unlock the full power of Germany Guide",
    currentPlan: "Current Plan",
    freePlan: "Free Plan",
    premiumPlan: "Premium",
    monthly: "Monthly",
    yearly: "Yearly",
    monthlyPrice: "4.99",
    yearlyPrice: "39.99",
    subscribe: "Subscribe",
    manage: "Manage Subscription",
    cancel: "Cancel Subscription",
    features: "Premium Features",
    unlimitedFlows: "Unlimited guides",
    unlimitedDocs: "Unlimited documents",
    pdfExport: "PDF export",
    prioritySupport: "Priority support",
    adFree: "Ad-free experience",
    noAds: "No advertisements",
    savePercent: "Save 33%",
    mostPopular: "Most Popular",
    currentPlanBadge: "Current",
    upgradeNow: "Upgrade Now",
    successTitle: "Welcome to Premium!",
    successDesc: "Your subscription is now active. Enjoy all premium features!",
    goToDashboard: "Go to Dashboard",
    billingPortal: "Manage Billing",
    premiumFeature: "Premium Feature",
    premiumRequired: "This feature requires a Premium subscription.",
    billedMonthly: "Billed monthly",
    billedYearly: "Billed yearly",
    cancelAnytime: "Cancel anytime",
    feature5: "Ad-free experience",
    feature6: "Visa expiry alerts",
    managePlan: "Manage Plan",
    premiumBadge: "Premium",
    free: "Free",
    feature1: "Unlimited guides",
    feature2: "Unlimited documents",
    feature3: "PDF export",
    feature4: "Priority support",
    perMonth: "/month",
    perYear: "/year",
  },
  affiliates: {
    title: "Recommended Services",
    subtitle: "Trusted services to help you settle in Germany",
    banking: "Banking",
    bankingDesc: "Open a free German bank account in minutes. No paperwork, no German required.",
    insurance: "Health Insurance",
    insuranceDesc: "Get public health insurance coverage that meets all German requirements.",
    mobile: "Mobile Plan",
    mobileDesc: "Affordable mobile plans with no contract. Perfect for newcomers.",
    housing: "Housing",
    housingDesc: "Find apartments and shared flats across Germany.",
    learnMore: "Learn More",
    bankingName: "N26",
    insuranceName: "Techniker Krankenkasse",
    mobileName: "Fraenk",
    housingName: "WG-Gesucht",
    disclaimer: "Some links may be affiliate links. We only recommend services we trust.",
    recommended: "Recommended",
    visitSite: "Visit Site",
    sponsored: "Sponsored",
  },
  support: {
    title: "Support Germany Guide",
    subtitle: "Help us keep this app free and accessible for everyone",
    tipAmount: "Tip Amount",
    customAmount: "Custom Amount",
    sendTip: "Send Tip",
    thankYouTitle: "Thank You!",
    thankYouDesc: "Your support helps us keep Germany Guide free for everyone.",
  },
  ads: {
    sponsoredContent: "Sponsored Content",
    hideAds: "Hide ads with Premium",
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: January 2025",
    intro: "Your privacy is important to us. This policy explains how we collect, use, and protect your personal data.",
    section1Title: "Data We Collect",
    section1Content: "We collect your email address, name, visa information, and usage data to provide our services. We do not sell your personal data to third parties.",
    section2Title: "How We Use Your Data",
    section2Content: "Your data is used to personalize your experience, send important reminders, and improve our services. We process data based on your consent and legitimate interest.",
    section3Title: "Data Storage",
    section3Content: "Your data is stored securely on servers within the European Union using Supabase infrastructure. We implement industry-standard security measures.",
    section4Title: "Your Rights",
    section4Content: "Under GDPR, you have the right to access, correct, delete, or export your data. You can delete your account at any time from the Settings page.",
    section5Title: "Contact",
    section5Content: "For privacy-related questions, contact us at privacy@germany-guide.app.",
    section7Title: "Cookies",
    section7Content: "We use essential cookies for authentication and preferences. We use Google AdSense which may set advertising cookies. You can manage cookie preferences through your browser settings.",
    section8Title: "Third-Party Services",
    section8Content: "We use Supabase for authentication and data storage, Stripe for payment processing, Resend for email notifications, and Google AdSense for advertising. Each service has its own privacy policy.",
    section9Title: "Data Retention",
    section9Content: "We retain your data for as long as your account is active. When you delete your account, all personal data is permanently removed within 30 days.",
    section10Title: "Changes to This Policy",
    section10Content: "We may update this privacy policy from time to time. We will notify you of any significant changes via email or in-app notification.",
    section6Title: "Your Choices",
    section6Content: "You can update your personal information, change your language preference, or delete your account at any time from the Settings page.",
    contactEmail: "privacy@germany-guide.app",
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "Last updated: January 2025",
    intro: "By using Germany Guide, you agree to these terms of service.",
    section1Title: "Service Description",
    section1Content: "Germany Guide provides informational guides and tools to help migrants navigate German bureaucracy. We are not a law firm and do not provide legal advice.",
    section2Title: "User Accounts",
    section2Content: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.",
    section3Title: "Free and Premium Plans",
    section3Content: "Free users have access to limited features. Premium subscribers get unlimited access. Subscriptions auto-renew unless cancelled.",
    section4Title: "Acceptable Use",
    section4Content: "You agree not to misuse our services, attempt to access other users data, or use the platform for illegal activities.",
    section5Title: "Limitation of Liability",
    section5Content: "Germany Guide provides information as-is. We are not responsible for decisions made based on our guides. Always verify information with official sources.",
    section6Title: "Changes to Terms",
    section6Content: "We may update these terms from time to time. Continued use of the service constitutes acceptance of updated terms.",
    terms: "Terms of Service",
    section7Title: "Intellectual Property",
    section7Content: "All content, design, and code of Germany Guide are protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.",
    section8Title: "Payment Terms",
    section8Content: "Premium subscriptions are billed monthly or yearly via Stripe. You can cancel anytime. Refunds are handled on a case-by-case basis.",
    section9Title: "Privacy",
    section9Content: "Your use of Germany Guide is also governed by our Privacy Policy. By using our service, you consent to our data practices as described therein.",
    section10Title: "Termination",
    section10Content: "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from the Settings page.",
    section11Title: "Governing Law",
    section11Content: "These terms are governed by the laws of the Federal Republic of Germany. Any disputes shall be resolved in the courts of Berlin, Germany.",
    section12Title: "Contact",
    section12Content: "For questions about these terms, contact us at legal@germany-guide.app.",
  },
  about: {
    title: "About Germany Guide",
    subtitle: "Helping migrants and students navigate German bureaucracy",
    missionTitle: "Our Mission",
    missionContent: "We believe that navigating German bureaucracy should not be a barrier to building a life in Germany. Our mission is to make the process transparent, accessible, and less stressful for everyone.",
    storyTitle: "Our Story",
    storyContent: "Germany Guide was created by an international student who experienced firsthand the challenges of German bureaucracy. What started as personal notes became a comprehensive guide used by thousands.",
    featuresTitle: "What We Offer",
    feature1: "Step-by-step guides tailored to your visa type",
    feature2: "Document tracking with expiry reminders",
    feature3: "Deadline management with email notifications",
    feature4: "Support in 11 languages with native-quality translations",
    feature1Title: "Smart Flow Engine",
    feature1Desc: "Personalized step-by-step guides based on your visa type.",
    feature2Title: "Document Tracking",
    feature2Desc: "Keep all your important documents organized with expiry alerts.",
    feature3Title: "Deadline Reminders",
    feature3Desc: "Never miss an important date or appointment.",
    feature4Title: "11 Languages",
    feature4Desc: "Use the app in your native language.",
    contactTitle: "Contact Us",
    contactContent: "Have questions, suggestions, or feedback? We would love to hear from you.",
    contactEmail: "contact@germany-guide.app",
    whatWeDoTitle: "What We Do",
    whatWeDoContent: "We provide step-by-step guides, document tracking, and deadline management tools to help you navigate every aspect of German bureaucracy.",
    whoWeAreTitle: "Who We Are",
    whoWeAreContent: "We are a team of former international students and migrants who experienced the challenges of German bureaucracy firsthand.",
    ctaTitle: "Start Your Journey",
    ctaContent: "Join thousands of migrants and students who are navigating German bureaucracy with confidence.",
    ctaButton: "Get Started Free",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    accountInfo: "Account Information",
    profileSection: "Profile",
    changePassword: "Change Password",
    updatePassword: "Update Password",
    passwordChanged: "Password updated successfully!",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
    deleteAccountDesc: "Permanently delete your account and all associated data. This action cannot be undone.",
    deleteAccountConfirmTitle: "Delete Your Account?",
    deleteAccountWarning: "This will permanently delete:",
    deleteItem1: "Your profile and personal information",
    deleteItem2: "All tracked documents",
    deleteItem3: "All active guides and progress",
    deleteItem4: "All deadlines and reminders",
    deleteItem5: "Your subscription (if any)",
    typeDeleteConfirm: "DELETE",
    toConfirm: "to confirm",
    confirmDelete: "Permanently Delete Account",
    plan: "Plan",
    memberSince: "Member since",
    ok: "OK",
  },
  verification: {
    bannerTitle: "Email not verified",
    bannerDesc: "Please check your email and click the verification link to access all features.",
    resendButton: "Resend email",
    sentButton: "Email sent!",
    resent: "Verification email has been resent.",
    checkEmailTitle: "Check Your Email",
    checkEmailDesc: "We have sent a verification link to your email address.",
    checkEmailHint: "Click the link in the email to verify your account and start using Germany Guide.",
    verified: "Verified",
    notVerified: "Not verified",
  },
  guides: {
    sectionTitle: "Free Germany Guides",
    sectionSubtitle: "Detailed, step-by-step guides covering every aspect of life in Germany. Written by expats, updated for 2025.",
    viewAll: "View All Guides",
    minRead: "min read",
    guide1Category: "City Registration",
    guide1Title: "Anmeldung: The Complete Guide to City Registration in Germany (2025)",
    guide1Desc: "Everything you need to know about registering your address in Germany. Step-by-step Anmeldung guide with required documents, deadlines, and city-specific tips.",
    guide1Time: "12",
    guide2Category: "Insurance",
    guide2Title: "Health Insurance in Germany: Public vs Private, How to Choose (2025)",
    guide2Desc: "Complete guide to German health insurance for expats and students. Understand GKV vs PKV, costs, coverage, and how to sign up for the right insurance.",
    guide2Time: "14",
    guide3Category: "Banking & Finance",
    guide3Title: "How to Open a Bank Account in Germany: Traditional vs Digital Banks (2025)",
    guide3Desc: "Step-by-step guide to opening a German bank account as an expat. Compare N26, DKB, Commerzbank, Deutsche Bank and find the best option for your situation.",
    guide3Time: "11",
    guide4Category: "Housing",
    guide4Title: "Finding an Apartment in Germany: Complete Housing Guide for Expats (2025)",
    guide4Desc: "How to find and rent an apartment in Germany. Navigate WG-Gesucht, ImmoScout24, understand rental contracts, avoid scams, and know your rights as a tenant.",
    guide4Time: "15",
    guide5Category: "Visa & Residence Permits",
    guide5Title: "EU Blue Card Germany: Requirements, Application Process & Benefits (2025)",
    guide5Desc: "Complete guide to the EU Blue Card for skilled workers in Germany. Salary thresholds, eligible professions, application process, and path to permanent residency.",
    guide5Time: "13",
    guide6Category: "Education",
    guide6Title: "Student Visa for Germany: Complete Application Guide (2025)",
    guide6Desc: "How to get a German student visa. Requirements, blocked account, health insurance, university admission, and step-by-step application process for international students.",
    guide6Time: "13",
  },
  faq: {
    sectionTitle: "Frequently Asked Questions",
    sectionSubtitle: "Common questions about moving to and living in Germany",
    q1: "What is the first thing I should do when I arrive in Germany?",
    a1: "The very first thing you should do is register your address (Anmeldung) at your local city registration office. You must do this within 14 days of moving into your apartment. You will need your passport, rental contract, and a completed registration form (Anmeldeformular). This registration is required for almost everything else: opening a bank account, getting health insurance, and applying for a residence permit.",
    q2: "Do I need to speak German to navigate bureaucracy?",
    a2: "While many offices in larger cities have some English-speaking staff, most German bureaucracy is conducted in German. Official forms and letters are almost always in German. Our app helps by providing step-by-step guides in 11 languages, but we recommend learning basic German phrases and bringing a German-speaking friend to important appointments.",
    q3: "How long does it take to get a residence permit?",
    a3: "Processing times vary significantly by city and permit type. In Berlin, it can take 2-4 months or more. In smaller cities, it might take 2-6 weeks. The EU Blue Card is often processed faster (2-4 weeks in some cities). We recommend applying as early as possible and booking your appointment well in advance.",
    q4: "Is health insurance mandatory in Germany?",
    a4: "Yes, health insurance is mandatory for everyone living in Germany. You must choose between public health insurance (GKV) and private health insurance (PKV). Students and employees earning under the threshold must use public insurance. You cannot register your address or get a visa without proof of health insurance.",
    q5: "How much money do I need to live in Germany?",
    a5: "Living costs vary by city. Munich and Frankfurt are the most expensive, while cities in eastern Germany are more affordable. As a rough guide: rent (400-1,200 per month), health insurance (110-400 per month), food (200-350 per month), transportation (49 per month for the Deutschlandticket), and miscellaneous (150-300 per month). Students need to prove at least 11,208 per year in a blocked account.",
    q6: "What is a blocked account (Sperrkonto)?",
    a6: "A blocked account (Sperrkonto) is a special bank account required for student visa applicants. It proves you have enough funds to support yourself in Germany. As of 2025, you need to deposit 11,208 euros (equivalent to 934 per month for 12 months). You can only withdraw a fixed monthly amount. Popular providers include Expatrio, Fintiba, and Deutsche Bank.",
    q7: "Can I work while studying in Germany?",
    a7: "Yes, international students can work up to 120 full days or 240 half days per year without additional work permits. Working student positions (Werkstudent) are popular and let you work up to 20 hours per week during semester. During semester breaks, you can work full-time. If you want to work more, you need permission from the Federal Employment Agency and the foreigners authority.",
    q8: "Is the Germany Guide app free?",
    a8: "Yes! The core features of our app are completely free: step-by-step guides for common processes, document tracking (up to 10 documents), deadline reminders, and support in 11 languages. Our Premium plan (4.99 per month or 39.99 per year) unlocks unlimited documents, unlimited guides, PDF export, priority support, and an ad-free experience.",
  },
};

export default en;