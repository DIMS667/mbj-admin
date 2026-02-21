// src/components/RichEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Heading2, Heading3, Quote, Code, Undo, Redo
} from 'lucide-react'

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    title={title}
    className={`p-1.5 rounded-lg text-sm transition-all duration-150 ${
      active
        ? 'bg-primary-600/30 text-primary-400'
        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
    }`}
  >
    {children}
  </button>
)

export default function RichEditor({ value, onChange, placeholder = 'Rédigez votre contenu...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('URL du lien :')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="bg-surface-900 border border-surface-200/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500/50 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-surface-200/10 flex-wrap">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-surface-200/10 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste">
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
          <Code className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Lien">
          <LinkIcon className="w-4 h-4" />
        </ToolbarBtn>
        <div className="w-px h-5 bg-surface-200/10 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Annuler">
          <Undo className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Rétablir">
          <Redo className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* Zone d'édition */}
      <EditorContent editor={editor} />
    </div>
  )
}