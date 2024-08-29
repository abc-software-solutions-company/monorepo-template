import { forwardRef } from 'react';
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor,
  Editor,
  EditorConfig,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  HtmlEmbedEditing,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  SourceEditing,
  Strikethrough,
  Table,
  TableToolbar,
  TextTransformation,
  Underline,
} from 'ckeditor5';
import classNames from 'classnames';
import { CKEditor as MyEditor } from '@ckeditor/ckeditor5-react';

import FileManager from './file-manager/file-manager';

import 'ckeditor5/ckeditor5.css';
import './ck-editor.scss';

interface ICKEditorProps {
  className?: string;
  value?: string;
  toolbar?: string[];
  minHeight?: number;
  onFocus?: (event: unknown, editor: Editor) => void;
  onBlur?: (event: unknown, editor: Editor) => void;
  onReady?: (editor: Editor) => void;
  onChange: (data: string) => void;
  onShowFileManager?: () => void;
}

const defaultToolbar = [
  'heading',
  'undo',
  'redo',
  '|',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  '|',
  'alignment',
  'bulletedList',
  'numberedList',
  'outdent',
  'indent',
  'link',
  'blockQuote',
  'insertTable',
  'mediaEmbed',
  'fileManager',
  'sourceEditing',
];

const CKEditor = forwardRef<Editor, ICKEditorProps>(
  ({ className, value, toolbar, minHeight, onReady, onFocus, onBlur, onChange, onShowFileManager }, ref) => {
    return (
      <div className={classNames('wysiwyg prose-sm', className)}>
        <MyEditor
          editor={ClassicEditor}
          config={
            {
              toolbar: toolbar ?? defaultToolbar,
              plugins: [
                Essentials,
                Autoformat,
                Bold,
                Italic,
                Underline,
                Strikethrough,
                BlockQuote,
                Heading,
                Image,
                ImageResize,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Indent,
                Link,
                List,
                MediaEmbed,
                Paragraph,
                PasteFromOffice,
                PictureEditing,
                Table,
                TableToolbar,
                TextTransformation,
                Alignment,
                GeneralHtmlSupport,
                HtmlEmbedEditing,
                SourceEditing,
                FileManager,
              ],
              image: {
                toolbar: [
                  'imageStyle:alignLeft',
                  'imageStyle:alignRight',
                  '|',
                  'imageStyle:alignBlockLeft',
                  'imageStyle:alignCenter',
                  'imageStyle:alignBlockRight',
                  '|',
                  'toggleImageCaption',
                  'imageTextAlternative',
                ],
              },
              actions: { showFileManager: onShowFileManager },
            } as EditorConfig
          }
          data={value || ''}
          onReady={editor => {
            if (minHeight) {
              editor.editing.view.change(writer => {
                const root = editor.editing.view.document.getRoot();

                if (root) {
                  writer.setStyle('height', minHeight + 'px', root);
                }
              });
            }

            onReady?.(editor);
            if (ref) {
              if (typeof ref === 'function') {
                ref(editor);
              } else {
                ref.current = editor;
              }
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event, editor) => {
            const text = editor.getData();

            onChange(text);
          }}
        />
      </div>
    );
  }
);

CKEditor.displayName = 'CKEditor';

export default CKEditor;
