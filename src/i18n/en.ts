export const en = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    back: 'Back',
    confirm: 'Confirm',
    search: 'Search',
    loading: 'Loading...',
    noResults: 'No results found',
    copied: 'Copied!',
    copy: 'Copy',
  },

  // App
  app: {
    name: 'Prompt Studio',
  },

  // Sidebar
  sidebar: {
    searchPlaceholder: 'Search prompts (Cmd+K)',
    quickAccess: 'Quick Access',
    categories: 'Categories',
    collections: 'Collections',
    noCollection: 'No Collection',
  },

  // Quick Filters
  filters: {
    all: 'All Prompts',
    favorites: 'Favorites',
    recent: 'Recent',
    trash: 'Trash',
  },

  // Categories
  categories: {
    text: 'Text',
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
  },

  // Header
  header: {
    grid: 'Grid',
    list: 'List',
    import: 'Import',
    newPrompt: 'New Prompt',
    sortBy: {
      updatedAt: 'Last Modified',
      createdAt: 'Date Created',
      title: 'Title',
    },
    asc: 'Asc',
    desc: 'Desc',
  },

  // Prompt Card
  promptCard: {
    noDescription: 'No description',
    favorite: 'Toggle favorite',
    moveToTrash: 'Move to trash',
    restore: 'Restore',
    deletePermanently: 'Delete permanently',
  },

  // Prompt Grid
  promptGrid: {
    emptyTitle: 'No prompts yet',
    emptyDescription: 'Create your first prompt to get started',
    emptyFavoritesTitle: 'No favorites yet',
    emptyFavoritesDescription: 'Star your favorite prompts to see them here',
    emptyTrashTitle: 'Trash is empty',
    emptyTrashDescription: 'Deleted prompts will appear here',
    emptySearchTitle: 'No matching prompts',
    emptySearchDescription: 'Try adjusting your search or filters',
    createFirst: 'Create First Prompt',
  },

  // Detail Panel
  detailPanel: {
    tabs: {
      editor: 'Editor',
      metadata: 'Metadata',
      versions: 'Version History',
    },
    uncategorized: 'Uncategorized',
    noPromptSelected: 'No prompt selected',
    selectPrompt: 'Select a prompt from the list to view details',
    share: 'Share prompt',
    restore: 'Restore',
    deletePermanently: 'Delete permanently',
  },

  // Prompt Editor
  editor: {
    systemPrompt: 'System Prompt',
    systemPromptPlaceholder: 'Enter the system prompt that defines the AI behavior...',
    userTemplate: 'User Message Template',
    userTemplatePlaceholder: 'Enter the user message template with {{variables}}...',
    variablesHint: 'Use {{variableName}} syntax for dynamic content',
    model: 'Model',
    temperature: 'Temperature',
    temperatureHint: 'Higher = more creative, Lower = more focused',
    maxTokens: 'Max Tokens',
    saveVersion: 'Save as New Version',
    saveVersionHint: 'Create a new version with current changes',
    versionNote: 'Version Note',
    versionNotePlaceholder: 'What changed in this version?',
  },

  // Prompt Metadata
  metadata: {
    description: 'Description',
    descriptionPlaceholder: 'Add a description for this prompt...',
    category: 'Category',
    collection: 'Collection',
    selectCollection: 'Select collection',
    noCollection: 'No collection',
    tags: 'Tags',
    addTag: 'Add tag',
    tagPlaceholder: 'Type and press Enter',
    createdAt: 'Created',
    updatedAt: 'Last Modified',
    dangerZone: 'Danger Zone',
    moveToTrash: 'Move to Trash',
    moveToTrashDescription: 'Move this prompt to trash. You can restore it later.',
  },

  // Prompt Versions
  versions: {
    title: 'Version History',
    current: 'Current',
    by: 'by',
    restore: 'Restore',
    noVersions: 'No versions yet',
    noVersionsDescription: 'Save your first version to start tracking changes',
  },

  // Create Prompt Modal
  createPrompt: {
    title: 'Create New Prompt',
    subtitle: 'Start building your AI prompt',
    titleLabel: 'Title',
    titlePlaceholder: 'Give your prompt a memorable name',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What does this prompt do?',
    categoryLabel: 'Category',
    collectionLabel: 'Collection (Optional)',
    selectCollection: 'Select collection',
    createButton: 'Create Prompt',
  },

  // Create Collection Modal
  createCollection: {
    title: 'Create Collection',
    subtitle: 'Organize your prompts',
    nameLabel: 'Name',
    namePlaceholder: 'Collection name',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What is this collection for?',
    colorLabel: 'Color',
    createButton: 'Create Collection',
  },

  // Share Modal
  share: {
    title: 'Share Prompt',
    subtitle: 'Share this prompt with others',
    shareLink: 'Share Link',
    shareCode: 'Share Code',
    copyLink: 'Copy Link',
    copyCode: 'Copy Code',
    sharedBy: 'Shared by',
  },

  // Import Modal
  import: {
    title: 'Import Prompt',
    subtitle: 'Import a shared prompt to your library',
    pasteLabel: 'Paste Share Link or Code',
    pastePlaceholder: 'Paste the share URL or code here...',
    parseButton: 'Parse Share Data',
    invalidCode: 'Invalid share code or URL. Make sure it starts with "PS-"',
    decodeFailed: 'Failed to decode share data. The code may be corrupted.',
    duplicateTitle: 'Duplicate Detected',
    duplicateMessage: 'A prompt with the same title and content already exists in your library.',
    importButton: 'Import to Library',
    importAnyway: 'Import Anyway',
    preview: {
      systemPrompt: 'System Prompt Preview',
      noSystemPrompt: 'No system prompt',
      sharedBy: 'Shared by',
      temp: 'Temp',
      maxTokens: 'Max Tokens',
    },
  },

  // Confirm Modal
  confirm: {
    deleteCollection: {
      title: 'Delete Collection',
      message: 'Are you sure you want to delete this collection? Prompts in this collection will not be deleted.',
    },
    deletePermanently: {
      title: 'Delete Permanently',
      message: 'Are you sure you want to permanently delete this prompt? This action cannot be undone.',
      confirmText: 'Delete Forever',
    },
    moveToTrash: {
      title: 'Move to Trash',
      message: 'Are you sure you want to move this prompt to trash?',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    languageDescription: 'Choose your preferred language',
    theme: 'Theme',
    themeDescription: 'Choose your preferred theme',
    english: 'English',
    chinese: 'Chinese',
    dark: 'Dark',
    light: 'Light',
  },

  // User
  user: {
    plan: {
      free: 'Free Plan',
      pro: 'Pro Plan',
      team: 'Team Plan',
    },
  },

  // Auth
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to your account to continue',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      orContinueWith: 'Or continue with',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
    },
    register: {
      title: 'Create your account',
      subtitle: 'Start managing your AI prompts today',
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: '••••••••',
      passwordMismatch: 'Passwords do not match',
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      createAccount: 'Create account',
      creating: 'Creating account...',
      orContinueWith: 'Or continue with',
      hasAccount: 'Already have an account?',
      signIn: 'Sign in',
    },
    forgotPassword: {
      title: 'Reset your password',
      subtitle: "Enter your email and we'll send you a reset link",
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      sendResetLink: 'Send reset link',
      sending: 'Sending...',
      backToLogin: 'Back to login',
      checkEmail: 'Check your email',
      emailSent: "We've sent a password reset link to your email",
      noEmail: "Didn't receive the email?",
      tryAgain: 'Try again',
    },
    logout: 'Log out',
    profile: 'Profile',
    settings: 'Settings',
  },
};

export type TranslationKeys = typeof en;
