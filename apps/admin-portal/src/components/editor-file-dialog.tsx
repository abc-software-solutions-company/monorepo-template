import { FC } from 'react';
import { type Editor } from 'ckeditor5';

import { IMAGE_BASE_URL } from '@/constants/file.constant';

import FileDialog from '@/modules/files/components/file-dialog';
import {
  VALID_AUDIO_MIME_TYPES,
  VALID_COMPRESS_MIME_TYPES,
  VALID_DOCUMENT_MIME_TYPES,
  VALID_IMAGE_MIME_TYPES,
  VALID_VIDEO_MIME_TYPES,
} from '@/modules/files/constants/files.constant';

type EditorFileDialogProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editorRef: React.MutableRefObject<Editor | null>;
};

const EditorFileDialog: FC<EditorFileDialogProps> = ({ visible, setVisible, editorRef }) => {
  return (
    <FileDialog
      visible={visible}
      type={'multiple'}
      selectedItems={[]}
      onCancel={() => {
        setVisible(false);
      }}
      onSelectClick={files => {
        const editor = editorRef.current;

        if (editor) {
          editor.model.change(writer => {
            const selection = editor.model.document.selection;
            const imageItems = files.filter(x => VALID_IMAGE_MIME_TYPES.includes(x.mime));
            const fileItems = files.filter(x => [...VALID_DOCUMENT_MIME_TYPES, ...VALID_COMPRESS_MIME_TYPES].includes(x.mime));
            const mediaItems = files.filter(x => [...VALID_AUDIO_MIME_TYPES, ...VALID_VIDEO_MIME_TYPES].includes(x.mime));

            // Insert media
            mediaItems.forEach(media => {
              const fileUrl = IMAGE_BASE_URL + media.uniqueName;
              const embed = writer.createElement('media', { url: fileUrl });
              const endPosition = editor.model.createPositionAt(embed, 'end');

              editor.model.insertContent(embed, selection);

              selection._setFocus(endPosition);
            });

            // Insert files
            fileItems.forEach(file => {
              const fileUrl = IMAGE_BASE_URL + file.uniqueName;
              const link = writer.createText(file.caption + file.ext);

              writer.setAttribute('linkHref', fileUrl, link);
              editor.model.insertContent(link, selection);
            });

            // Insert images
            imageItems.forEach(image => {
              const fileUrl = IMAGE_BASE_URL + image.uniqueName;

              const imageElement = writer.createElement('imageBlock', {
                src: fileUrl,
              });
              const endPosition = editor.model.createPositionAt(imageElement, 'end');

              editor.model.insertContent(imageElement, selection);

              selection._setFocus(endPosition);
            });
          });
        }

        setVisible(false);
      }}
    />
  );
};

export default EditorFileDialog;
