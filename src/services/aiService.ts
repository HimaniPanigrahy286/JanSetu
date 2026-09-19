import type { AIAnalysis, Category, Severity } from '../types';

interface LanguageMap {
  [key: string]: { name: string; sample: string; translation: string };
}

const LANGUAGE_PATTERNS: LanguageMap = {
  odia: {
    name: 'Odia',
    sample: 'ଆମ ଗାଁକୁ ଭଲ ରାସ୍ତା ନାହିଁ।',
    translation: 'There is no proper road to our village.',
  },
  hindi: {
    name: 'Hindi',
    sample: 'हमारे गांव में साफ पानी नहीं है।',
    translation: 'There is no clean water in our village.',
  },
  bengali: {
    name: 'Bengali',
    sample: 'আমাদের গ্রামে বিদ্যুৎ নেই।',
    translation: 'There is no electricity in our village.',
  },
  tamil: {
    name: 'Tamil',
    sample: 'எங்கள் கிராமத்தில் சாலை இல்லை.',
    translation: 'There is no road in our village.',
  },
};

const CATEGORY_KEYWORDS: { keywords: string[]; category: Category; subcategory: string }[] = [
  { keywords: ['road', 'street', 'highway', 'path', 'bridge', 'rasta', 'raasta', 'sadak'], category: 'Roads', subcategory: 'Road Infrastructure' },
  { keywords: ['water', 'drinking', 'pipeline', 'supply', 'pani', 'jal', 'tap'], category: 'Water', subcategory: 'Water Supply' },
  { keywords: ['electricity', 'power', 'light', 'current', 'bijli', 'transformer'], category: 'Electricity', subcategory: 'Power Supply' },
  { keywords: ['hospital', 'health', 'doctor', 'clinic', 'medical', 'medicine', 'healthcare'], category: 'Healthcare', subcategory: 'Healthcare Access' },
  { keywords: ['school', 'education', 'college', 'teacher', 'student', 'study'], category: 'Education', subcategory: 'Education Infrastructure' },
  { keywords: ['bus', 'transport', 'vehicle', 'auto', 'train', 'metro'], category: 'Transport', subcategory: 'Public Transport' },
  { keywords: ['toilet', 'sanitation', 'sewage', 'drainage', 'garbage', 'waste'], category: 'Sanitation', subcategory: 'Sanitation Facilities' },
  { keywords: ['internet', 'network', 'digital', 'connectivity', 'wifi', 'broadband'], category: 'Digital Infrastructure', subcategory: 'Digital Connectivity' },
  { keywords: ['park', 'ground', 'facility', 'community', 'public', 'building'], category: 'Public Facilities', subcategory: 'Community Facilities' },
];

const SEVERITY_KEYWORDS: { keywords: string[]; severity: Severity }[] = [
  { keywords: ['emergency', 'death', 'dying', 'critical', 'urgent', 'life', 'hospital', 'accident'], severity: 'critical' },
  { keywords: ['no', 'not', 'without', 'lack', 'missing', 'broken', 'damaged', 'severe', 'problem'], severity: 'high' },
  { keywords: ['poor', 'bad', 'issue', 'concern', 'need', 'require', 'improve'], severity: 'medium' },
  { keywords: ['better', 'enhance', 'upgrade', 'request', 'suggest'], severity: 'low' },
];

function detectCategory(text: string): { category: Category; subcategory: string } {
  const lower = text.toLowerCase();
  for (const item of CATEGORY_KEYWORDS) {
    if (item.keywords.some(k => lower.includes(k))) {
      return { category: item.category, subcategory: item.subcategory };
    }
  }
  return { category: 'Roads', subcategory: 'General Infrastructure' };
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

function generateSummary(text: string, category: Category, severity: Severity): string {
  const templates: Record<Category, string[]> = {
    'Roads': [
      `Road infrastructure deficit identified in the reported area. Citizen reports indicate ${severity} impact on connectivity and access to essential services.`,
      `Poor road connectivity is critically affecting daily commute and access to healthcare and markets in the reported location.`,
    ],
    'Water': [
      `Significant water supply deficit detected. Citizens are experiencing ${severity} disruption to clean water access, posing public health risks.`,
      `Clean drinking water shortage is affecting the reported community, requiring immediate infrastructure intervention.`,
    ],
    'Electricity': [
      `Power supply irregularity identified with ${severity} impact on livelihoods, education, and economic activity in the area.`,
      `Electricity deficit is severely disrupting daily life, education, and small businesses in the reported locality.`,
    ],
    'Healthcare': [
      `Healthcare access gap identified. The reported area shows ${severity} deficiency in medical facilities and services.`,
      `Inadequate healthcare infrastructure is putting lives at risk. Immediate attention to facility improvement is recommended.`,
    ],
    'Education': [
      `Education infrastructure gap detected with ${severity} impact on learning outcomes in the reported community.`,
      `Poor educational facilities are hampering quality learning for children in the affected area.`,
    ],
    'Transport': [
      `Public transport deficit identified, affecting mobility and economic access for residents of the reported area.`,
      `Inadequate transport connectivity is limiting economic opportunities and access to services for the community.`,
    ],
    'Sanitation': [
      `Sanitation and waste management deficit detected with ${severity} public health implications in the reported area.`,
      `Poor sanitation infrastructure poses significant health risks to the community and requires urgent intervention.`,
    ],
    'Digital Infrastructure': [
      `Digital connectivity gap identified, limiting access to digital services, e-governance, and economic opportunities.`,
      `Insufficient digital infrastructure is excluding the community from digital economy and government e-services.`,
    ],
    'Public Facilities': [
      `Public facility deficit detected in the reported area with ${severity} impact on community well-being.`,
      `Inadequate public facilities are affecting quality of life and community cohesion in the reported locality.`,
    ],
  };

  const options = templates[category];
  return options[Math.floor(Math.random() * options.length)];
}

export const aiService = {
  async analyzeText(text: string, language: string = 'English'): Promise<AIAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { category, subcategory } = detectCategory(text);
    const severity = detectSeverity(text);
    const summary = generateSummary(text, category, severity);

    const keywords = text
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 5);

    return {
      detectedLanguage: language,
      originalText: text,
      translatedText: language === 'English' ? text : `[Translated from ${language}]: ${text}`,
      category,
      subcategory,
      severity,
      summary,
      confidence: 0.85 + Math.random() * 0.12,
      keywords,
    };
  },

  async analyzeVoice(language: string): Promise<{
    transcription: string;
    translation: string;
    analysis: AIAnalysis;
  }> {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const langKey = language.toLowerCase();
    const langData = LANGUAGE_PATTERNS[langKey] || LANGUAGE_PATTERNS['odia'];

    const analysis: AIAnalysis = {
      detectedLanguage: langData.name,
      originalText: langData.sample,
      translatedText: langData.translation,
      category: 'Roads',
      subcategory: 'Rural Road Connectivity',
      severity: 'high',
      summary: 'Poor road connectivity is critically affecting access to essential services in the reported village. High citizen demand indicates urgent infrastructure intervention is needed.',
      confidence: 0.92,
      keywords: ['road', 'village', 'connectivity', 'access', 'infrastructure'],
    };

    return {
      transcription: langData.sample,
      translation: langData.translation,
      analysis,
    };
  },

  generateRecommendation(region: string, requests: number, population: number): string {
    return `Consider prioritizing infrastructure investment in ${region} based on ${requests.toLocaleString()} citizen requests affecting approximately ${population.toLocaleString()} people. Analysis indicates significant infrastructure gaps that require coordinated government intervention across multiple sectors.`;
  },
};
