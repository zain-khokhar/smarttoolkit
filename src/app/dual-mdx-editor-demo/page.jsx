'use client';

import { useState } from 'react';
import DualMdxEditor from '@/components/dual-mdx-editor/DualMdxEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Image, 
  Code, 
  Copy, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DEMO_CONTENT = `# Welcome to the Dual MDX Editor

This is a **powerful** editor that supports *rich formatting* and MDX components.

## Features

- Real-time WYSIWYG ↔ MDX synchronization
- Rich paste support from Google Docs, Word, and web pages  
- Image upload with drag & drop
- Custom MDX components
- Export and save functionality

### Code Examples

Here's some JavaScript:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Custom Components

<Callout type="info">
This is an info callout component that demonstrates custom MDX components in action.
</Callout>

<Alert variant="default">
This is an alert component with **markdown** formatting inside.
</Alert>

### Lists and Links

- First item with [a link](https://example.com)
- Second item with **bold text**
- Third item with *italic text*

1. Numbered list item
2. Another numbered item
3. Final item

### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| WYSIWYG Editor | ✅ | TipTap-based |
| MDX Code Editor | ✅ | CodeMirror-based |
| Two-way Sync | ✅ | Debounced |
| Image Upload | ✅ | Customizable |
| Export | ✅ | Multiple formats |

> This is a blockquote with some **important** information.

---

Try pasting rich content from Google Docs or Word to see the magic happen! ✨`;

// Custom components for MDX preview
const customComponents = {
  Callout: ({ children, type = 'info', ...props }) => {
    const bgColor = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    }[type] || 'bg-gray-50 border-gray-200 text-gray-800';

    return (
      <div 
        className={`p-4 border-l-4 rounded-md my-4 ${bgColor}`} 
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {type === 'info' && <AlertCircle className="h-5 w-5" />}
            {type === 'success' && <CheckCircle className="h-5 w-5" />}
            {type === 'warning' && <AlertCircle className="h-5 w-5" />}
            {type === 'error' && <AlertCircle className="h-5 w-5" />}
          </div>
          <div className="ml-3">
            {children}
          </div>
        </div>
      </div>
    );
  },

  Alert: ({ children, variant = 'default', ...props }) => (
    <div 
      className={`p-4 rounded-lg border my-4 ${
        variant === 'destructive' 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-blue-50 border-blue-200 text-blue-800'
      }`}
      {...props}
    >
      {children}
    </div>
  ),

  Badge: ({ children, variant = 'default', ...props }) => (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variant === 'secondary' 
          ? 'bg-gray-100 text-gray-800' 
          : 'bg-blue-100 text-blue-800'
      }`}
      {...props}
    >
      {children}
    </span>
  ),
};

export default function DualMdxEditorDemo() {
  const [savedContent, setSavedContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Mock image upload handler
  const handleImageUpload = async (file) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, upload to your preferred service
    // For demo, create a data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async (mdxContent) => {
    setSaveStatus('Saving...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSavedContent(mdxContent);
      setSaveStatus('Saved successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Save failed!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dual MDX Editor Demo
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          A production-ready editor with WYSIWYG and MDX code editing capabilities.
        </p>
        
        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className="bg-blue-100 text-blue-800">
            <FileText className="h-3 w-3 mr-1" />
            WYSIWYG Editor
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Code className="h-3 w-3 mr-1" />
            MDX Support
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Image className="h-3 w-3 mr-1" />
            Image Upload
          </Badge>
          <Badge className="bg-orange-100 text-orange-800">
            <Copy className="h-3 w-3 mr-1" />
            Rich Paste
          </Badge>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
            <CardDescription>
              Try these features to see the editor in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Rich Paste Testing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Copy content from Google Docs</li>
                  <li>• Paste formatted text from Word</li>
                  <li>• Copy tables and lists from web pages</li>
                  <li>• Paste images from clipboard</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Two-Way Sync</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Edit in WYSIWYG → see MDX update</li>
                  <li>• Edit MDX code → see visual update</li>
                  <li>• Changes sync with 400ms debounce</li>
                  <li>• Real-time validation and error reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save status */}
      {saveStatus && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveStatus.includes('Saving') 
            ? 'bg-blue-50 text-blue-800' 
            : saveStatus.includes('successfully') 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {saveStatus}
        </div>
      )}

      {/* Main Editor */}
      <div className="mb-8">
        <DualMdxEditor
          initialMdx={DEMO_CONTENT}
          onSave={handleSave}
          imageUploadHandler={handleImageUpload}
          customComponents={customComponents}
          className="border-2 border-gray-200 rounded-lg"
        />
      </div>

      {/* Saved Content Display */}
      {savedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Last Saved Content
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(savedContent)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy MDX
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {savedContent}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Implementation Example */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Example</CardTitle>
          <CardDescription>
            Basic usage in your Next.js application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import DualMdxEditor from '@/components/dual-mdx-editor/DualMdxEditor';

export default function MyEditor() {
  const handleSave = (mdxContent) => {
    // Save to your backend
    console.log('Saving:', mdxContent);
  };

  const handleImageUpload = async (file) => {
    // Upload to your preferred service
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const { url } = await response.json();
    return url;
  };

  return (
    <DualMdxEditor
      initialMdx="# Start writing..."
      onSave={handleSave}
      imageUploadHandler={handleImageUpload}
    />
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}