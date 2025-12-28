/**
 * useForm Hook
 * 通用表单管理 Hook
 *
 * 提供完整的表单状态管理、验证、提交等功能
 * 支持字段级验证、表单级验证、异步验证等
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * 表单字段值类型
 */
export type FormValues = Record<string, any>;

/**
 * 表单错误类型
 */
export type FormErrors<T extends FormValues = FormValues> = {
  [K in keyof T]?: string;
};

/**
 * 表单触摸状态类型
 */
export type FormTouched<T extends FormValues = FormValues> = {
  [K in keyof T]?: boolean;
};

/**
 * 字段验证规则
 */
export interface FieldValidationRule<T = any> {
  /**
   * 是否必填
   */
  required?: boolean | string; // true 或自定义错误消息

  /**
   * 最小长度
   */
  minLength?: number | { value: number; message?: string };

  /**
   * 最大长度
   */
  maxLength?: number | { value: number; message?: string };

  /**
   * 最小值
   */
  min?: number | { value: number; message?: string };

  /**
   * 最大值
   */
  max?: number | { value: number; message?: string };

  /**
   * 正则表达式模式
   */
  pattern?: RegExp | { value: RegExp; message?: string };

  /**
   * 自定义验证函数
   */
  validate?: (value: T, values: FormValues) => string | undefined | Promise<string | undefined>;

  /**
   * 自定义验证函数（多个）
   */
  validates?: Array<(value: T, values: FormValues) => string | undefined | Promise<string | undefined>>;
}

/**
 * 表单验证规则集合
 */
export type ValidationRules<T extends FormValues = FormValues> = {
  [K in keyof T]?: FieldValidationRule<T[K]>;
};

/**
 * 表单配置选项
 */
export interface UseFormOptions<T extends FormValues = FormValues> {
  /**
   * 初始值
   */
  initialValues: T;

  /**
   * 验证规则
   */
  validationRules?: ValidationRules<T>;

  /**
   * 是否在值改变时验证
   * @default false
   */
  validateOnChange?: boolean;

  /**
   * 是否在失焦时验证
   * @default true
   */
  validateOnBlur?: boolean;

  /**
   * 是否在提交时验证
   * @default true
   */
  validateOnSubmit?: boolean;

  /**
   * 提交成功回调
   */
  onSubmit?: (values: T) => void | Promise<void>;

  /**
   * 提交成功回调
   */
  onSuccess?: (values: T) => void | Promise<void>;

  /**
   * 提交失败回调
   */
  onError?: (error: Error) => void;

  /**
   * 表单值改变时的回调
   */
  onChange?: (values: T) => void;

  /**
   * 是否在卸载时重置表单
   * @default false
   */
  resetOnUnmount?: boolean;
}

/**
 * 表单返回值
 */
export interface UseFormReturn<T extends FormValues = FormValues> {
  /**
   * 表单值
   */
  values: T;

  /**
   * 表单错误
   */
  errors: FormErrors<T>;

  /**
   * 字段触摸状态
   */
  touched: FormTouched<T>;

  /**
   * 是否正在提交
   */
  isSubmitting: boolean;

  /**
   * 是否已修改（与初始值不同）
   */
  isDirty: boolean;

  /**
   * 是否有效（无验证错误）
   */
  isValid: boolean;

  /**
   * 是否已被触摸过
   */
  isTouched: boolean;

  /**
   * 设置字段值
   */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;

  /**
   * 设置字段错误
   */
  setFieldError: <K extends keyof T>(field: K, error: string | undefined) => void;

  /**
   * 设置字段触摸状态
   */
  setFieldTouched: <K extends keyof T>(field: K, touched?: boolean) => void;

  /**
   * 设置多个字段值
   */
  setValues: (values: Partial<T>) => void;

  /**
   * 设置多个字段错误
   */
  setErrors: (errors: FormErrors<T>) => void;

  /**
   * 处理字段变化
   */
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;

  /**
   * 处理字段失焦
   */
  handleBlur: <K extends keyof T>(field: K) => () => void;

  /**
   * 处理表单提交
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;

  /**
   * 验证单个字段
   */
  validateField: <K extends keyof T>(field: K) => Promise<string | undefined>;

  /**
   * 验证所有字段
   */
  validate: () => Promise<FormErrors<T>>;

  /**
   * 重置表单
   */
  reset: (newValues?: T) => void;

  /**
   * 重置字段
   */
  resetField: <K extends keyof T>(field: K) => void;

  /**
   * 获取字段属性（方便传递给 Input 组件）
   */
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error: string | undefined;
  };

  /**
   * 获取字段元数据
   */
  getFieldMeta: <K extends keyof T>(field: K) => {
    value: T[K];
    error: string | undefined;
    touched: boolean;
    dirty: boolean;
  };
}

/**
 * 验证单个字段
 */
async function validateFieldValue<T = any>(
  value: T,
  rules: FieldValidationRule<T> | undefined,
  allValues: FormValues
): Promise<string | undefined> {
  if (!rules) return undefined;

  // 必填验证
  if (rules.required) {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      return typeof rules.required === 'string'
        ? rules.required
        : 'This field is required';
    }
  }

  // 如果值为空且非必填，跳过其他验证
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  // 字符串长度验证
  if (typeof value === 'string') {
    // 最小长度
    if (rules.minLength) {
      const minLengthRule =
        typeof rules.minLength === 'number'
          ? { value: rules.minLength }
          : rules.minLength;

      if (value.length < minLengthRule.value) {
        return (
          minLengthRule.message ||
          `Minimum length is ${minLengthRule.value} characters`
        );
      }
    }

    // 最大长度
    if (rules.maxLength) {
      const maxLengthRule =
        typeof rules.maxLength === 'number'
          ? { value: rules.maxLength }
          : rules.maxLength;

      if (value.length > maxLengthRule.value) {
        return (
          maxLengthRule.message ||
          `Maximum length is ${maxLengthRule.value} characters`
        );
      }
    }
  }

  // 数值范围验证
  if (typeof value === 'number') {
    // 最小值
    if (rules.min !== undefined) {
      const minRule =
        typeof rules.min === 'number' ? { value: rules.min } : rules.min;

      if (value < minRule.value) {
        return minRule.message || `Minimum value is ${minRule.value}`;
      }
    }

    // 最大值
    if (rules.max !== undefined) {
      const maxRule =
        typeof rules.max === 'number' ? { value: rules.max } : rules.max;

      if (value > maxRule.value) {
        return maxRule.message || `Maximum value is ${maxRule.value}`;
      }
    }
  }

  // 正则表达式验证
  if (rules.pattern && typeof value === 'string') {
    const patternRule =
      rules.pattern instanceof RegExp
        ? { value: rules.pattern }
        : rules.pattern;

    if (!patternRule.value.test(value)) {
      return patternRule.message || 'Invalid format';
    }
  }

  // 自定义验证函数
  if (rules.validate) {
    const error = await rules.validate(value, allValues);
    if (error) return error;
  }

  // 多个自定义验证函数
  if (rules.validates && rules.validates.length > 0) {
    for (const validateFn of rules.validates) {
      const error = await validateFn(value, allValues);
      if (error) return error;
    }
  }

  return undefined;
}

/**
 * useForm Hook
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: {
 *     email: '',
 *     password: '',
 *   },
 *   validationRules: {
 *     email: {
 *       required: true,
 *       pattern: {
 *         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 *         message: 'Invalid email address',
 *       },
 *     },
 *     password: {
 *       required: true,
 *       minLength: { value: 8, message: 'Password must be at least 8 characters' },
 *     },
 *   },
 *   onSubmit: async (values) => {
 *     await login(values);
 *   },
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <Input {...form.getFieldProps('email')} />
 *     <Input {...form.getFieldProps('password')} type="password" />
 *     <button type="submit" disabled={!form.isValid || form.isSubmitting}>
 *       Submit
 *     </button>
 *   </form>
 * );
 * ```
 */
export function useForm<T extends FormValues = FormValues>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationRules,
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    onSubmit,
    onSuccess,
    onError,
    onChange,
    resetOnUnmount = false,
  } = options;

  // 状态
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用 ref 存储初始值和回调，避免闭包问题
  const initialValuesRef = useRef(initialValues);
  const onSubmitRef = useRef(onSubmit);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onChangeRef.current = onChange;
  }, [onSubmit, onSuccess, onError, onChange]);

  // 计算派生状态
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);
  }, [values]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const isTouched = useMemo(() => {
    return Object.values(touched).some((t) => t === true);
  }, [touched]);

  /**
   * 验证单个字段
   */
  const validateField = useCallback(
    async <K extends keyof T>(field: K): Promise<string | undefined> => {
      const rules = validationRules?.[field];
      const value = values[field];
      const error = await validateFieldValue(value, rules, values);

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));

      return error;
    },
    [values, validationRules]
  );

  /**
   * 验证所有字段
   */
  const validate = useCallback(async (): Promise<FormErrors<T>> => {
    if (!validationRules) return {};

    const newErrors: FormErrors<T> = {};

    await Promise.all(
      Object.keys(validationRules).map(async (field) => {
        const error = await validateFieldValue(
          values[field as keyof T],
          validationRules[field as keyof T],
          values
        );
        if (error) {
          newErrors[field as keyof T] = error;
        }
      })
    );

    setErrors(newErrors);
    return newErrors;
  }, [values, validationRules]);

  /**
   * 设置字段值
   */
  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const newValues = { ...prev, [field]: value };
        onChangeRef.current?.(newValues);
        return newValues;
      });

      if (validateOnChange) {
        validateField(field);
      }
    },
    [validateOnChange, validateField]
  );

  /**
   * 设置字段错误
   */
  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    []
  );

  /**
   * 设置字段触摸状态
   */
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, isTouched: boolean = true) => {
      setTouched((prev) => ({
        ...prev,
        [field]: isTouched,
      }));

      if (validateOnBlur && isTouched) {
        validateField(field);
      }
    },
    [validateOnBlur, validateField]
  );

  /**
   * 处理字段变化
   */
  const handleChange = useCallback(
    <K extends keyof T>(field: K) => (value: T[K]) => {
      setFieldValue(field, value);
    },
    [setFieldValue]
  );

  /**
   * 处理字段失焦
   */
  const handleBlur = useCallback(
    <K extends keyof T>(field: K) => () => {
      setFieldTouched(field, true);
    },
    [setFieldTouched]
  );

  /**
   * 处理表单提交
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // 标记所有字段为已触摸
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as FormTouched<T>
      );
      setTouched(allTouched);

      // 验证表单
      let validationErrors: FormErrors<T> = {};
      if (validateOnSubmit) {
        validationErrors = await validate();
      }

      // 如果有错误，不提交
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      // 提交表单
      setIsSubmitting(true);
      try {
        await onSubmitRef.current?.(values);
        await onSuccessRef.current?.(values);
      } catch (error) {
        console.error('Form submission error:', error);
        onErrorRef.current?.(error as Error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, validateOnSubmit]
  );

  /**
   * 重置表单
   */
  const reset = useCallback((newValues?: T) => {
    const resetValues = newValues || initialValuesRef.current;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    if (newValues) {
      initialValuesRef.current = newValues;
    }
  }, []);

  /**
   * 重置字段
   */
  const resetField = useCallback(<K extends keyof T>(field: K) => {
    setFieldValue(field, initialValuesRef.current[field]);
    setFieldError(field, undefined);
    setFieldTouched(field, false);
  }, [setFieldValue, setFieldError, setFieldTouched]);

  /**
   * 设置多个字段值
   */
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => {
      const updated = { ...prev, ...newValues };
      onChangeRef.current?.(updated);
      return updated;
    });
  }, []);

  /**
   * 获取字段属性
   */
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: errors[field],
    }),
    [values, errors, handleChange, handleBlur]
  );

  /**
   * 获取字段元数据
   */
  const getFieldMeta = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      error: errors[field],
      touched: touched[field] || false,
      dirty: values[field] !== initialValuesRef.current[field],
    }),
    [values, errors, touched]
  );

  // 卸载时重置
  useEffect(() => {
    return () => {
      if (resetOnUnmount) {
        reset();
      }
    };
  }, [resetOnUnmount, reset]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    isTouched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues: setMultipleValues,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validate,
    reset,
    resetField,
    getFieldProps,
    getFieldMeta,
  };
}

export default useForm;
