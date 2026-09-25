import type { AIAnalysis, Category, Severity } from '../types';

interface LanguageMap {
  [key: string]: { name: string; sample: string; translation: string };
}

const LANGUAGE_PATTERNS: LanguageMap = {
  odia: {
    name: 'Odia',
    sample: 'ଆମ ଗାଁକୁ ଭଲ ରାସ୍ତା ନାହିଁ ଏବଂ ପିଇବା ପାଣି ପାଇପ୍ ଭାଙ୍ଗିଯାଇଛି।',
    translation: 'There is no proper road to our village and the drinking water pipeline is broken.',
  },
  hindi: {
    name: 'Hindi',
    sample: 'हमारे गांव में पीने का साफ पानी नहीं है और स्ट्रीटलाइट खराब हैं।',
    translation: 'There is no clean drinking water in our village and streetlights are broken.',
  },
  bengali: {
    name: 'Bengali',
    sample: 'আমাদের গ্রামে ড্রেনেজ বন্ধ থাকায় রাস্তায় জল জমে যাচ্ছে।',
    translation: 'In our village, blocked drains are causing severe water stagnation on the road.',
  },
  tamil: {
    name: 'Tamil',
    sample: 'எங்கள் பகுதியில் சாலைகள் பழுதடைந்துள்ளன, குடிநீர் தட்டுப்பாடு உள்ளது.',
    translation: 'Roads in our area are severely damaged and there is a drinking water shortage.',
  },
  telugu: {
    name: 'Telugu',
    sample: 'మా గ్రామంలో రోడ్డు సరిగా లేదు మరియు విద్యుత్ కోతలు ఎక్కువగా ఉన్నాయి.',
    translation: 'In our village roads are in bad shape and electricity cuts are frequent.',
  },
  english: {
    name: 'English',
    sample: 'The main connecting road has severe craters and ambulances cannot reach.',
    translation: 'The main connecting road has severe craters and ambulances cannot reach.',
  },
};

const CATEGORY_KEYWORDS: { keywords: string[]; category: Category; subcategory: string }[] = [
  {
    keywords: ['road', 'street', 'highway', 'path', 'pothole', 'bridge', 'rasta', 'raasta', 'sadak', 'crater', 'asphalt'],
    category: 'Roads',
    subcategory: 'Road Surface & Connectivity',
  },
  {
    keywords: ['water', 'drinking', 'pipeline', 'supply', 'pani', 'jal', 'tap', 'borewell', 'chlorination', 'contamination'],
    category: 'Water',
    subcategory: 'Piped Water Supply & Quality',
  },
  {
    keywords: ['light', 'streetlight', 'lamp', 'dark', 'bulb', 'led', 'pole', 'batti'],
    category: 'Streetlights',
    subcategory: 'Public Safety Streetlighting',
  },
  {
    keywords: ['drain', 'drainage', 'gutter', 'waterlogging', 'flood', 'sewage', 'clogged', 'nala', 'naala', 'overflow'],
    category: 'Drainage',
    subcategory: 'Stormwater Drainage & Flood Control',
  },
  {
    keywords: ['bus', 'transport', 'commute', 'route', 'traffic', 'vehicle', 'transit', 'stop', 'stand'],
    category: 'Public Transport',
    subcategory: 'Public Bus & Commuter Transit',
  },
  {
    keywords: ['hospital', 'health', 'doctor', 'clinic', 'phc', 'medicine', 'school', 'classroom', 'teacher', 'ambulance', 'nurse'],
    category: 'Schools & Hospitals',
    subcategory: 'Healthcare & Educational Infrastructure',
  },
  {
    keywords: ['electricity', 'power', 'current', 'bijli', 'voltage', 'transformer', 'wire', 'blackout', 'outage'],
    category: 'Electricity',
    subcategory: 'Power Grid & Microgrid Distribution',
  },
  {
    keywords: ['garbage', 'trash', 'waste', 'dump', 'sanitation', 'clean', 'toilet', 'kachra'],
    category: 'Sanitation',
    subcategory: 'Solid Waste & Public Sanitation',
  },
  {
    keywords: ['internet', 'network', 'digital', 'wifi', 'broadband', 'tower', 'connectivity', 'mobile'],
    category: 'Digital Infrastructure',
    subcategory: 'Broadband & Digital Tower Coverage',
  },
];

const SEVERITY_KEYWORDS: { keywords: string[]; severity: Severity }[] = [
  { keywords: ['emergency', 'death', 'dying', 'critical', 'urgent', 'life', 'hospital', 'accident', 'ambulance', 'fatal'], severity: 'critical' },
  { keywords: ['no', 'not', 'without', 'lack', 'broken', 'damaged', 'severe', 'problem', 'danger', 'contaminated'], severity: 'high' },
  { keywords: ['poor', 'bad', 'issue', 'concern', 'need', 'require', 'improve', 'repair', 'irregular'], severity: 'medium' },
  { keywords: ['better', 'enhance', 'upgrade', 'request', 'suggest', 'maintenance'], severity: 'low' },
];

function detectCategory(text: string): { category: Category; subcategory: string } {
  const lower = text.toLowerCase();
  for (const item of CATEGORY_KEYWORDS) {
    if (item.keywords.some(k => lower.includes(k))) {
      return { category: item.category, subcategory: item.subcategory };
    }
  }
  return { category: 'Other Development', subcategory: 'Community Public Infrastructure' };
}

function detectSeverity(text: string): Severity {
  const lower = text.toLowerCase();
  for (const item of SEVERITY_KEYWORDS) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.severity;
    }
  }
  return 'medium';
}

function generateSummary(category: Category, severity: Severity): string {
  const templates: Record<Category, string[]> = {
    Roads: [
      `Critical road connectivity and surface fracture reported. High potential of vehicular damage and access barriers to essential facilities (${severity} urgency).`,
      `Severe transit impairment detected on public thoroughfare requiring prompt structural resurfacing.`,
    ],
    Water: [
      `Significant drinking water supply outage detected. Poses immediate sanitation risk to households in the reported ward (${severity} urgency).`,
      `Pipeline breach impacting local drinking supply; emergency mobile tankers and valve repair recommended.`,
    ],
    Streetlights: [
      `Public lighting failure compromising nighttime visibility and pedestrian safety along the reported transit sector.`,
      `Multi-fixture streetlighting outage reported; circuit breaker assessment and LED replacement queued.`,
    ],
    Drainage: [
      `Stormwater drain blockage and urban stagnation identified with elevated flood risk during precipitation (${severity} severity).`,
      `Clogged arterial drainage causing water accumulation; de-silting and culvert clearance required.`,
    ],
    'Public Transport': [
      `Commuter transit deficit identified. Lack of reliable public bus frequencies impacting workers and students.`,
      `Feeder public transport gap reported; recommendation to augment schedule frequency during peak hours.`,
    ],
    'Schools & Hospitals': [
      `Critical public institutional facility gap detected in healthcare/education provision for the community.`,
      `Inadequate facility infrastructure reported; intervention recommended to ensure uninterrupted citizen services.`,
    ],
    Electricity: [
      `Power distribution irregularity and transformer strain identified with direct impact on livelihoods and agriculture.`,
      `Low voltage and unscheduled outages detected; transformer reinforcement required.`,
    ],
    Sanitation: [
      `Solid waste accumulation and sanitation deficit with public health implications in the residential locality.`,
      `Waste disposal and sanitation infrastructure maintenance needed to restore environmental standards.`,
    ],
    'Digital Infrastructure': [
      `Digital connectivity barrier identified, restricting citizen access to digital governance and e-services.`,
    ],
    'Other Development': [
      `Community infrastructure defect logged and categorized for municipal engineering review.`,
    ],
  };

  const options = templates[category] || templates['Other Development'];
  return options[Math.floor(Math.random() * options.length)];
}

export const aiService = {
  async analyzeText(text: string, language: string = 'English'): Promise<AIAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 1400));

    const { category, subcategory } = detectCategory(text);
    const severity = detectSeverity(text);
    const summary = generateSummary(category, severity);

    const keywords = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 6);

    return {
      detectedLanguage: language,
      originalText: text,
      translatedText: language === 'English' ? text : `[AI Multilingual NLP]: ${text}`,
      category,
      subcategory,
      severity,
      summary,
      confidence: Number((0.91 + Math.random() * 0.08).toFixed(2)),
      keywords: keywords.length > 0 ? keywords : [category.toLowerCase(), 'infrastructure', 'civic'],
      duplicateClusterCount: Math.floor(18 + Math.random() * 85),
    };
  },

  async analyzeVoice(languageKey: string): Promise<{
    transcription: string;
    translation: string;
    analysis: AIAnalysis;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1600));

    const key = languageKey.toLowerCase();
    const langData = LANGUAGE_PATTERNS[key] || LANGUAGE_PATTERNS['odia'];

    const { category, subcategory } = detectCategory(langData.translation);
    const severity = detectSeverity(langData.translation);
    const summary = generateSummary(category, severity);

    const analysis: AIAnalysis = {
      detectedLanguage: langData.name,
      originalText: langData.sample,
      translatedText: langData.translation,
      category,
      subcategory,
      severity,
      summary,
      confidence: 0.95,
      keywords: ['voice', category.toLowerCase(), 'village', 'connectivity', 'urgent'],
      duplicateClusterCount: Math.floor(24 + Math.random() * 60),
    };

    return {
      transcription: langData.sample,
      translation: langData.translation,
      analysis,
    };
  },
};
