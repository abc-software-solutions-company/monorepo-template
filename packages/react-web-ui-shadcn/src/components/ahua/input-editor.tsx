import React, { useEffect, useState } from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';

import 'react-quill/dist/quill.snow.css';

interface IInputEditorProps {
  value: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  modules?: Record<string, unknown>;
  formats?: string[];
  onChange: (value: string, editor?: UnprivilegedEditor) => void;
  onFocus?: () => void;
  onBlur?: (editor: UnprivilegedEditor) => void;
}

const DEFAULT_MODULES = {
  toolbar: [[{ list: 'ordered' }, { list: 'bullet' }, 'bold', 'italic', 'underline', 'link']],
};

const DEFAULT_FORMATS: string[] = ['bold', 'italic', 'underline', 'list', 'bullet', 'link'];

const InputEditor: React.FC<IInputEditorProps> = ({
  value = '',
  disabled = false,
  placeholder = 'Type something...',
  className = '',
  modules = DEFAULT_MODULES,
  formats = DEFAULT_FORMATS,
  onChange,
  onFocus,
  onBlur,
}) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typeof value === 'string') {
      setInternalValue(value);
    } else {
      setInternalValue('');
    }
  }, [value]);

  const handleChange = (newValue: string, _delta: any, _source: any, editor: UnprivilegedEditor) => {
    const isEditorEmpty = editor.getText().trim().length === 0;

    const cleanValue = isEditorEmpty ? '' : newValue;

    setInternalValue(cleanValue);
    onChange(cleanValue, editor);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (_previousRange: ReactQuill.Range, _source: any, editor: UnprivilegedEditor) => {
    const isEditorEmpty = editor.getText().trim().length === 0;

    if (isEditorEmpty && internalValue !== '') {
      setInternalValue('');
      onChange('', editor);
    }

    setIsFocused(false);
    onBlur?.(editor);
  };

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={internalValue}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className={`quill-simple ${isFocused ? 'focused' : ''}`}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

InputEditor.displayName = 'InputEditor';

export { InputEditor };
