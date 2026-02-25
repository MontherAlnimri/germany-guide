export const VISA_TYPES = [
  'student_visa',
  'job_seeker_visa',
  'blue_card',
  'work_permit',
  'family_reunion',
  'freelance_visa',
  'permanent_residence',
  'other',
] as const;

export const APPLICATION_TYPES = ['first', 'renewal'] as const;

export const GERMAN_CITIES = [
  'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart',
  'D\u00FCsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden',
  'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld',
  'Bonn', 'Mannheim', 'Karlsruhe', 'Augsburg', 'Wiesbaden', 'Aachen',
  'Heidelberg', 'Freiburg', 'Other',
] as const;

export const DOCUMENT_TYPES = [
  'Passport', 'Visa / Residence Permit', 'Anmeldung Confirmation',
  'Health Insurance Card', 'University Enrollment', 'Employment Contract',
  'Bank Statement', 'Rental Contract', 'Birth Certificate',
  'Marriage Certificate', 'Diploma / Degree', 'Language Certificate',
  'Tax ID (Steuer-ID)', 'Social Security Card', 'Driver License', 'Other',
] as const;

export const DOCUMENT_STATUSES = ['valid', 'pending', 'expired', 'notUploaded'] as const;