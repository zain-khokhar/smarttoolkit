'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

import './DualMdxEditor.css';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/ui/alert';
import { 
  Copy, 
  Download, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Eye,
  Code,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { useDebouncedSync, useSyncState } from './hooks/useDebouncedSync';
import { createHtmlToMdxConverter } from './convert/htmlToMdx';
import { createMdxToHtmlConverter, validateMdx } from './convert/mdxToHtml';

/**
 * DualMdxEditor - Production-ready dual-pane MDX editor
 * 
 * Features:
 * - Rich WYSIWYG editor (TipTap) on the left
 * - MDX code editor (CodeMirror) on the right  
 * - Two-way sync with debouncing
 * - Paste handling for rich HTML content
 * - Image upload support
 * - Export/save functionality
 * - Resizable panes
 * - Error validation
 * 
 * @param {Object} props
 * @param {string} props.initialMdx - Initial MDX content
 * @param {Function} props.onSave - Save callback: (mdx) => {}
 * @param {Function} props.imageUploadHandler - Image upload: async (file) => url
 * @param {Object} props.customComponents - Custom MDX components for preview
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.darkMode - Enable dark mode for code editor
 */
export default function DualMdxEditor({
  initialMdx = '',
  onSave,
  imageUploadHandler,
  customComponents = {},
  className = '',
  darkMode = false,
}) {
  // State management
  const [mdxContent, setMdxContent] = useState(initialMdx);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50); // Percentage
  
  // Sync state management
  const { setLastUpdatedBy, shouldUpdate, clearLastUpdatedBy } = useSyncState();
  
  // Converter instances
  const htmlToMdxConverter = useRef();
  const mdxToHtmlConverter = useRef();
  
  // Initialize converters
  useEffect(() => {
    htmlToMdxConverter.current = createHtmlToMdxConverter({
      imageUploadHandler,
    });
    
    mdxToHtmlConverter.current = createMdxToHtmlConverter({
      customComponents,
    });
  }, [imageUploadHandler, customComponents]);

  // TipTap editor configuration
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none',
        'aria-label': 'Rich text editor',
      },
      // Handle paste events
      handlePaste: (view, event, slice) => {
        const html = event.clipboardData?.getData('text/html');
        if (html && html.trim()) {
          handleRichPaste(html);
          return true; // Prevent default paste
        }
        return false; // Allow default paste for plain text
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-4 border-gray-300',
          },
        },
      }),
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Highlight.configure({ 
        multicolor: true,
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: '<p>Start typing or paste your rich content here...</p>',
    onUpdate: ({ editor }) => {
      if (shouldUpdate('right')) {
        setLastUpdatedBy('left');
        debouncedLeftToRight();
      }
    },
  });

  // Convert editor content to MDX
  const convertEditorToMdx = useCallback(async () => {
    if (!editor || !htmlToMdxConverter.current) return;
    
    try {
      const html = editor.getHTML();
      const mdx = await htmlToMdxConverter.current.convert(html);
      setMdxContent(mdx);
      clearLastUpdatedBy();
    } catch (error) {
      console.error('Editor to MDX conversion failed:', error);
      setValidationErrors([{ message: `Conversion error: ${error.message}` }]);
    }
  }, [editor, clearLastUpdatedBy]);

  // Convert MDX to editor content
  const convertMdxToEditor = useCallback(async (newMdxContent) => {
    if (!editor || !mdxToHtmlConverter.current) return;
    
    try {
      const html = await mdxToHtmlConverter.current.convert(newMdxContent);
      editor.commands.setContent(html);
      clearLastUpdatedBy();
    } catch (error) {
      console.error('MDX to editor conversion failed:', error);
      setValidationErrors([{ message: `MDX parsing error: ${error.message}` }]);
    }
  }, [editor, clearLastUpdatedBy]);

  // Debounced conversion functions
  const debouncedLeftToRight = useDebouncedSync(convertEditorToMdx, 400);
  const debouncedRightToLeft = useDebouncedSync(convertMdxToEditor, 400);
  const debouncedValidation = useDebouncedSync(validateMdxContent, 800);

  // Handle rich paste from external sources
  const handleRichPaste = useCallback(async (html) => {
    if (!htmlToMdxConverter.current) return;
    
    try {
      const mdx = await htmlToMdxConverter.current.convert(html);
      
      // Process any images that need uploading
      const processedImages = await htmlToMdxConverter.current.processImages(html);
      
      if (processedImages.length > 0) {
        // Replace image URLs in the MDX with uploaded versions
        let updatedMdx = mdx;
        processedImages.forEach(({ originalSrc, newSrc }) => {
          updatedMdx = updatedMdx.replace(originalSrc, newSrc);
        });
        setMdxContent(updatedMdx);
      } else {
        setMdxContent(mdx);
      }
      
      setLastUpdatedBy('right');
      debouncedRightToLeft(mdx);
    } catch (error) {
      console.error('Rich paste handling failed:', error);
      setValidationErrors([{ message: `Paste error: ${error.message}` }]);
    }
  }, [debouncedRightToLeft, setLastUpdatedBy]);

  // Handle MDX code editor changes
  const handleMdxChange = useCallback((value) => {
    setMdxContent(value);
    
    if (shouldUpdate('left')) {
      setLastUpdatedBy('right');
      debouncedRightToLeft(value);
      debouncedValidation(value);
    }
  }, [shouldUpdate, setLastUpdatedBy, debouncedRightToLeft, debouncedValidation]);

  // Validate MDX content
  async function validateMdxContent(mdx) {
    if (!mdx.trim()) {
      setValidationErrors([]);
      return;
    }
    
    setIsValidating(true);
    try {
      const result = await validateMdx(mdx);
      setValidationErrors(result.errors || []);
    } catch (error) {
      setValidationErrors([{ message: error.message }]);
    } finally {
      setIsValidating(false);
    }
  }

  // Initialize with initial MDX content
  useEffect(() => {
    if (initialMdx && editor) {
      setMdxContent(initialMdx);
      convertMdxToEditor(initialMdx);
    }
  }, [initialMdx, editor, convertMdxToEditor]);

  // Export functions
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(mdxContent);
    }
  }, [onSave, mdxContent]);

  const handleExport = useCallback(() => {
    const blob = new Blob([mdxContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article.mdx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mdxContent]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mdxContent);
      // You could add a toast notification here
      console.log('MDX copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [mdxContent]);

  const handleRevert = useCallback(() => {
    setMdxContent(initialMdx);
    if (editor) {
      convertMdxToEditor(initialMdx);
    }
    setValidationErrors([]);
  }, [initialMdx, editor, convertMdxToEditor]);

  // Resize handler
  const handleResize = useCallback((e) => {
    if (e.type === 'mousemove') {
      const containerWidth = e.currentTarget.offsetWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      setLeftPaneWidth(Math.max(20, Math.min(80, newWidth)));
    }
  }, []);

  if (!editor) {
    return <div className="flex items-center justify-center h-64">Loading editor...</div>;
  }

  return (
    <div className={`dual-mdx-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">MDX Editor</h2>
          
          {validationErrors.length > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">{validationErrors.length} error(s)</span>
            </div>
          )}
          
          {isValidating && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent mr-2"></div>
              <span className="text-sm">Validating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="preview-mode" className="text-sm">Preview</Label>
            <Switch
              id="preview-mode"
              checked={showPreview}
              onCheckedChange={setShowPreview}
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          {onSave && (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={handleRevert}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Revert
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="mx-4 mt-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <div>
            <h4 className="font-medium mb-2">MDX Validation Errors:</h4>
            <ul className="text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700">
                  {error.line && `Line ${error.line}: `}{error.message}
                </li>
              ))}
            </ul>
          </div>
        </Alert>
      )}

      {/* Editor Panes */}
      <div className="flex h-[600px] overflow-hidden">
        {/* Left Pane - Rich Editor */}
        <div 
          className="border-r bg-white overflow-auto"
          style={{ width: `${leftPaneWidth}%` }}
        >
          <div className="p-2 bg-gray-50 border-b flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">WYSIWYG Editor</span>
          </div>
          
          <EditorContent 
            editor={editor} 
            className="h-full overflow-auto"
          />
        </div>

        {/* Resize Handle */}
        <div 
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = leftPaneWidth;
            
            const handleMouseMove = (moveEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const container = e.target.parentElement;
              const newWidth = startWidth + (deltaX / container.offsetWidth) * 100;
              setLeftPaneWidth(Math.max(20, Math.min(80, newWidth)));
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Right Pane - Code Editor */}
        <div 
          className="bg-white overflow-auto"
          style={{ width: `${100 - leftPaneWidth}%` }}
        >
          <div className="p-2 bg-gray-50 border-b flex items-center">
            <Code className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">MDX Source</span>
          </div>
          
          <CodeMirror
            value={mdxContent}
            onChange={handleMdxChange}
            extensions={[markdown()]}
            theme={darkMode ? oneDark : undefined}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
            className="h-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Export types and utilities
export { createHtmlToMdxConverter } from './convert/htmlToMdx';
export { createMdxToHtmlConverter } from './convert/mdxToHtml';
export { useDebouncedSync } from './hooks/useDebouncedSync';