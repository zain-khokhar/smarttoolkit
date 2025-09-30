import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/**
 * MDX to HTML Converter
 * Compiles MDX content to HTML for display in the WYSIWYG editor
 * 
 * Features:
 * - Client-side MDX compilation using @mdx-js/mdx
 * - Custom component handling for preview
 * - Error boundary for invalid MDX
 * - Fallback to server-side compilation for heavy workloads
 */

class MdxToHtmlConverter {
  constructor(options = {}) {
    this.customComponents = options.customComponents || {};
    this.serverEndpoint = options.serverEndpoint; // Optional server-side compilation endpoint
    this.enableServerFallback = options.enableServerFallback || false;
  }

  /**
   * Default components for MDX compilation
   * These provide fallbacks for common JSX components
   */
  getDefaultComponents() {
    return {
      // Custom components that might appear in MDX
      Callout: ({ children, type = 'info', ...props }) => {
        const bgColor = {
          info: 'bg-blue-50 border-blue-200',
          warning: 'bg-yellow-50 border-yellow-200',
          error: 'bg-red-50 border-red-200',
          success: 'bg-green-50 border-green-200',
        }[type] || 'bg-gray-50 border-gray-200';

        return (
          <div 
            className={`p-4 border-l-4 ${bgColor} rounded-md my-4`} 
            {...props}
          >
            {children}
          </div>
        );
      },

      Alert: ({ children, variant = 'default', ...props }) => (
        <div 
          className={`p-4 rounded-md border my-4 ${
            variant === 'destructive' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
          {...props}
        >
          {children}
        </div>
      ),

      Card: ({ children, ...props }) => (
        <div className="border rounded-lg p-6 shadow-sm bg-white" {...props}>
          {children}
        </div>
      ),

      // Handle images with proper styling
      img: ({ src, alt, title, ...props }) => (
        <img 
          src={src} 
          alt={alt} 
          title={title}
          className="max-w-full h-auto rounded-lg my-4"
          {...props}
        />
      ),

      // Code blocks with syntax highlighting placeholder
      pre: ({ children, ...props }) => (
        <pre 
          className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"
          {...props}
        >
          {children}
        </pre>
      ),

      // Inline code
      code: ({ children, ...props }) => (
        <code 
          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ),

      // Tables
      table: ({ children, ...props }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-gray-300" {...props}>
            {children}
          </table>
        </div>
      ),

      th: ({ children, ...props }) => (
        <th 
          className="border border-gray-300 px-4 py-2 bg-gray-50 text-left font-semibold"
          {...props}
        >
          {children}
        </th>
      ),

      td: ({ children, ...props }) => (
        <td className="border border-gray-300 px-4 py-2" {...props}>
          {children}
        </td>
      ),

      // Merge custom components
      ...this.customComponents,
    };
  }

  /**
   * Compile MDX to HTML using @mdx-js/mdx
   * @param {string} mdxContent - MDX source code
   * @returns {Promise<string>} Compiled HTML
   */
  async compileClientSide(mdxContent) {
    try {
      // Compile MDX to JavaScript
      const compiled = await compile(mdxContent, {
        outputFormat: 'function-body',
        development: false,
        // Add remark/rehype plugins here if needed
        remarkPlugins: [],
        rehypePlugins: [],
      });

      // Execute the compiled code to get the component
      const { default: MDXContent } = await run(compiled, {
        ...runtime,
        // Use a fallback URL for Node.js environments
        baseUrl: typeof window !== 'undefined' ? window.location.href : 'file:///'
      });

      // Render the component to get HTML
      // Note: This is a simplified approach - in production, you'd use ReactDOMServer
      const components = this.getDefaultComponents();
      
      // For now, return a placeholder that indicates successful compilation
      // In a full implementation, you'd use ReactDOMServer.renderToString
      return this.renderToHtml(MDXContent, components);

    } catch (error) {
      console.error('Client-side MDX compilation failed:', error);
      throw error;
    }
  }

  /**
   * Fallback: Use remark/rehype pipeline for basic markdown to HTML
   * This is used when MDX compilation fails or for performance
   */
  async compileMarkdownFallback(mdxContent) {
    try {
      const processor = unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true });

      const result = await processor.process(mdxContent);
      return String(result);
    } catch (error) {
      console.error('Markdown fallback compilation failed:', error);
      throw error;
    }
  }

  /**
   * Server-side compilation fallback
   * Use this for heavy workloads or when client-side compilation is too slow
   */
  async compileServerSide(mdxContent) {
    if (!this.serverEndpoint) {
      throw new Error('Server endpoint not configured');
    }

    try {
      const response = await fetch(this.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mdx: mdxContent }),
      });

      if (!response.ok) {
        throw new Error(`Server compilation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.html;
    } catch (error) {
      console.error('Server-side compilation failed:', error);
      throw error;
    }
  }

  /**
   * Simplified HTML rendering for preview
   * In production, use ReactDOMServer.renderToString with proper component tree
   */
  renderToHtml(MDXContent, components) {
    // This is a simplified implementation
    // In a real app, you'd use ReactDOMServer.renderToString
    try {
      // For now, return a basic HTML structure
      // TODO: Implement proper React server-side rendering
      return `
        <div class="prose prose-slate max-w-none">
          <!-- MDX Content would be rendered here -->
          <p><em>MDX content compiled successfully. 
          To see rendered output, implement ReactDOMServer integration.</em></p>
        </div>
      `;
    } catch (error) {
      console.error('HTML rendering failed:', error);
      return `<div class="text-red-500">Rendering failed: ${error.message}</div>`;
    }
  }

  /**
   * Validate MDX syntax
   * @param {string} mdxContent - MDX to validate
   * @returns {Promise<{valid: boolean, errors: Array}>}
   */
  async validate(mdxContent) {
    try {
      await compile(mdxContent, {
        outputFormat: 'function-body',
        development: true, // Enable better error messages
      });
      
      return { valid: true, errors: [] };
    } catch (error) {
      return { 
        valid: false, 
        errors: [{
          message: error.message,
          line: error.line,
          column: error.column,
        }]
      };
    }
  }

  /**
   * Main conversion method
   * Tries client-side compilation with fallbacks
   */
  async convert(mdxContent) {
    if (!mdxContent || mdxContent.trim() === '') {
      return '';
    }

    try {
      // Try client-side compilation first
      return await this.compileClientSide(mdxContent);
    } catch (error) {
      console.warn('Client-side compilation failed, trying fallback:', error.message);
      
      if (this.enableServerFallback && this.serverEndpoint) {
        try {
          return await this.compileServerSide(mdxContent);
        } catch (serverError) {
          console.warn('Server-side compilation failed:', serverError.message);
        }
      }
      
      // Final fallback: basic markdown rendering
      try {
        return await this.compileMarkdownFallback(mdxContent);
      } catch (fallbackError) {
        console.error('All compilation methods failed:', fallbackError);
        return `<div class="text-red-500 p-4 border border-red-200 rounded">
          <h4>Compilation Error</h4>
          <p>${error.message}</p>
          <details>
            <summary>Raw MDX Content</summary>
            <pre class="mt-2 text-xs">${mdxContent}</pre>
          </details>
        </div>`;
      }
    }
  }
}

/**
 * Factory function to create converter instance
 */
export function createMdxToHtmlConverter(options = {}) {
  return new MdxToHtmlConverter(options);
}

/**
 * Quick conversion function for simple use cases
 */
export async function mdxToHtml(mdxContent, options = {}) {
  const converter = createMdxToHtmlConverter(options);
  return converter.convert(mdxContent);
}

/**
 * Validate MDX syntax
 */
export async function validateMdx(mdxContent) {
  const converter = createMdxToHtmlConverter();
  return converter.validate(mdxContent);
}