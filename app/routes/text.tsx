import React from 'react';
import { Layout } from '../components/Layout';
import { Box, Typography, Paper } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import EditIcon from '@mui/icons-material/Edit';

export function meta() {
  return [
    { title: "文本編輯器" },
    { name: "description", content: "使用 Tiptap 富文本編輯器" },
  ];
}

/**
 * @component TiptapEditor
 * @description Tiptap 富文本編輯器組件
 * @returns {JSX.Element} 渲染的 Tiptap 編輯器
 */
const TiptapEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 開始編輯...</p>',
    immediatelyRender: false, // 解決 SSR 水合不匹配問題
  });

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(64, 175, 255, 0.2)',
        minHeight: '300px',
        position: 'relative',
      }}>
        <EditorContent editor={editor} />
      </Paper>
      
      {editor && (
        <>
          <FloatingMenu editor={editor}>
            <Paper sx={{
              p: 1,
              display: 'flex',
              gap: 1,
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(64, 175, 255, 0.2)',
            }}>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('heading', { level: 1 }) ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('heading', { level: 2 }) ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('bulletList') ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                • 列表
              </button>
            </Paper>
          </FloatingMenu>
          
          <BubbleMenu editor={editor}>
            <Paper sx={{
              p: 1,
              display: 'flex',
              gap: 1,
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(64, 175, 255, 0.2)',
            }}>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('bold') ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                粗體
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('italic') ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                斜體
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
                style={{
                  padding: '4px 8px',
                  background: editor.isActive('strike') ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                刪除線
              </button>
            </Paper>
          </BubbleMenu>
        </>
      )}
    </Box>
  );
};

/**
 * @component TextPage
 * @description 文本編輯頁面
 * @returns {JSX.Element} 渲染的文本編輯頁面
 */
export default function TextPage() {
  return (
    <Layout title="文本編輯器">
      <Box sx={{ mb: 6 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          pb: 1,
          borderBottom: '1px solid rgba(0, 120, 255, 0.1)'
        }}>
          <EditIcon sx={{ mr: 1, color: '#64ffda' }} />
          <Typography variant="h5" sx={{
            fontWeight: 'bold',
            color: '#0a192f',
          }}>
            文本編輯器
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ 
          color: '#8892b0', 
          mb: 4 
        }}>
          這是一個基於 Tiptap 的富文本編輯器。選擇文本時會出現氣泡菜單，在空白處點擊會出現浮動菜單。
        </Typography>
        
        <TiptapEditor />
      </Box>
    </Layout>
  );
}