/**
 * Mock Data
 * 完整的模拟数据集，用于开发和测试
 */

import type { Prompt, Collection, User, ShareRecord, MyShareRecord } from '@/types';

// ============ 时间工具函数 ============

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
const daysLater = (d: number) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

// ============ Mock User ============

export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  createdAt: daysAgo(90),
  updatedAt: hoursAgo(1),
  lastLoginAt: hoursAgo(1),
  emailVerified: true,
  settings: {
    language: 'en',
    theme: 'dark',
    defaultModel: 'gpt-4-turbo',
    emailNotifications: true,
  },
};

// ============ Mock Collections ============

export const mockCollections: Collection[] = [
  {
    id: 'c1',
    name: 'Marketing',
    description: 'Marketing and advertising prompts for social media, ads, and campaigns',
    color: 'text-pink-500',
    icon: 'Megaphone',
    promptCount: 5,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
  },
  {
    id: 'c2',
    name: 'Creative Arts',
    description: 'Art and creative content prompts for image generation and design',
    color: 'text-emerald-500',
    icon: 'Palette',
    promptCount: 4,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(2),
  },
  {
    id: 'c3',
    name: 'Development',
    description: 'Coding, debugging, and development assistance prompts',
    color: 'text-blue-500',
    icon: 'Code',
    promptCount: 4,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(3),
  },
  {
    id: 'c4',
    name: 'Content Writing',
    description: 'Blog posts, articles, and long-form content creation',
    color: 'text-purple-500',
    icon: 'FileText',
    promptCount: 3,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(4),
  },
  {
    id: 'c5',
    name: 'Audio & Video',
    description: 'Scripts and prompts for audio and video production',
    color: 'text-orange-500',
    icon: 'Video',
    promptCount: 4,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
  },
];

// ============ Mock Prompts ============

export const mockPrompts: Prompt[] = [
  // ==================== TEXT CATEGORY ====================
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
        systemPrompt: `You are an expert copywriter with 10 years of experience in digital marketing...`,
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
    model: 'claude-3-5-sonnet',
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
        model: 'claude-3-5-sonnet',
        temperature: 0.3,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(10),
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
    id: 'p7',
    title: 'SEO Blog Article Writer',
    description: 'Creates SEO-optimized blog articles with proper heading structure and keyword placement.',
    category: 'text',
    systemPrompt: `You are an SEO content specialist and professional blog writer.

Write a comprehensive blog article about: {{topic}}
Target keyword: {{keyword}}
Word count: {{word_count}} words

Requirements:
1. Use the target keyword naturally 3-5 times
2. Include an engaging meta description (150-160 chars)
3. Structure with H2 and H3 headings
4. Include a compelling introduction hook
5. Add a clear conclusion with CTA
6. Write in a conversational, engaging tone
7. Include relevant internal linking suggestions

Output format:
---
Meta Title: [60 chars max]
Meta Description: [150-160 chars]
---

[Article content with markdown formatting]`,
    userTemplate: 'Write a blog article about {{topic}} targeting the keyword "{{keyword}}"',
    model: 'gpt-4-turbo',
    temperature: 0.6,
    maxTokens: 4096,
    tags: ['seo', 'blog', 'content', 'writing'],
    collectionId: 'c4',
    favorite: true,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(2),
    status: 'active',
    currentVersionId: 'v7-1',
    versions: [
      {
        id: 'v7-1',
        promptId: 'p7',
        versionNumber: '1.0',
        systemPrompt: `You are an SEO content specialist...`,
        userTemplate: 'Write a blog article about {{topic}}...',
        model: 'gpt-4-turbo',
        temperature: 0.6,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(8),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p8',
    title: 'Email Newsletter Template',
    description: 'Creates engaging email newsletters with attention-grabbing subject lines.',
    category: 'text',
    systemPrompt: `You are an email marketing expert specializing in high-open-rate newsletters.

Newsletter Topic: {{topic}}
Audience: {{audience}}
Tone: {{tone}}
CTA Goal: {{cta_goal}}

Generate:
1. 3 subject line options (A/B test variations)
2. Preview text (40-90 chars)
3. Newsletter body with:
   - Hook/opening paragraph
   - Main content (3-4 short paragraphs)
   - Key takeaways (bullet points)
   - Clear CTA button text
4. P.S. line for urgency

Keep paragraphs short (2-3 sentences max).
Use conversational language.
Include emoji suggestions where appropriate.`,
    userTemplate: 'Create a newsletter about {{topic}} for {{audience}}',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    tags: ['email', 'newsletter', 'marketing'],
    collectionId: 'c1',
    favorite: false,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    status: 'active',
    currentVersionId: 'v8-1',
    versions: [
      {
        id: 'v8-1',
        promptId: 'p8',
        versionNumber: '1.0',
        systemPrompt: `You are an email marketing expert...`,
        userTemplate: 'Create a newsletter about {{topic}}...',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2048,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(6),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p9',
    title: 'Technical Documentation',
    description: 'Generates clear technical documentation with code examples and API references.',
    category: 'text',
    systemPrompt: `You are a technical writer specializing in developer documentation.

Document the following: {{feature}}
Target audience: {{audience_level}} developers
Documentation type: {{doc_type}}

Structure:
1. Overview - What it is and why use it
2. Prerequisites - Required knowledge/setup
3. Quick Start - Minimal working example
4. Detailed Usage - All options and configurations
5. Code Examples - Real-world use cases
6. Common Issues - Troubleshooting guide
7. API Reference (if applicable)

Guidelines:
- Use clear, concise language
- Include copy-pasteable code blocks
- Add inline code comments
- Use tables for parameters/options
- Include diagrams descriptions where helpful`,
    userTemplate: 'Document {{feature}} for {{audience_level}} developers',
    model: 'claude-3-5-sonnet',
    temperature: 0.4,
    maxTokens: 4096,
    tags: ['documentation', 'technical', 'api', 'developer'],
    collectionId: 'c3',
    favorite: false,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    status: 'active',
    currentVersionId: 'v9-1',
    versions: [
      {
        id: 'v9-1',
        promptId: 'p9',
        versionNumber: '1.0',
        systemPrompt: `You are a technical writer...`,
        userTemplate: 'Document {{feature}}...',
        model: 'claude-3-5-sonnet',
        temperature: 0.4,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(5),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p10',
    title: 'React Component Generator',
    description: 'Generates React TypeScript components with hooks, proper typing, and best practices.',
    category: 'text',
    systemPrompt: `You are a Senior React Developer specializing in TypeScript and modern React patterns.

Generate a React component for: {{component_description}}
Component name: {{component_name}}
Style approach: {{style_approach}}

Requirements:
1. Use TypeScript with proper interface definitions
2. Use functional components with hooks
3. Include proper prop types with JSDoc comments
4. Implement error boundaries where needed
5. Add accessibility attributes (ARIA)
6. Use React.memo for optimization where appropriate
7. Include unit test skeleton

Output files:
1. ComponentName.tsx - Main component
2. ComponentName.types.ts - Type definitions
3. ComponentName.test.tsx - Test file skeleton
4. index.ts - Barrel export`,
    userTemplate: 'Create a {{component_name}} component that {{component_description}}',
    model: 'claude-3-5-sonnet',
    temperature: 0.3,
    maxTokens: 4096,
    tags: ['react', 'typescript', 'component', 'frontend'],
    collectionId: 'c3',
    favorite: true,
    createdAt: daysAgo(4),
    updatedAt: hoursAgo(12),
    status: 'active',
    currentVersionId: 'v10-1',
    versions: [
      {
        id: 'v10-1',
        promptId: 'p10',
        versionNumber: '1.0',
        systemPrompt: `You are a Senior React Developer...`,
        userTemplate: 'Create a {{component_name}} component...',
        model: 'claude-3-5-sonnet',
        temperature: 0.3,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(4),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p11',
    title: 'Product Description Writer',
    description: 'Creates compelling e-commerce product descriptions that convert browsers to buyers.',
    category: 'text',
    systemPrompt: `You are an e-commerce copywriter specializing in conversion-focused product descriptions.

Product: {{product_name}}
Category: {{category}}
Key features: {{features}}
Target customer: {{target_customer}}
Price point: {{price_point}}

Generate:
1. Attention-grabbing headline (under 10 words)
2. Emotional hook paragraph (2-3 sentences)
3. Key benefits (5 bullet points - features → benefits)
4. Social proof suggestion
5. Urgency/scarcity element
6. Clear CTA

Tone: Professional yet conversational
Length: 150-250 words total
Focus on transformation, not just features.`,
    userTemplate: 'Write a product description for {{product_name}}',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1024,
    tags: ['ecommerce', 'product', 'copywriting', 'sales'],
    collectionId: 'c1',
    favorite: false,
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(6),
    status: 'active',
    currentVersionId: 'v11-1',
    versions: [
      {
        id: 'v11-1',
        promptId: 'p11',
        versionNumber: '1.0',
        systemPrompt: `You are an e-commerce copywriter...`,
        userTemplate: 'Write a product description for {{product_name}}',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 1024,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(3),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p12',
    title: 'Social Media Caption',
    description: 'Creates engaging social media captions optimized for each platform.',
    category: 'text',
    systemPrompt: `You are a social media strategist with expertise in platform-specific content.

Platform: {{platform}}
Post type: {{post_type}}
Topic: {{topic}}
Brand voice: {{brand_voice}}
Goal: {{goal}}

Generate captions for the specified platform:

Instagram:
- Hook in first line (before "...more")
- Storytelling approach
- 3-5 relevant hashtags
- CTA or question to boost engagement

Twitter/X:
- Punchy and concise (under 280 chars)
- Thread format if needed
- 1-2 hashtags max

LinkedIn:
- Professional yet personal
- Value-first approach
- Thought leadership angle
- No hashtags in body, add at end

TikTok:
- Casual and trendy
- Hook for scroll-stopping
- Relevant trending sounds/hashtags suggestion`,
    userTemplate: 'Create a {{platform}} caption about {{topic}}',
    model: 'gpt-4-turbo',
    temperature: 0.8,
    maxTokens: 1024,
    tags: ['social-media', 'caption', 'instagram', 'twitter', 'linkedin'],
    collectionId: 'c1',
    favorite: false,
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(3),
    status: 'active',
    currentVersionId: 'v12-1',
    versions: [
      {
        id: 'v12-1',
        promptId: 'p12',
        versionNumber: '1.0',
        systemPrompt: `You are a social media strategist...`,
        userTemplate: 'Create a {{platform}} caption about {{topic}}',
        model: 'gpt-4-turbo',
        temperature: 0.8,
        maxTokens: 1024,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(2),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p13',
    title: 'Story Plot Generator',
    description: 'Creates detailed story plots with character arcs and plot twists.',
    category: 'text',
    systemPrompt: `You are a master storyteller and plot architect.

Genre: {{genre}}
Setting: {{setting}}
Theme: {{theme}}
Target length: {{length}}

Generate a complete story outline:

1. PREMISE (1 paragraph)
   - Core conflict
   - Stakes

2. CHARACTERS
   - Protagonist (name, goal, flaw, arc)
   - Antagonist (motivation, methods)
   - Supporting cast (2-3 key characters)

3. THREE-ACT STRUCTURE
   Act 1 - Setup (25%)
   - Opening scene
   - Inciting incident
   - First plot point

   Act 2 - Confrontation (50%)
   - Rising action
   - Midpoint twist
   - Dark moment

   Act 3 - Resolution (25%)
   - Climax
   - Resolution
   - Final image

4. SUBPLOTS (2-3)

5. THEMES & SYMBOLS`,
    userTemplate: 'Create a {{genre}} story set in {{setting}}',
    model: 'claude-3-5-sonnet',
    temperature: 0.9,
    maxTokens: 4096,
    tags: ['creative', 'story', 'writing', 'fiction'],
    collectionId: 'c4',
    favorite: false,
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(1),
    status: 'active',
    currentVersionId: 'v13-1',
    versions: [
      {
        id: 'v13-1',
        promptId: 'p13',
        versionNumber: '1.0',
        systemPrompt: `You are a master storyteller...`,
        userTemplate: 'Create a {{genre}} story set in {{setting}}',
        model: 'claude-3-5-sonnet',
        temperature: 0.9,
        maxTokens: 4096,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(1),
        createdBy: 'user-1',
      },
    ],
  },

  // ==================== IMAGE CATEGORY ====================
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
    tags: ['art', 'creative', 'surrealism', 'dali'],
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
    id: 'p14',
    title: 'Product Photography',
    description: 'Generates professional product photography with studio lighting and clean backgrounds.',
    category: 'image',
    systemPrompt: `Professional product photography of {{product}}.
Background: {{background_style}}
Lighting: Studio softbox lighting, dramatic shadows
Angle: {{camera_angle}}
Style: Commercial photography, clean, minimalist, high-end luxury feel
Quality: 8k resolution, sharp focus, professional color grading
Additional elements: {{props}}`,
    userTemplate: '',
    model: 'dall-e-3',
    temperature: 0.8,
    maxTokens: 4000,
    tags: ['product', 'photography', 'commercial', 'ecommerce'],
    collectionId: 'c2',
    favorite: true,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(4),
    status: 'active',
    currentVersionId: 'v14-1',
    versions: [
      {
        id: 'v14-1',
        promptId: 'p14',
        versionNumber: '1.0',
        systemPrompt: `Professional product photography...`,
        userTemplate: '',
        model: 'dall-e-3',
        temperature: 0.8,
        maxTokens: 4000,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(9),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p15',
    title: 'Character Concept Art',
    description: 'Creates detailed character concept art for games and animation.',
    category: 'image',
    systemPrompt: `Character concept art for {{character_description}}.
Art style: {{art_style}}
Pose: {{pose}}
Expression: {{expression}}
Outfit: {{outfit_description}}
Background: Simple gradient or character sheet layout
Quality: Professional concept art, detailed, clean linework
Include: Front view, side view, back view turnaround sheet
Color palette: {{color_scheme}}`,
    userTemplate: '',
    model: 'midjourney-v6',
    temperature: 0.9,
    maxTokens: 4000,
    tags: ['character', 'concept-art', 'game', 'animation'],
    collectionId: 'c2',
    favorite: false,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    status: 'active',
    currentVersionId: 'v15-1',
    versions: [
      {
        id: 'v15-1',
        promptId: 'p15',
        versionNumber: '1.0',
        systemPrompt: `Character concept art...`,
        userTemplate: '',
        model: 'midjourney-v6',
        temperature: 0.9,
        maxTokens: 4000,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(7),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p16',
    title: 'UI Design Mockup',
    description: 'Generates modern UI design mockups for apps and websites.',
    category: 'image',
    systemPrompt: `UI design mockup for {{app_type}} application.
Screen: {{screen_type}}
Design style: {{design_style}}
Color scheme: {{colors}}
Platform: {{platform}}
Features to show: {{features}}
Style: Modern, clean, professional UI/UX design
Quality: High fidelity mockup, pixel perfect, Figma/Sketch quality
Include: Proper spacing, typography hierarchy, consistent design system`,
    userTemplate: '',
    model: 'dall-e-3',
    temperature: 0.7,
    maxTokens: 4000,
    tags: ['ui', 'design', 'mockup', 'app'],
    collectionId: 'c2',
    favorite: false,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    status: 'active',
    currentVersionId: 'v16-1',
    versions: [
      {
        id: 'v16-1',
        promptId: 'p16',
        versionNumber: '1.0',
        systemPrompt: `UI design mockup...`,
        userTemplate: '',
        model: 'dall-e-3',
        temperature: 0.7,
        maxTokens: 4000,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(4),
        createdBy: 'user-1',
      },
    ],
  },

  // ==================== AUDIO CATEGORY ====================
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
    tags: ['podcast', 'script', 'audio', 'intro'],
    collectionId: 'c5',
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
    id: 'p17',
    title: 'Voice-Over Script',
    description: 'Creates professional voice-over scripts for commercials and explainer videos.',
    category: 'audio',
    systemPrompt: `Write a voice-over script for {{project_type}}.

Duration: {{duration}} seconds
Tone: {{tone}}
Target audience: {{audience}}
Key message: {{message}}
Brand: {{brand_name}}

Structure:
1. Attention-grabbing opening (first 3 seconds)
2. Problem statement or hook
3. Solution/product introduction
4. Key benefits (3 max)
5. Social proof or credibility
6. Call to action
7. Tagline/closing

Include:
- [PAUSE] markers for natural breaks
- [EMPHASIS] for key words
- Pronunciation guides for tricky words
- Estimated word count per section

Keep sentences short and punchy. Avoid jargon.`,
    userTemplate: 'Write a voice-over script for {{project_type}} about {{message}}',
    model: 'gpt-4-turbo',
    temperature: 0.6,
    maxTokens: 1024,
    tags: ['voiceover', 'commercial', 'script', 'advertising'],
    collectionId: 'c5',
    favorite: false,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(2),
    status: 'active',
    currentVersionId: 'v17-1',
    versions: [
      {
        id: 'v17-1',
        promptId: 'p17',
        versionNumber: '1.0',
        systemPrompt: `Write a voice-over script...`,
        userTemplate: 'Write a voice-over script for {{project_type}}...',
        model: 'gpt-4-turbo',
        temperature: 0.6,
        maxTokens: 1024,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(6),
        createdBy: 'user-1',
      },
    ],
  },

  // ==================== VIDEO CATEGORY ====================
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
    collectionId: 'c5',
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
  {
    id: 'p18',
    title: 'YouTube Video Outline',
    description: 'Creates detailed video outlines with hooks, timestamps, and engagement strategies.',
    category: 'video',
    systemPrompt: `Create a YouTube video outline for: {{video_topic}}

Channel niche: {{niche}}
Target length: {{duration}} minutes
Video style: {{style}}

Generate:

1. TITLE OPTIONS (3 variations)
   - Curiosity-driven
   - Benefit-focused
   - Number/list format

2. THUMBNAIL CONCEPT
   - Main visual element
   - Text overlay (3-4 words max)
   - Emotion to convey

3. HOOK (First 30 seconds)
   - Opening line
   - Pattern interrupt
   - Promise/preview

4. DETAILED OUTLINE WITH TIMESTAMPS
   [00:00] Hook
   [00:30] Introduction
   [01:00] Main content sections...
   [XX:XX] CTA and outro

5. ENGAGEMENT ELEMENTS
   - Questions to ask viewers
   - Poll ideas
   - Comment prompts

6. SEO ELEMENTS
   - Primary keywords
   - Tags (10-15)
   - Description template`,
    userTemplate: 'Create a YouTube outline for a video about {{video_topic}}',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    tags: ['youtube', 'video', 'content', 'outline'],
    collectionId: 'c5',
    favorite: true,
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(5),
    status: 'active',
    currentVersionId: 'v18-1',
    versions: [
      {
        id: 'v18-1',
        promptId: 'p18',
        versionNumber: '1.0',
        systemPrompt: `Create a YouTube video outline...`,
        userTemplate: 'Create a YouTube outline for a video about {{video_topic}}',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 2048,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(2),
        createdBy: 'user-1',
      },
    ],
  },

  // ==================== TRASH ITEMS ====================
  {
    id: 'p19',
    title: 'Old Blog Template',
    description: 'Deprecated blog post template - moved to trash.',
    category: 'text',
    systemPrompt: 'Write a blog post about {{topic}}.',
    userTemplate: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    maxTokens: 1024,
    tags: ['blog', 'old'],
    collectionId: null,
    favorite: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(1),
    status: 'trash',
    currentVersionId: 'v19-1',
    versions: [
      {
        id: 'v19-1',
        promptId: 'p19',
        versionNumber: '1.0',
        systemPrompt: 'Write a blog post about {{topic}}.',
        userTemplate: '',
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        maxTokens: 1024,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(30),
        createdBy: 'user-1',
      },
    ],
  },
  {
    id: 'p20',
    title: 'Test Prompt',
    description: 'Test prompt for development - to be deleted.',
    category: 'text',
    systemPrompt: 'This is a test prompt.',
    userTemplate: 'Test input: {{input}}',
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    maxTokens: 512,
    tags: ['test'],
    collectionId: null,
    favorite: false,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(2),
    status: 'trash',
    currentVersionId: 'v20-1',
    versions: [
      {
        id: 'v20-1',
        promptId: 'p20',
        versionNumber: '1.0',
        systemPrompt: 'This is a test prompt.',
        userTemplate: 'Test input: {{input}}',
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        maxTokens: 512,
        changeNote: 'Initial creation.',
        createdAt: daysAgo(20),
        createdBy: 'user-1',
      },
    ],
  },
];

// ============ Mock Share Records ============

export const mockShareRecords: ShareRecord[] = [
  {
    id: 'share-1',
    code: 'ABC123',
    promptId: 'p1',
    prompt: {
      title: 'Marketing Copy Generator',
      description: 'Generates high-converting ad copy for social media campaigns.',
      category: 'text',
      systemPrompt: mockPrompts[0].systemPrompt,
      userTemplate: mockPrompts[0].userTemplate,
      model: 'gpt-4-turbo',
      temperature: 0.7,
      maxTokens: 1024,
      tags: ['marketing', 'social-media', 'copywriting'],
      sharedAt: daysAgo(3),
      sharedBy: 'John Doe',
    },
    createdAt: daysAgo(3),
    expiresAt: daysLater(4),
    viewCount: 42,
  },
  {
    id: 'share-2',
    code: 'XYZ789',
    promptId: 'p3',
    prompt: {
      title: 'Python Code Refactor',
      description: 'Cleans up messy Python code with type hints and docstrings.',
      category: 'text',
      systemPrompt: mockPrompts[1].systemPrompt,
      userTemplate: mockPrompts[1].userTemplate,
      model: 'claude-3-5-sonnet',
      temperature: 0.3,
      maxTokens: 4096,
      tags: ['coding', 'python', 'refactoring'],
      sharedAt: daysAgo(5),
      sharedBy: 'John Doe',
    },
    createdAt: daysAgo(5),
    viewCount: 128,
  },
  {
    id: 'share-3',
    code: 'DEF456',
    promptId: 'p10',
    prompt: {
      title: 'React Component Generator',
      description: 'Generates React TypeScript components with best practices.',
      category: 'text',
      systemPrompt: 'You are a Senior React Developer...',
      userTemplate: 'Create a {{component_name}} component...',
      model: 'claude-3-5-sonnet',
      temperature: 0.3,
      maxTokens: 4096,
      tags: ['react', 'typescript', 'component'],
      sharedAt: daysAgo(1),
      sharedBy: 'John Doe',
    },
    createdAt: daysAgo(1),
    expiresAt: daysLater(6),
    viewCount: 15,
  },
];

export const mockMyShareRecords: MyShareRecord[] = [
  {
    id: 'share-1',
    code: 'ABC123',
    promptId: 'p1',
    promptTitle: 'Marketing Copy Generator',
    viewCount: 42,
    createdAt: daysAgo(3),
    expiresAt: daysLater(4),
  },
  {
    id: 'share-2',
    code: 'XYZ789',
    promptId: 'p3',
    promptTitle: 'Python Code Refactor',
    viewCount: 128,
    createdAt: daysAgo(5),
  },
  {
    id: 'share-3',
    code: 'DEF456',
    promptId: 'p10',
    promptTitle: 'React Component Generator',
    viewCount: 15,
    createdAt: daysAgo(1),
    expiresAt: daysLater(6),
  },
];

// ============ 统计数据 ============

export const mockStats = {
  totalPrompts: mockPrompts.filter(p => p.status !== 'trash').length,
  totalCollections: mockCollections.length,
  favoritePrompts: mockPrompts.filter(p => p.favorite && p.status !== 'trash').length,
  trashedPrompts: mockPrompts.filter(p => p.status === 'trash').length,
  promptsByCategory: {
    text: mockPrompts.filter(p => p.category === 'text' && p.status !== 'trash').length,
    image: mockPrompts.filter(p => p.category === 'image' && p.status !== 'trash').length,
    audio: mockPrompts.filter(p => p.category === 'audio' && p.status !== 'trash').length,
    video: mockPrompts.filter(p => p.category === 'video' && p.status !== 'trash').length,
  },
  totalShares: mockMyShareRecords.length,
  totalViews: mockMyShareRecords.reduce((sum, s) => sum + s.viewCount, 0),
};
