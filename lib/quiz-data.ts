export interface QuizQuestion {
  id: string;
  category: 'gk' | 'management' | 'networking' | 'telecom' | 'constitution';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ─── General Knowledge & Nepal ─────────────────────────────────────
  { id: 'gk-1', category: 'gk', question: 'Nepal ko sambidhan kun sal ma jari bhayeko ho?', options: ['2072 BS', '2070 BS', '2075 BS', '2068 BS'], correctIndex: 0, explanation: '2072 Asoj 3 gate Nepal ko sambidhan jari bhayeko ho.' },
  { id: 'gk-2', category: 'gk', question: 'Nepal ma kati wata pradesh chhan?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'Nepal ma 7 wata pradesh chhan.' },
  { id: 'gk-3', category: 'gk', question: 'Nepal ko rashtrapati ko karyakal kati barsha huncha?', options: ['4 barsha', '5 barsha', '6 barsha', '3 barsha'], correctIndex: 1 },
  { id: 'gk-4', category: 'gk', question: 'Nepal Telecom (NTC) kun sal ma sthapit bhayeko ho?', options: ['2032 BS', '2060 BS', '2042 BS', '2052 BS'], correctIndex: 0, explanation: 'Nepal Telecom 2032 BS ma sthapit bhayeko ho.' },
  { id: 'gk-5', category: 'gk', question: 'Nepal ko sabse uchho shikhar kun ho?', options: ['Kanchenjunga', 'Lhotse', 'Sagarmatha', 'Makalu'], correctIndex: 2 },
  { id: 'gk-6', category: 'gk', question: 'Nepal ko GDP ma sabse badi yogdan kun sector ko cha?', options: ['Agriculture', 'Industry', 'Service', 'Tourism'], correctIndex: 2, explanation: 'Service sector le Nepal ko GDP ma lagbhag 60% yogdan garcha.' },
  { id: 'gk-7', category: 'gk', question: 'Lok Sewa Aayog Nepal kun article anusar sthapit cha?', options: ['Article 242', '243', '244', '245'], correctIndex: 0 },
  { id: 'gk-8', category: 'gk', question: 'Nepal ko current population (2081 estimate) lagbhag kati cha?', options: ['25 million', '28 million', '30 million', '32 million'], correctIndex: 2 },
  { id: 'gk-9', category: 'gk', question: 'SDG (Sustainable Development Goals) ma kati wata goals chhan?', options: ['15', '17', '20', '12'], correctIndex: 1 },
  { id: 'gk-10', category: 'gk', question: 'Nepal ma Internet service pahilo palta kahile suru bhayo?', options: ['2051 BS', '2052 BS', '2050 BS', '2055 BS'], correctIndex: 0, explanation: 'Mercantile Communications le 2051 BS ma email service suru gareko thiyo.' },

  // ─── NTC Management & Telecom ──────────────────────────────────────
  { id: 'mgmt-1', category: 'management', question: 'NTC ko full form ke ho?', options: ['Nepal Telecom Corporation', 'Nepal Telecommunications Corporation', 'National Telecom Company', 'Nepal Telephone Company'], correctIndex: 0 },
  { id: 'mgmt-2', category: 'management', question: 'Management ko POSDCORB framework ma "P" le ke janauchha?', options: ['Planning', 'Programming', 'Processing', 'Producing'], correctIndex: 0, explanation: 'POSDCORB = Planning, Organizing, Staffing, Directing, Coordinating, Reporting, Budgeting' },
  { id: 'mgmt-3', category: 'management', question: 'Nepal Telecom ko current mobile subscriber base lagbhag kati cha?', options: ['10 million', '15 million', '20 million', '25 million'], correctIndex: 2 },
  { id: 'mgmt-4', category: 'management', question: 'SWOT analysis ma "T" le ke janauchha?', options: ['Technology', 'Threats', 'Targets', 'Trends'], correctIndex: 1 },
  { id: 'mgmt-5', category: 'management', question: 'Nepal ma Telecom Authority (NTA) kun barsha sthapit bhayo?', options: ['2054 BS', '2055 BS', '2053 BS', '2056 BS'], correctIndex: 0 },
  { id: 'mgmt-6', category: 'management', question: 'Henri Fayol le management ko kati wata principles diyeka chhan?', options: ['10', '12', '14', '16'], correctIndex: 2 },
  { id: 'mgmt-7', category: 'management', question: 'NTC le 4G/LTE service Nepal ma kahile launch garyo?', options: ['2073 BS', '2074 BS', '2075 BS', '2076 BS'], correctIndex: 1 },
  { id: 'mgmt-8', category: 'management', question: 'Public procurement act Nepal ma kun sal ma aayo?', options: ['2063 BS', '2064 BS', '2065 BS', '2066 BS'], correctIndex: 0 },
  { id: 'mgmt-9', category: 'management', question: 'MBO (Management by Objectives) ko concept kasle diyeko ho?', options: ['Peter Drucker', 'Henri Fayol', 'Frederick Taylor', 'Max Weber'], correctIndex: 0 },
  { id: 'mgmt-10', category: 'management', question: 'Nepal ko IT Policy pahilo palta kun sal ma aayo?', options: ['2057 BS', '2060 BS', '2067 BS', '2070 BS'], correctIndex: 1 },
  { id: 'mgmt-11', category: 'management', question: 'Maslow ko Hierarchy of Needs ma kati taha chhan?', options: ['3', '4', '5', '6'], correctIndex: 2 },
  { id: 'mgmt-12', category: 'management', question: 'E-governance master plan Nepal ma kun sal ma tayar bhayo?', options: ['2063 BS', '2065 BS', '2067 BS', '2070 BS'], correctIndex: 0 },
  { id: 'mgmt-13', category: 'management', question: 'NTC ko fiber optic network ko total length lagbhag kati km cha?', options: ['15,000 km', '20,000 km', '30,000 km', '40,000 km'], correctIndex: 2 },
  { id: 'mgmt-14', category: 'management', question: 'Good governance ko key principles ma kun pardaina?', options: ['Transparency', 'Accountability', 'Profitability', 'Rule of Law'], correctIndex: 2 },
  { id: 'mgmt-15', category: 'management', question: 'Nepal Digital Framework kun barsha ma aayo?', options: ['2076 BS', '2077 BS', '2078 BS', '2079 BS'], correctIndex: 0 },
];

export const QUIZ_CATEGORIES = [
  { id: 'gk', label: 'General Knowledge', emoji: '🌍', color: '#1D9E75' },
  { id: 'management', label: 'NTC Management', emoji: '📊', color: '#E67E22' },
] as const;
