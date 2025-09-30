import TurndownService from 'turndown';

/**
 * HTML to MDX Converter
 * Converts pasted HTML content (from Google Docs, Word, etc.) to clean MDX
 * 
 * Features:
 * - Cleans MS Office artifacts and unnecessary styling
 * - Preserves semantic HTML structure
 * - Converts images to MDX-compatible syntax
 * - Handles tables, lists, and formatting
 */

class HtmlToMdxConverter {
  constructor(options = {}) {
    this.imageUploadHandler = options.imageUploadHandler;
    this.turndownService = this.createTurndownService();
  }

  createTurndownService() {
    const turndown = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
      strongDelimiter: '**',
      linkStyle: 'inlined',
      linkReferenceStyle: 'full',
    });

    // Custom rule for images - convert to MDX img tags
    turndown.addRule('image', {
      filter: 'img',
      replacement: (content, node) => {
        const src = node.getAttribute('src') || '';
        const alt = node.getAttribute('alt') || '';
        const title = node.getAttribute('title') || '';
        
        // If we have a data URL or blob, we'll need to upload it
        if (src.startsWith('data:') || src.startsWith('blob:')) {
          // TODO: Integrate with imageUploadHandler
          console.warn('Data URL/blob image detected - needs upload handler');
          return `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''} />`;
        }
        
        // Use MDX img component syntax for better control
        return `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''} />`;
      }
    });

    // Custom rule for tables - preserve HTML tables for complex structures
    turndown.addRule('table', {
      filter: 'table',
      replacement: (content, node) => {
        // For simple tables, convert to markdown
        // For complex tables with spans, keep as HTML
        const hasSpans = node.querySelector('td[colspan], td[rowspan], th[colspan], th[rowspan]');
        
        if (hasSpans) {
          // Keep complex tables as HTML wrapped in MDX
          return `\n\n<table>\n${node.innerHTML}\n</table>\n\n`;
        }
        
        // Convert simple tables to markdown
        return this.convertSimpleTable(node);
      }
    });

    // Custom rule for code blocks
    turndown.addRule('codeBlock', {
      filter: ['pre'],
      replacement: (content, node) => {
        const codeElement = node.querySelector('code');
        const language = codeElement ? 
          (codeElement.className.match(/language-(\w+)/) || [])[1] || '' : '';
        
        const code = node.textContent || '';
        return `\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      }
    });

    // Rule to preserve JSX components that might already be in the HTML
    turndown.addRule('jsx', {
      filter: (node) => {
        // Detect JSX-like components (capitalized tag names)
        return node.nodeName && /^[A-Z]/.test(node.nodeName);
      },
      replacement: (content, node) => {
        // Keep JSX components as-is
        return node.outerHTML;
      }
    });

    return turndown;
  }

  convertSimpleTable(tableNode) {
    const rows = Array.from(tableNode.querySelectorAll('tr'));
    if (rows.length === 0) return '';

    let markdown = '\n\n';
    
    rows.forEach((row, index) => {
      const cells = Array.from(row.querySelectorAll('td, th'));
      const rowContent = cells.map(cell => cell.textContent.trim()).join(' | ');
      markdown += `| ${rowContent} |\n`;
      
      // Add header separator after first row
      if (index === 0) {
        const separator = cells.map(() => '---').join(' | ');
        markdown += `| ${separator} |\n`;
      }
    });
    
    return markdown + '\n';
  }

  /**
   * Clean HTML before conversion to remove Office artifacts and unwanted styling
   */
  cleanHtml(html) {
    // Remove Microsoft Office conditional comments
    html = html.replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, '');
    
    // Remove MS Office namespace declarations
    html = html.replace(/\s*xmlns:\w+="[^"]*"/gi, '');
    
    // Clean up MS Office style attributes
    html = html.replace(/\s*mso-[^:;]*:[^;]*;?/gi, '');
    
    // Remove empty style attributes
    html = html.replace(/\s*style="[\s;]*"/gi, '');
    
    // Convert common HTML entities
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/&quot;/g, '"');
    html = html.replace(/&apos;/g, "'");
    html = html.replace(/&lt;/g, '<');
    html = html.replace(/&gt;/g, '>');
    html = html.replace(/&amp;/g, '&');
    
    // Clean up excessive whitespace
    html = html.replace(/\s+/g, ' ');
    
    // Convert <b> to <strong>, <i> to <em> for semantic consistency
    html = html.replace(/<b(\s[^>]*)?>/gi, '<strong$1>');
    html = html.replace(/<\/b>/gi, '</strong>');
    html = html.replace(/<i(\s[^>]*)?>/gi, '<em$1>');
    html = html.replace(/<\/i>/gi, '</em>');
    
    return html.trim();
  }

  /**
   * Post-process MDX output to clean up and optimize
   */
  postProcessMdx(mdx) {
    // Remove excessive line breaks
    mdx = mdx.replace(/\n{3,}/g, '\n\n');
    
    // Clean up list formatting
    mdx = mdx.replace(/^(\s*)-\s+$/gm, '');
    
    // Ensure proper spacing around headings
    mdx = mdx.replace(/([^\n])\n(#{1,6}\s)/gm, '$1\n\n$2');
    mdx = mdx.replace(/(#{1,6}[^\n]*)\n([^\n#])/gm, '$1\n\n$2');
    
    // Clean up code block spacing
    mdx = mdx.replace(/([^\n])\n```/gm, '$1\n\n```');
    mdx = mdx.replace(/```\n([^\n])/gm, '```\n\n$1');
    
    return mdx.trim();
  }

  /**
   * Convert HTML to MDX
   * @param {string} html - Raw HTML content
   * @returns {Promise<string>} Clean MDX output
   */
  async convert(html) {
    try {
      // Clean the HTML first
      const cleanedHtml = this.cleanHtml(html);
      
      // Convert to markdown using turndown
      let mdx = this.turndownService.turndown(cleanedHtml);
      
      // Post-process the output
      mdx = this.postProcessMdx(mdx);
      
      return mdx;
    } catch (error) {
      console.error('HTML to MDX conversion failed:', error);
      throw new Error(`Conversion failed: ${error.message}`);
    }
  }

  /**
   * Extract and process images from HTML for upload
   * @param {string} html - HTML content
   * @returns {Promise<Array>} Array of image processing results
   */
  async processImages(html) {
    if (!this.imageUploadHandler) {
      return [];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    const processedImages = [];

    for (const img of images) {
      const src = img.getAttribute('src');
      
      if (src && (src.startsWith('data:') || src.startsWith('blob:'))) {
        try {
          // Convert data URL to blob
          const response = await fetch(src);
          const blob = await response.blob();
          
          // Create a file from the blob
          const file = new File([blob], 'pasted-image.png', { type: blob.type });
          
          // Upload the file
          const uploadedUrl = await this.imageUploadHandler(file);
          
          processedImages.push({
            originalSrc: src,
            newSrc: uploadedUrl,
            alt: img.getAttribute('alt') || '',
          });
        } catch (error) {
          console.error('Image upload failed:', error);
          processedImages.push({
            originalSrc: src,
            newSrc: src, // Keep original if upload fails
            alt: img.getAttribute('alt') || '',
            error: error.message,
          });
        }
      }
    }

    return processedImages;
  }
}

/**
 * Factory function to create converter instance
 * @param {Object} options - Configuration options
 * @param {Function} options.imageUploadHandler - Optional image upload handler
 * @returns {HtmlToMdxConverter}
 */
export function createHtmlToMdxConverter(options = {}) {
  return new HtmlToMdxConverter(options);
}

/**
 * Quick conversion function for simple use cases
 * @param {string} html - HTML to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<string>} MDX output
 */
export async function htmlToMdx(html, options = {}) {
  const converter = createHtmlToMdxConverter(options);
  return converter.convert(html);
}