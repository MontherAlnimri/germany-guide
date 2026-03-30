/**
 * Maps blog post slugs to base_flow title keywords.
 * Used to bridge the guide system to the flow system.
 * The hook searches base_flows where title ILIKE the keyword.
 */
export const GUIDE_FLOW_MAP: Record<string, { flowKeyword: string; visaTypeFilter?: string }> = {
  "anmeldung-city-registration-guide": { flowKeyword: "registration" },
  "german-health-insurance-guide": { flowKeyword: "health insurance" },
  "opening-bank-account-germany": { flowKeyword: "bank" },
  "finding-apartment-germany": { flowKeyword: "housing" },
  "german-blue-card-guide": { flowKeyword: "visa", visaTypeFilter: "blue_card" },
  "student-visa-germany-guide": { flowKeyword: "visa", visaTypeFilter: "student_visa" },
  "german-work-permit-guide": { flowKeyword: "work permit", visaTypeFilter: "work_permit" },
  "job-seeker-visa-germany-guide": { flowKeyword: "visa", visaTypeFilter: "job_seeker_visa" },
  "family-reunion-visa-germany-guide": { flowKeyword: "visa", visaTypeFilter: "family_reunion" },
  "freelance-visa-germany-guide": { flowKeyword: "visa", visaTypeFilter: "freelance_visa" },
  "permanent-residence-germany-guide": { flowKeyword: "residence", visaTypeFilter: "permanent_residence" },
  // These are general guides with no direct flow mapping:
  // "first-30-days-germany-checklist"
  // "german-tax-system-expats"
};
