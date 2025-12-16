# 版本历史功能 Bug 修复报告

## 问题概述

时间轴显示不正确，版本管理功能存在前后端不一致问题。

---

## 发现的问题

### 🔴 问题 1: 后端 `restoreVersion` 不更新 `currentVersionId`

**文件**: `prompt-studio-api/src/modules/prompts/prompt.service.ts:298-333`

**问题描述**:
恢复版本时，虽然更新了 prompt 的内容（systemPrompt, userTemplate等），但没有更新 `currentVersionId` 字段，导致前端无法正确识别当前版本。

**原代码**:
```typescript
const updated = await prisma.prompt.update({
  where: { id: promptId },
  data: {
    systemPrompt: version.systemPrompt,
    userTemplate: version.userTemplate,
    model: version.model,
    temperature: version.temperature,
    maxTokens: version.maxTokens,
    // ❌ 缺少 currentVersionId: versionId
  },
  include: promptInclude,
});
```

**修复**:
```typescript
const updated = await prisma.prompt.update({
  where: { id: promptId },
  data: {
    systemPrompt: version.systemPrompt,
    userTemplate: version.userTemplate,
    model: version.model,
    temperature: version.temperature,
    maxTokens: version.maxTokens,
    currentVersionId: versionId,  // ✅ 添加
  },
  include: promptInclude,
});
```

---

### 🔴 问题 2: 后端 `generateVersionNumber` 逻辑过时

**文件**: `prompt-studio-api/src/utils/token.ts:18-41`

**问题描述**:
后端的版本号生成逻辑简单地找最大版本号并 +1，不支持：
1. 基于当前版本生成（而是基于所有版本的最大值）
2. Major/Minor 版本类型选择

**原逻辑**:
```typescript
function generateVersionNumber(existingVersions) {
  const highest = versions.reduce((max, v) => {
    if (v.major > max.major) return v;
    if (v.major === max.major && v.minor > max.minor) return v;
    return max;
  });

  return `${highest.major}.${highest.minor + 1}`;  // 总是 minor +1
}
```

**修复后的新逻辑**:
```typescript
function generateVersionNumber(
  existingVersions: { id: string; versionNumber: string }[],
  currentVersionId: string,  // ⭐ 新增参数
  type: 'major' | 'minor' = 'minor'  // ⭐ 新增参数
): string {
  // 1. 找到当前版本
  const currentVersion = existingVersions.find(v => v.id === currentVersionId);

  // 2. 解析当前版本号
  const [currentMajor, currentMinor] = currentVersion.versionNumber.split('.');

  // 3. 根据类型生成新版本号
  if (type === 'major') {
    newMajor = currentMajor + 1;
    newMinor = 0;  // Major 升级时 minor 重置为 0
  } else {
    newMajor = currentMajor;
    newMinor = currentMinor + 1;
  }

  // 4. 检查冲突并自动递增
  while (existingVersionNumbers.has(newVersionNumber)) {
    // 自动递增直到找到可用版本号
  }

  return newVersionNumber;
}
```

---

### 🔴 问题 3: 后端 Schema 缺少 `versionType` 参数

**文件**: `prompt-studio-api/src/modules/prompts/prompt.schema.ts:53-57`

**问题描述**:
创建版本的 schema 不接收 `versionType` 参数。

**修复**:
```typescript
export const createVersionSchema = z.object({
  changeNote: z.string().max(500).default(''),
  versionType: z.enum(['major', 'minor']).default('minor'),  // ✅ 添加
});
```

---

### 🔴 问题 4: 后端 Service 未传递版本类型

**文件**: `prompt-studio-api/src/modules/prompts/prompt.service.ts:259-304`

**问题描述**:
`createVersion` 方法调用 `generateVersionNumber` 时未传递必需的参数。

**原代码**:
```typescript
const versionNumber = generateVersionNumber(prompt.versions);
```

**修复**:
```typescript
const versionNumber = generateVersionNumber(
  prompt.versions,
  prompt.currentVersionId,  // ✅ 传递当前版本ID
  input.versionType || 'minor'  // ✅ 传递版本类型
);
```

---

### 🔴 问题 5: 前端 Store 未传递版本类型到 API

**文件**: `prompt-studio/src/stores/promptStore.ts:380-382`

**问题描述**:
前端在非 Mock 模式下调用 API 时，只传递了 `changeNote`，没有传递 `versionType`。

**原代码**:
```typescript
const created = await promptService.createVersion(promptId, { changeNote: note });
```

**修复**:
```typescript
const created = await promptService.createVersion(promptId, {
  changeNote: note,
  versionType,  // ✅ 添加
});
```

---

### 🔴 问题 6: 前端类型定义过时

**文件**: `prompt-studio/src/types/prompt.ts:81-88`

**问题描述**:
`CreateVersionRequest` 类型定义与后端 API 不匹配。

**原定义**:
```typescript
export interface CreateVersionRequest {
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  changeNote?: string;
}
```

**修复**:
```typescript
export interface CreateVersionRequest {
  changeNote?: string;
  versionType?: 'major' | 'minor';
}
```

---

## 修复总结

### 后端修复 (3个文件)

1. **`prompt.service.ts`** (2处修复)
   - ✅ `restoreVersion`: 添加 `currentVersionId` 更新
   - ✅ `createVersion`: 传递正确参数给 `generateVersionNumber`

2. **`token.ts`**
   - ✅ 完全重写 `generateVersionNumber` 函数
   - ✅ 支持基于当前版本生成
   - ✅ 支持 Major/Minor 类型选择
   - ✅ 自动处理版本号冲突

3. **`prompt.schema.ts`**
   - ✅ 添加 `versionType` 字段到 schema

### 前端修复 (2个文件)

1. **`promptStore.ts`**
   - ✅ 在 API 调用时传递 `versionType` 参数

2. **`prompt.ts`** (类型定义)
   - ✅ 更新 `CreateVersionRequest` 类型定义

---

## 修复后的行为

### 场景 1: 线性开发
```
当前版本: 1.0
创建 Minor → 1.1 ✅
创建 Minor → 1.2 ✅
创建 Major → 2.0 ✅
```

### 场景 2: 恢复旧版本后继续
```
版本历史: 1.0, 1.1, 1.2
当前版本: 1.0 (恢复到旧版本)

创建 Minor → 1.1 (冲突) → 1.2 (冲突) → 1.3 ✅
创建 Major → 2.0 ✅

恢复后 currentVersionId 正确更新 ✅
```

### 场景 3: 版本切换
```
恢复 v1.1 → currentVersionId = v1.1 的ID ✅
前端时间轴正确显示 "Current" 标记 ✅
```

---

## 影响范围

- ✅ **版本创建**: 现在正确支持 Major/Minor 类型
- ✅ **版本恢复**: currentVersionId 正确更新
- ✅ **时间轴显示**: 当前版本标记正确显示
- ✅ **版本号生成**: 基于当前版本，符合预期
- ✅ **冲突处理**: 自动跳过已存在的版本号

---

## 测试建议

1. **测试版本创建**
   - 创建 Minor 版本，验证版本号递增（1.0 → 1.1）
   - 创建 Major 版本，验证版本号跳跃（1.1 → 2.0）

2. **测试版本恢复**
   - 恢复到旧版本
   - 验证时间轴上的 "Current" 标记位置
   - 从旧版本创建新版本，验证版本号正确

3. **测试冲突处理**
   - 恢复到 v1.0
   - 创建 Minor 版本（应该跳过 1.1, 1.2 到 1.3）

---

## 需要重新编译

### 后端
```bash
cd prompt-studio-api
npm run build
npm run start  # 或 npm run dev
```

### 前端
前端使用 TypeScript，修改会自动重新编译（如果使用 dev 模式）。

---

## 兼容性说明

- ✅ 向后兼容：旧数据不受影响
- ✅ 默认行为：`versionType` 默认为 `'minor'`，保持原有行为
- ✅ Mock 模式：前端 Mock 模式已同步更新
