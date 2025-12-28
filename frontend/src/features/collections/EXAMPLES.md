# Collections Components - 使用示例

## 📚 完整示例集合

---

## 1️⃣ ColorPicker - 颜色选择器

### 基础用法

```tsx
import { ColorPicker } from '@/features/collections/components';
import { useState } from 'react';

function BasicExample() {
  const [color, setColor] = useState('pink');

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      label="选择主题颜色"
    />
  );
}
```

### 带表单验证

```tsx
import { ColorPickerField } from '@/features/collections/components';

function FormExample() {
  const [color, setColor] = useState('blue');
  const [error, setError] = useState('');

  const handleValidate = (value) => {
    if (value === 'red') {
      setError('红色已被使用');
    } else {
      setError('');
    }
  };

  return (
    <ColorPickerField
      value={color}
      onChange={(value) => {
        setColor(value);
        handleValidate(value);
      }}
      error={error}
      label="集合颜色"
    />
  );
}
```

### 不同尺寸

```tsx
<div className="space-y-4">
  {/* 小尺寸 */}
  <ColorPicker size="sm" value={color} onChange={setColor} />

  {/* 中等尺寸（默认） */}
  <ColorPicker size="md" value={color} onChange={setColor} />

  {/* 大尺寸 */}
  <ColorPicker size="lg" value={color} onChange={setColor} />
</div>
```

### 禁用状态

```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  disabled={true}
  label="当前颜色（只读）"
/>
```

---

## 2️⃣ CollectionPreview - 集合预览

### 基础预览

```tsx
import { CollectionPreview } from '@/features/collections/components';

function PreviewExample() {
  return (
    <CollectionPreview
      name="我的项目"
      description="所有项目相关的提示词"
      color="blue"
      promptCount={25}
    />
  );
}
```

### 空状态预览

```tsx
<CollectionPreview
  name=""
  color="pink"
  namePlaceholder="未命名集合"
  promptCount={0}
/>
```

### 列表中使用

```tsx
function CollectionList({ collections }) {
  return (
    <div className="space-y-2">
      {collections.map((collection) => (
        <CollectionPreview
          key={collection.id}
          name={collection.name}
          description={collection.description}
          color={collection.color}
          promptCount={collection.prompts?.length || 0}
          animated={false}  // 列表中关闭动画
        />
      ))}
    </div>
  );
}
```

### 加载骨架屏

```tsx
import { CollectionPreviewSkeleton } from '@/features/collections/components';

function LoadingState() {
  return (
    <div className="space-y-2">
      <CollectionPreviewSkeleton />
      <CollectionPreviewSkeleton />
      <CollectionPreviewSkeleton />
    </div>
  );
}
```

---

## 3️⃣ useCollectionForm - 表单 Hook

### 创建表单

```tsx
import { useCollectionForm } from '@/features/collections/components';
import { Input, Button } from '@/components/ui';

function CreateForm() {
  const form = useCollectionForm({
    onSuccess: (values) => {
      console.log('创建成功:', values);
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    // 调用 API 创建集合
    await api.createCollection(values);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="名称"
        value={form.values.name}
        onChange={(e) => form.setName(e.target.value)}
        error={form.errors.name}
      />

      <Input
        label="描述"
        value={form.values.description}
        onChange={(e) => form.setDescription(e.target.value)}
        error={form.errors.description}
      />

      <ColorPicker
        label="颜色"
        value={form.values.color}
        onChange={form.setColor}
      />

      <Button
        type="submit"
        loading={form.isSubmitting}
        disabled={!form.isValid}
      >
        创建集合
      </Button>
    </form>
  );
}
```

### 编辑表单

```tsx
function EditForm({ collection }) {
  const form = useCollectionForm({
    initialValues: {
      name: collection.name,
      description: collection.description,
      color: collection.color,
    },
    onSuccess: (values) => {
      console.log('更新成功:', values);
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await api.updateCollection(collection.id, values);
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段... */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={form.reset}
          disabled={!form.isDirty}
        >
          重置
        </Button>
        <Button
          type="submit"
          loading={form.isSubmitting}
          disabled={!form.isDirty || !form.isValid}
        >
          保存更改
        </Button>
      </div>
    </form>
  );
}
```

### 自定义验证规则

```tsx
const form = useCollectionForm({
  validationRules: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 30,
      custom: (value) => {
        // 检查重复名称
        if (existingNames.includes(value)) {
          return '该名称已存在';
        }
        // 检查特殊字符
        if (!/^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/.test(value)) {
          return '名称只能包含字母、数字和中文';
        }
      },
    },
    description: {
      maxLength: 100,
    },
  },
  validateOnChange: true,  // 实时验证
});
```

---

## 4️⃣ 完整集成示例

### 创建集合对话框

```tsx
import {
  ColorPicker,
  CollectionPreview,
  useCollectionForm,
} from '@/features/collections/components';
import { Modal, Input, Button } from '@/components/ui';

function CreateCollectionDialog({ isOpen, onClose }) {
  const form = useCollectionForm({
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await createCollection(values);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title="创建新集合"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 实时预览 */}
        <CollectionPreview
          name={form.values.name}
          description={form.values.description}
          color={form.values.color}
          namePlaceholder="新建集合"
          animated
        />

        {/* 表单字段 */}
        <div className="space-y-4">
          <Input
            label="集合名称"
            value={form.values.name}
            onChange={(e) => form.setName(e.target.value)}
            error={form.errors.name}
            placeholder="输入集合名称..."
            autoFocus
          />

          <Input
            label="描述（可选）"
            value={form.values.description}
            onChange={(e) => form.setDescription(e.target.value)}
            error={form.errors.description}
            placeholder="简短描述..."
          />

          <ColorPicker
            label="选择颜色"
            value={form.values.color}
            onChange={form.setColor}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={form.isSubmitting}
            disabled={!form.isValid}
          >
            创建
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### 集合设置页面

```tsx
function CollectionSettingsPage({ collectionId }) {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const form = useCollectionForm({
    initialValues: collection,
    onSuccess: (values) => {
      // 更新本地状态
      setCollection(prev => ({ ...prev, ...values }));
    },
  });

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    setLoading(true);
    const data = await api.getCollection(collectionId);
    setCollection(data);
    form.reset();  // 重置为新数据
    setLoading(false);
  };

  if (loading) {
    return <CollectionPreviewSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">集合设置</h1>

      {/* 预览卡片 */}
      <CollectionPreview
        name={form.values.name}
        description={form.values.description}
        color={form.values.color}
        promptCount={collection.promptCount}
      />

      {/* 设置表单 */}
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await api.updateCollection(collectionId, values);
        })}
        className="space-y-4"
      >
        <Input
          label="名称"
          value={form.values.name}
          onChange={(e) => form.setName(e.target.value)}
          error={form.errors.name}
        />

        <Input
          label="描述"
          value={form.values.description}
          onChange={(e) => form.setDescription(e.target.value)}
          error={form.errors.description}
        />

        <ColorPicker
          label="主题颜色"
          value={form.values.color}
          onChange={form.setColor}
          size="lg"
        />

        {/* 保存按钮 */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={() => handleDelete(collectionId)}
          >
            删除集合
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={form.reset}
              disabled={!form.isDirty}
            >
              重置
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={form.isSubmitting}
              disabled={!form.isDirty || !form.isValid}
            >
              保存更改
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
```

---

## 5️⃣ 高级用法

### 多步骤表单

```tsx
function MultiStepCollectionForm() {
  const [step, setStep] = useState(1);
  const form = useCollectionForm();

  const nextStep = () => {
    if (form.validate()) {
      setStep(step + 1);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>步骤 1: 基本信息</h2>
          <Input
            label="名称"
            value={form.values.name}
            onChange={(e) => form.setName(e.target.value)}
            error={form.errors.name}
          />
          <Button onClick={nextStep}>下一步</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>步骤 2: 选择颜色</h2>
          <ColorPicker
            value={form.values.color}
            onChange={form.setColor}
            size="lg"
          />
          <Button onClick={form.handleSubmit(handleSubmit)}>
            完成
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 批量创建

```tsx
function BulkCreateCollections() {
  const [collections, setCollections] = useState([
    { name: '', color: 'pink' },
    { name: '', color: 'blue' },
  ]);

  const handleSubmitAll = async () => {
    const promises = collections.map(collection =>
      api.createCollection(collection)
    );
    await Promise.all(promises);
  };

  return (
    <div className="space-y-4">
      {collections.map((collection, index) => (
        <div key={index} className="flex gap-4">
          <Input
            value={collection.name}
            onChange={(e) => {
              const newCollections = [...collections];
              newCollections[index].name = e.target.value;
              setCollections(newCollections);
            }}
          />
          <ColorPicker
            value={collection.color}
            onChange={(color) => {
              const newCollections = [...collections];
              newCollections[index].color = color;
              setCollections(newCollections);
            }}
            size="sm"
          />
        </div>
      ))}

      <Button onClick={handleSubmitAll}>
        批量创建
      </Button>
    </div>
  );
}
```

---

## 💡 提示和技巧

### 1. 性能优化

```tsx
// ✅ 使用 useMemo 缓存计算结果
const filteredCollections = useMemo(() => {
  return collections.filter(c => c.color === selectedColor);
}, [collections, selectedColor]);

// ✅ 使用 useCallback 缓存回调
const handleColorChange = useCallback((color) => {
  setSelectedColor(color);
}, []);
```

### 2. 错误处理

```tsx
const form = useCollectionForm({
  onError: (error) => {
    // 自定义错误处理
    console.error('提交失败:', error);
    showNotification({
      type: 'error',
      message: error.message,
    });
  },
});
```

### 3. 自定义样式

```tsx
// 使用样式配置
import { COMPONENT_STYLES } from '@/features/collections/styles/collectionStyles';

<div className={COMPONENT_STYLES.preview.container}>
  {/* 你的内容 */}
</div>
```

---

## 🐛 常见问题

### Q: ColorPicker 颜色不生效？

A: 确保使用正确的颜色键，而不是颜色值：

```tsx
// ❌ 错误
<ColorPicker value="#ec4899" onChange={...} />

// ✅ 正确
<ColorPicker value="pink" onChange={...} />
```

### Q: 表单验证不工作？

A: 确保启用了验证：

```tsx
const form = useCollectionForm({
  validateOnChange: true,  // 启用实时验证
});

// 或手动验证
form.validate();
```

### Q: 如何重置表单？

```tsx
// 重置为初始值
form.reset();

// 重置为自定义值
form.reset({
  name: 'New Name',
  color: 'blue',
});
```

---

## 📚 更多资源

- [架构文档](./README.md)
- [样式配置](./styles/collectionStyles.ts)
- [验证工具](./utils/validation.ts)
- [主项目文档](../../README.md)
