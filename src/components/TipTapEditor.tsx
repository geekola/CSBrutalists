import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  theme: {
    bg: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
  };
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onChange, theme }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {editor && (
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          backgroundColor: theme.secondary,
          padding: '0.5rem',
          borderBottom: `1px solid ${theme.secondary}`,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            style={{
              backgroundColor: editor.isActive('bold') ? theme.accent : 'transparent',
              color: editor.isActive('bold') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleBold().run() ? 0.5 : 1,
            }}
          >
            BOLD
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            style={{
              backgroundColor: editor.isActive('italic') ? theme.accent : 'transparent',
              color: editor.isActive('italic') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleItalic().run() ? 0.5 : 1,
            }}
          >
            ITALIC
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            style={{
              backgroundColor: editor.isActive('underline') ? theme.accent : 'transparent',
              color: editor.isActive('underline') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleUnderline().run() ? 0.5 : 1,
            }}
          >
            UNDERLINE
          </button>
          <div style={{ width: '1px', backgroundColor: theme.secondary }} />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            style={{
              backgroundColor: editor.isActive('bulletList') ? theme.accent : 'transparent',
              color: editor.isActive('bulletList') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleBulletList().run() ? 0.5 : 1,
            }}
          >
            BULLET LIST
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            style={{
              backgroundColor: editor.isActive('orderedList') ? theme.accent : 'transparent',
              color: editor.isActive('orderedList') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleOrderedList().run() ? 0.5 : 1,
            }}
          >
            ORDERED LIST
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
            style={{
              backgroundColor: editor.isActive('heading', { level: 3 }) ? theme.accent : 'transparent',
              color: editor.isActive('heading', { level: 3 }) ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleHeading({ level: 3 }).run() ? 0.5 : 1,
            }}
          >
            HEADING
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            style={{
              backgroundColor: editor.isActive('codeBlock') ? theme.accent : 'transparent',
              color: editor.isActive('codeBlock') ? theme.bg : theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().toggleCodeBlock().run() ? 0.5 : 1,
            }}
          >
            CODE
          </button>
          <div style={{ width: '1px', backgroundColor: theme.secondary }} />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            style={{
              backgroundColor: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().undo().run() ? 0.5 : 1,
            }}
          >
            UNDO
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            style={{
              backgroundColor: 'transparent',
              color: theme.text,
              border: `1px solid ${theme.secondary}`,
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'inherit',
              opacity: !editor.can().chain().focus().redo().run() ? 0.5 : 1,
            }}
          >
            REDO
          </button>
        </div>
      )}
      <div
        style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.secondary}`,
          padding: '1rem',
          minHeight: '200px',
          color: theme.text,
          fontFamily: 'inherit',
        }}
        className="tiptap-editor"
      >
        <EditorContent editor={editor} style={{ outline: 'none' }} />
      </div>
    </div>
  );
};

export default TipTapEditor;
