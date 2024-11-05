import React, { useEffect, useState, useCallback } from 'react';
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
  const [quillInstance, setQuillInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setInternalValue(value);
    } else {
      setInternalValue('');
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: string, _delta: any, _source: any, editor: UnprivilegedEditor) => {
      const isEditorEmpty = editor.getText().trim().length === 0;
      const cleanValue = isEditorEmpty ? '' : newValue;

      setInternalValue(cleanValue);
      onChange(cleanValue, editor);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(
    (_previousRange: ReactQuill.Range, _source: any, editor: UnprivilegedEditor) => {
      const isEditorEmpty = editor.getText().trim().length === 0;

      if (isEditorEmpty && internalValue !== '') {
        setInternalValue('');
        onChange('', editor);
      }

      setIsFocused(false);
      onBlur?.(editor);
    },
    [internalValue, onChange, onBlur]
  );

  useEffect(() => {
    if (quillInstance) {
      const editor = quillInstance.getEditor();

      const blurHandler = () => {
        const unprivilegedEditor = quillInstance.makeUnprivilegedEditor(editor);
        handleBlur(null, null, unprivilegedEditor);
      };

      editor.root.addEventListener('blur', blurHandler);

      return () => {
        editor.root.removeEventListener('blur', blurHandler);
      };
    }
  }, [quillInstance, handleBlur]);

  return (
    <div className={className}>
      <ReactQuill
        ref={el => setQuillInstance(el)}
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
