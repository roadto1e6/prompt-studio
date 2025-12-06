import { TranslationKeys } from './en';

export const zh: TranslationKeys = {
  // Common
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    close: '关闭',
    back: '返回',
    confirm: '确认',
    search: '搜索',
    loading: '加载中...',
    noResults: '未找到结果',
    copied: '已复制！',
    copy: '复制',
  },

  // App
  app: {
    name: 'Prompt Studio',
  },

  // Sidebar
  sidebar: {
    searchPlaceholder: '搜索提示词 (Cmd+K)',
    quickAccess: '快速访问',
    categories: '分类',
    collections: '集合',
    noCollection: '未分类',
  },

  // Quick Filters
  filters: {
    all: '全部提示词',
    favorites: '收藏',
    recent: '最近',
    trash: '回收站',
  },

  // Categories
  categories: {
    text: '文本',
    image: '图片',
    audio: '音频',
    video: '视频',
  },

  // Header
  header: {
    grid: '网格',
    list: '列表',
    import: '导入',
    newPrompt: '新建提示词',
    sortBy: {
      updatedAt: '最近修改',
      createdAt: '创建时间',
      title: '标题',
    },
    asc: '升序',
    desc: '降序',
  },

  // Prompt Card
  promptCard: {
    noDescription: '暂无描述',
    favorite: '切换收藏',
    moveToTrash: '移至回收站',
    restore: '恢复',
    deletePermanently: '永久删除',
  },

  // Prompt Grid
  promptGrid: {
    emptyTitle: '暂无提示词',
    emptyDescription: '创建您的第一个提示词开始使用',
    emptyFavoritesTitle: '暂无收藏',
    emptyFavoritesDescription: '收藏您喜欢的提示词，它们将显示在这里',
    emptyTrashTitle: '回收站为空',
    emptyTrashDescription: '删除的提示词将显示在这里',
    emptySearchTitle: '未找到匹配的提示词',
    emptySearchDescription: '尝试调整搜索条件或筛选器',
    createFirst: '创建第一个提示词',
  },

  // Detail Panel
  detailPanel: {
    tabs: {
      editor: '编辑器',
      metadata: '元数据',
      versions: '版本历史',
    },
    uncategorized: '未分类',
    noPromptSelected: '未选择提示词',
    selectPrompt: '从列表中选择一个提示词查看详情',
    share: '分享提示词',
    restore: '恢复',
    deletePermanently: '永久删除',
  },

  // Prompt Editor
  editor: {
    systemPrompt: '系统提示词',
    systemPromptPlaceholder: '输入定义 AI 行为的系统提示词...',
    userTemplate: '用户消息模板',
    userTemplatePlaceholder: '输入包含 {{变量}} 的用户消息模板...',
    variablesHint: '使用 {{变量名}} 语法创建动态内容',
    model: '模型',
    temperature: '温度',
    temperatureHint: '越高 = 越有创意，越低 = 越专注',
    maxTokens: '最大令牌数',
    saveVersion: '保存为新版本',
    saveVersionHint: '使用当前更改创建新版本',
    versionNote: '版本说明',
    versionNotePlaceholder: '这个版本有什么变化？',
  },

  // Prompt Metadata
  metadata: {
    description: '描述',
    descriptionPlaceholder: '为此提示词添加描述...',
    category: '分类',
    collection: '集合',
    selectCollection: '选择集合',
    noCollection: '无集合',
    tags: '标签',
    addTag: '添加标签',
    tagPlaceholder: '输入后按回车',
    createdAt: '创建时间',
    updatedAt: '最后修改',
    dangerZone: '危险操作',
    moveToTrash: '移至回收站',
    moveToTrashDescription: '将此提示词移至回收站。您可以稍后恢复它。',
  },

  // Prompt Versions
  versions: {
    title: '版本历史',
    current: '当前',
    by: '由',
    restore: '恢复',
    noVersions: '暂无版本',
    noVersionsDescription: '保存第一个版本以开始追踪更改',
  },

  // Create Prompt Modal
  createPrompt: {
    title: '创建新提示词',
    subtitle: '开始构建您的 AI 提示词',
    titleLabel: '标题',
    titlePlaceholder: '给您的提示词起个容易记住的名字',
    descriptionLabel: '描述',
    descriptionPlaceholder: '这个提示词是做什么的？',
    categoryLabel: '分类',
    collectionLabel: '集合（可选）',
    selectCollection: '选择集合',
    createButton: '创建提示词',
  },

  // Create Collection Modal
  createCollection: {
    title: '创建集合',
    subtitle: '整理您的提示词',
    nameLabel: '名称',
    namePlaceholder: '集合名称',
    descriptionLabel: '描述',
    descriptionPlaceholder: '这个集合是用来做什么的？',
    colorLabel: '颜色',
    createButton: '创建集合',
  },

  // Share Modal
  share: {
    title: '分享提示词',
    subtitle: '与他人分享这个提示词',
    shareLink: '分享链接',
    shareCode: '分享码',
    copyLink: '复制链接',
    copyCode: '复制代码',
    sharedBy: '分享者',
  },

  // Import Modal
  import: {
    title: '导入提示词',
    subtitle: '将分享的提示词导入到您的库中',
    pasteLabel: '粘贴分享链接或代码',
    pastePlaceholder: '在此粘贴分享 URL 或代码...',
    parseButton: '解析分享数据',
    invalidCode: '无效的分享码或 URL，请确保它以 "PS-" 开头',
    decodeFailed: '解码分享数据失败，代码可能已损坏。',
    duplicateTitle: '检测到重复',
    duplicateMessage: '您的库中已存在具有相同标题和内容的提示词。',
    importButton: '导入到库',
    importAnyway: '仍然导入',
    preview: {
      systemPrompt: '系统提示词预览',
      noSystemPrompt: '无系统提示词',
      sharedBy: '分享者',
      temp: '温度',
      maxTokens: '最大令牌',
    },
  },

  // Confirm Modal
  confirm: {
    deleteCollection: {
      title: '删除集合',
      message: '确定要删除此集合吗？集合中的提示词不会被删除。',
    },
    deletePermanently: {
      title: '永久删除',
      message: '确定要永久删除此提示词吗？此操作无法撤销。',
      confirmText: '永久删除',
    },
    moveToTrash: {
      title: '移至回收站',
      message: '确定要将此提示词移至回收站吗？',
    },
  },

  // Settings
  settings: {
    title: '设置',
    language: '语言',
    languageDescription: '选择您的首选语言',
    theme: '主题',
    themeDescription: '选择您的首选主题',
    english: 'English',
    chinese: '中文',
    dark: '深色',
    light: '浅色',
  },

  // User
  user: {
    plan: {
      free: '免费版',
      pro: '专业版',
      team: '团队版',
    },
  },
};
