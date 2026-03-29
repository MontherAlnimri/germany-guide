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
  'Aachen', 'Augsburg', 'Bergisch Gladbach', 'Berlin', 'Bielefeld',
  'Bochum', 'Bonn', 'Bottrop', 'Braunschweig', 'Bremen', 'Bremerhaven',
  'Chemnitz', 'Cottbus', 'Darmstadt', 'Dortmund', 'Dresden', 'Duisburg',
  'D\u00FCsseldorf', 'Erfurt', 'Erlangen', 'Essen', 'Flensburg',
  'Frankfurt am Main', 'Freiburg', 'F\u00FCrth', 'Gelsenkirchen', 'Gera',
  'Gie\u00DFen', 'G\u00F6ttingen', 'G\u00FCtersloh', 'Hagen', 'Halle (Saale)',
  'Hamburg', 'Hamm', 'Hanau', 'Hannover', 'Heidelberg', 'Heilbronn',
  'Herne', 'Hildesheim', 'Ingolstadt', 'Jena', 'Kaiserslautern',
  'Karlsruhe', 'Kassel', 'Kiel', 'Koblenz', 'Cologne', 'Krefeld',
  'Leipzig', 'Leverkusen', 'L\u00FCbeck', 'Ludwigshafen', 'Magdeburg',
  'Mainz', 'Mannheim', 'Moers', 'M\u00F6nchengladbach',
  'M\u00FClheim an der Ruhr', 'Munich', 'M\u00FCnster', 'Neuss',
  'Nuremberg', 'Oberhausen', 'Offenbach', 'Oldenburg', 'Osnabr\u00FCck',
  'Paderborn', 'Pforzheim', 'Potsdam', 'Recklinghausen', 'Regensburg',
  'Remscheid', 'Reutlingen', 'Rostock', 'Saarbr\u00FCcken', 'Salzgitter',
  'Siegen', 'Solingen', 'Stuttgart', 'Trier', 'Ulm', 'Wiesbaden',
  'Witten', 'Wolfsburg', 'Wuppertal', 'W\u00FCrzburg', 'Other',
] as const;

export const DOCUMENT_TYPES = [
  'Passport', 'Visa / Residence Permit', 'Anmeldung Confirmation',
  'Health Insurance Card', 'University Enrollment', 'Employment Contract',
  'Bank Statement', 'Rental Contract', 'Birth Certificate',
  'Marriage Certificate', 'Diploma / Degree', 'Language Certificate',
  'Tax ID (Steuer-ID)', 'Social Security Card', 'Driver License', 'Other',
] as const;

export const DOCUMENT_STATUSES = ['valid', 'pending', 'expired', 'notUploaded'] as const;