import { Prompt, Collection, User } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  emailVerified: true,
  settings: {
    language: 'en',
    theme: 'dark',
    defaultModel: 'gpt-4-turbo',
    emailNotifications: true,
  },
};

export const mockCollections: Collection[] = [
  {
    id: 'c1',
    name: 'Marketing',
    description: 'Marketing and advertising prompts',
    color: 'text-pink-500',
    icon: 'Megaphone',
    promptCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    name: 'Creative Arts',
    description: 'Art and creative content prompts',
    color: 'text-emerald-500',
    icon: 'Palette',
    promptCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    name: 'Development',
    description: 'Coding and development prompts',
    color: 'text-blue-500',
    icon: 'Code',
    promptCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockPrompts: Prompt[] = [
  {
    id: 'p1',
    title: 'Marketing Copy Generator',
    description: 'Generates high-converting ad copy for social media campaigns with customizable tone and target audience.',
    category: 'text',
    systemPrompt: `You are an expert copywriter with 10 years of experience in digital marketing.
Your goal is to write compelling ad copy for {{platform}}.

Target Audience: {{audience}}
Product: {{product_name}}
Key Benefit: {{benefit}}
Tone: {{tone}}

Guidelines:
- Keep headlines under 10 words
- Use power words that evoke emotion
- Include a clear call-to-action
- Focus on benefits, not features

Format the output with:
1. Catchy Headline
2. Body Text (max 3 sentences)
3. Call to Action`,
    userTemplate: 'Write an ad for my {{product_name}} targeting {{audience}}.',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1024,
    tags: ['marketing', 'social-media', 'copywriting'],
    collectionId: 'c1',
    favorite: true,
    createdAt: daysAgo(7),
    updatedAt: hoursAgo(2),
    status: 'active',
    currentVersionId: 'v1-3',
    versions: [
      {
        id: 'v1-3',
        promptId: 'p1',
        versionNumber: '2.0',
        systemPrompt: `You are an expert copywriter...`,
        userTemplate: 'Write an ad for my {{product_name}} targeting {{audience}}.',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 1024,
        changeNote: 'Refined the system prompt tone and added output format constraints.',
        createdAt: hoursAgo(2),
        createdBy: 'user-1',
      },
      {
        id: 'v1-2',
        promptId: 'p1',
        versionNumber: '1.2',
        systemPrompt: `You are an expert copywriter...`,
        userTemplate: 'Write an ad for my product.',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1024,
        changeNote: 'Fixed variable typo in marketing template.',
        createdAt: daysAgo(2),
        createdBy: 'user-1',
      },
      {
        id: 'v1-1',
        promptId: 'p1',
        versionNumber: '1.0',
        systemPrompt: `You are a copywriter...`,
        userTemplate: 'Write an ad.',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 512,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(7),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p2',
    title: 'Surrealist Landscape',
    description: 'Creates dreamlike landscapes in the style of Salvador Dali with melting clocks and impossible architecture.',
    category: 'image',
    systemPrompt: `A surreal landscape featuring {{subject}} floating in the sky.
The ground is made of {{material}}.
The lighting is {{lighting_style}}.
Style: Salvador Dali inspired, dreamlike, impossible geometry
Quality: High resolution, 8k, photorealistic masterpiece, ultra detailed`,
    userTemplate: '',
    model: 'dall-e-3',
    temperature: 1.0,
    maxTokens: 4000,
    tags: ['art', 'creative', 'midjourney', 'surrealism'],
    collectionId: 'c2',
    favorite: false,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    status: 'active',
    currentVersionId: 'v2-1',
    versions: [
      {
        id: 'v2-1',
        promptId: 'p2',
        versionNumber: '1.0',
        systemPrompt: `A surreal landscape...`,
        userTemplate: '',
        model: 'dall-e-3',
        temperature: 1.0,
        maxTokens: 4000,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(5),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p3',
    title: 'Python Code Refactor',
    description: 'Cleans up messy Python code and adds type hints, docstrings, and follows PEP 8 conventions.',
    category: 'text',
    systemPrompt: `You are a Senior Python Engineer with expertise in clean code practices.

Review and refactor the following code:
1. Improve readability following PEP 8 guidelines
2. Add comprehensive type hints
3. Add docstrings using Google style
4. Optimize for performance where possible
5. Identify and fix potential bugs
6. Explain your changes in comments

Code to refactor:
\`\`\`python
{{code_snippet}}
\`\`\`

Return the refactored code with inline comments explaining significant changes.`,
    userTemplate: 'Please refactor this Python code:\n```python\n{{code_snippet}}\n```',
    model: 'claude-3-sonnet',
    temperature: 0.3,
    maxTokens: 4096,
    tags: ['coding', 'python', 'productivity', 'refactoring'],
    collectionId: 'c3',
    favorite: true,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
    status: 'active',
    currentVersionId: 'v3-1',
    versions: [
      {
        id: 'v3-1',
        promptId: 'p3',
        versionNumber: '1.0',
        systemPrompt: `You are a Senior Python Engineer...`,
        userTemplate: 'Please refactor this Python code...',
        model: 'claude-3-sonnet',
        temperature: 0.3,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(10),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p4',
    title: 'Podcast Intro Script',
    description: 'Short, punchy intros for tech podcasts that hook listeners in the first 30 seconds.',
    category: 'audio',
    systemPrompt: `Write a 30-second podcast intro script.

Show Topic: {{topic}}
Host Name: {{host}}
Target Audience: Tech enthusiasts and professionals
Vibe: Energetic, futuristic, slightly playful

Structure:
1. Hook (5 seconds) - Provocative question or bold statement
2. Show Name Drop (3 seconds)
3. Host Introduction (7 seconds)
4. Episode Teaser (10 seconds)
5. Call to Action (5 seconds)

Keep it conversational and avoid clichés. Add [MUSIC CUE] and [SFX] annotations.`,
    userTemplate: 'Create an intro for a podcast about {{topic}} hosted by {{host}}.',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    maxTokens: 512,
    tags: ['podcast', 'script', 'audio'],
    collectionId: 'c1',
    favorite: false,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(5),
    status: 'active',
    currentVersionId: 'v4-1',
    versions: [
      {
        id: 'v4-1',
        promptId: 'p4',
        versionNumber: '1.0',
        systemPrompt: `Write a 30-second podcast intro script...`,
        userTemplate: 'Create an intro for a podcast...',
        model: 'gpt-4-turbo',
        temperature: 0.8,
        maxTokens: 512,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(12),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p5',
    title: 'JSON Data Extractor',
    description: 'Extracts structured data from unstructured text and returns clean, validated JSON.',
    category: 'text',
    systemPrompt: `You are a data extraction specialist. Extract structured information from the provided text.

Required fields to extract:
- name: Person or entity name
- date: Any mentioned dates (ISO format)
- location: Physical locations mentioned
- entities: Other named entities (organizations, products)
- summary: Brief 1-sentence summary

Rules:
1. Return ONLY valid JSON, no markdown formatting
2. Use null for missing fields
3. Dates must be in ISO 8601 format
4. Arrays for multiple values

Output schema:
{
  "name": string | null,
  "date": string | null,
  "location": string | null,
  "entities": string[],
  "summary": string
}`,
    userTemplate: 'Extract data from: {{text}}',
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    maxTokens: 1024,
    tags: ['utility', 'data-processing', 'json', 'extraction'],
    collectionId: 'c3',
    favorite: false,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(7),
    status: 'active',
    currentVersionId: 'v5-1',
    versions: [
      {
        id: 'v5-1',
        promptId: 'p5',
        versionNumber: '1.0',
        systemPrompt: `You are a data extraction specialist...`,
        userTemplate: 'Extract data from: {{text}}',
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
        maxTokens: 1024,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(14),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p6',
    title: 'Product Video Script',
    description: 'Creates engaging video scripts for product demos and promotional content.',
    category: 'video',
    systemPrompt: `Write a compelling 60-second product video script.

Product: {{product_name}}
Key Features: {{features}}
Target Audience: {{audience}}
Video Style: {{style}}

Structure:
[0-5s] HOOK - Attention-grabbing opening
[5-15s] PROBLEM - Relatable pain point
[15-35s] SOLUTION - Product introduction and key features
[35-50s] BENEFITS - Emotional and practical benefits
[50-60s] CTA - Clear call to action

Include:
- Visual directions in [BRACKETS]
- Voice-over text in regular format
- Music/mood suggestions
- B-roll suggestions`,
    userTemplate: 'Create a video script for {{product_name}}.',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    tags: ['video', 'script', 'marketing', 'product'],
    collectionId: 'c1',
    favorite: false,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    status: 'active',
    currentVersionId: 'v6-1',
    versions: [
      {
        id: 'v6-1',
        promptId: 'p6',
        versionNumber: '1.0',
        systemPrompt: `Write a compelling 60-second product video script...`,
        userTemplate: 'Create a video script for {{product_name}}.',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2048,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(3),
        createdBy: 'user-1',
      },
    ],
  },
];
