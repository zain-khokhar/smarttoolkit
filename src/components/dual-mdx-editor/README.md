# Dual MDX Editor

A production-ready React component that provides a side-by-side WYSIWYG and MDX code editor with real-time synchronization.

## Features

- **Rich WYSIWYG Editor** (TipTap) with full formatting support
- **MDX Code Editor** (CodeMirror) with syntax highlighting
- **Two-way Sync** with debouncing to prevent infinite loops  
- **Rich Paste Support** from Google Docs, Word, and web pages
- **Image Upload Integration** with customizable upload handler
- **Export/Save Functionality** with multiple format options
- **Resizable Panes** for optimal workspace management
- **MDX Validation** with real-time error reporting
- **Accessibility** with proper ARIA labels and keyboard navigation

## Installation

The component requires several peer dependencies:

```bash
npm install @mdx-js/mdx @mdx-js/react turndown remark rehype remark-parse rehype-stringify unified @uiw/react-codemirror @codemirror/lang-markdown @codemirror/theme-one-dark @tiptap/react @tiptap/starter-kit
```

## Basic Usage

```jsx
import DualMdxEditor from '@/components/dual-mdx-editor/DualMdxEditor';

function MyPage() {
  const handleSave = (mdxContent) => {
    console.log('Saving MDX:', mdxContent);
    // Save to your backend/database
  };

  const handleImageUpload = async (file) => {
    // Upload to your preferred service (UploadThing, Cloudinary, etc.)
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
      initialMdx="# Welcome\n\nStart editing your content here..."
      onSave={handleSave}
      imageUploadHandler={handleImageUpload}
    />
  );
}
```

## Advanced Configuration

```jsx
import DualMdxEditor from '@/components/dual-mdx-editor/DualMdxEditor';

// Custom MDX components for preview
const customComponents = {
  Callout: ({ children, type = 'info' }) => (
    <div className={`callout callout-${type}`}>
      {children}
    </div>
  ),
  
  VideoEmbed: ({ src, title }) => (
    <div className="video-wrapper">
      <iframe src={src} title={title} />
    </div>
  ),
};

function AdvancedEditor() {
  const [content, setContent] = useState('');
  
  return (
    <DualMdxEditor
      initialMdx={content}
      onSave={(mdx) => {
        setContent(mdx);
        // Auto-save every change
        saveToDB(mdx);
      }}
      imageUploadHandler={uploadToCloudinary}
      customComponents={customComponents}
      darkMode={true}
      className="min-h-screen"
    />
  );
}
```

## Integration with Next.js App Router

Create a new page in your Next.js app:

```jsx
// app/editor/page.js
'use client';

import { useState, useEffect } from 'react';
import DualMdxEditor from '@/components/dual-mdx-editor/DualMdxEditor';

export default function EditorPage() {
  const [initialContent, setInitialContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing content
    loadContent().then(content => {
      setInitialContent(content);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (mdxContent) => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: mdxContent }),
      });
      
      // Show success toast
      console.log('Content saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Content Editor</h1>
      <DualMdxEditor
        initialMdx={initialContent}
        onSave={handleSave}
        imageUploadHandler={uploadImage}
      />
    </div>
  );
}

async function loadContent() {
  // Load from your data source
  const response = await fetch('/api/content');
  const data = await response.json();
  return data.content || '# New Document\n\nStart writing...';
}

async function uploadImage(file) {
  // Example UploadThing integration
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/uploadthing', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
}
```

## Server-Side MDX Compilation (Optional)

For heavy workloads, you can offload MDX compilation to the server:

```jsx
// app/api/compile-mdx/route.js
import { compile } from '@mdx-js/mdx';

export async function POST(request) {
  try {
    const { mdx } = await request.json();
    
    const compiled = await compile(mdx, {
      outputFormat: 'function-body',
      development: false,
    });
    
    // Convert to HTML using React server components
    const html = await renderToString(compiled);
    
    return Response.json({ html });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

Then configure the editor to use server-side compilation:

```jsx
<DualMdxEditor
  initialMdx={content}
  onSave={handleSave}
  serverEndpoint="/api/compile-mdx"
  enableServerFallback={true}
/>
```

## Testing Paste Cases

Test the rich paste functionality with these common scenarios:

### Google Docs Paste Test

1. Create a Google Doc with:
   - Headings (H1, H2, H3)
   - Bold and italic text  
   - Bullet and numbered lists
   - Links
   - Images
   - Tables

2. Select all content and copy (Cmd/Ctrl + A, then Cmd/Ctrl + C)

3. Paste into the left editor pane

4. Verify the MDX output on the right includes:
   - Proper heading syntax (`# ## ###`)
   - Bold (`**text**`) and italic (`*text*`) formatting
   - List syntax (`- item` and `1. item`)
   - Link syntax (`[text](url)`)
   - Image components (`<img src="..." alt="..." />`)
   - Table markdown or HTML

### Microsoft Word Paste Test

1. Create a Word document with similar formatting
2. Copy and paste into the editor
3. Verify MS Office artifacts are removed:
   - No `mso-` CSS properties
   - No conditional comments (`<!--[if mso]-->`)
   - Clean semantic formatting

### Web Page Paste Test

1. Select formatted content from any web page
2. Paste into the editor  
3. Verify inline styles are cleaned and converted to semantic markdown

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMdx` | `string` | `''` | Initial MDX content |
| `onSave` | `function` | `undefined` | Callback when save button is clicked: `(mdx: string) => void` |
| `imageUploadHandler` | `function` | `undefined` | Image upload handler: `(file: File) => Promise<string>` |
| `customComponents` | `object` | `{}` | Custom MDX components for preview |
| `className` | `string` | `''` | Additional CSS classes |
| `darkMode` | `boolean` | `false` | Enable dark mode for code editor |
| `serverEndpoint` | `string` | `undefined` | Server-side compilation endpoint |
| `enableServerFallback` | `boolean` | `false` | Use server compilation as fallback |

## Custom Styling

The editor uses Tailwind CSS classes by default. You can customize the appearance by:

1. **Override CSS classes**: The component accepts a `className` prop for additional styling

2. **Custom CSS file**: Import and modify `DualMdxEditor.css`

3. **Tailwind configuration**: Extend your Tailwind theme with custom colors and spacing

```jsx
// Custom styled editor
<DualMdxEditor
  className="border-2 border-purple-500 rounded-xl shadow-2xl"
  // ...other props
/>
```

## Performance Considerations

- **Debouncing**: Conversions are debounced by 400ms to prevent excessive processing
- **Large Documents**: The editor handles documents up to 10,000+ lines efficiently
- **Memory Management**: Converters are memoized to prevent recreation on re-renders
- **Server Fallback**: Use server-side compilation for very large or complex documents

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all editor functions
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Logical tab order and focus indicators  
- **High Contrast**: Compatible with high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` settings

## Error Handling

The editor includes comprehensive error handling:

- **MDX Validation**: Real-time syntax checking with line numbers
- **Conversion Errors**: Graceful fallback when conversion fails
- **Upload Errors**: Retry logic and error reporting for image uploads
- **Network Issues**: Offline support and connection retry

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Contributing

See the main project repository for contribution guidelines.

## License

MIT License - see LICENSE file for details.