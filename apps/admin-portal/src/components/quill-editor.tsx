import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

interface IQuillEditorProps {
  value: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const modules = {
  toolbar: [[{ list: 'ordered' }, { list: 'bullet' }, 'bold', 'italic', 'underline', 'link']],
};

const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link'];

const QuillEditor: React.FC<IQuillEditorProps> = ({
  value,
  disabled = false,
  placeholder = 'Type something...',
  className = '',
  onChange,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className="w-full">
      <ReactQuill
        value={value}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        className={`quill-simple ${isFocused ? 'focused' : ''} ${className}`}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default QuillEditor;
