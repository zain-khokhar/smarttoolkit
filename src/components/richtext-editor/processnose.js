export const processNode = (node, parent = null, isPlainLinks = false) => {
  // Handle text nodes with marks
  if (node.type === 'text') {
    let text = node.text || '';

    if (node.marks) {
      node.marks.forEach(mark => {
        switch (mark.type) {
          case 'bold':
            text = `**${text}**`;
            break;
          case 'italic':
            text = `_${text}_`;
            break;
          case 'underline':
            text = `<u>${text}</u>`;
            break;
          case 'strike':
            text = `~~${text}~~`;
            break;
          case 'code':
            text = `\`${text}\``;
            break;
          case 'link':
            const href = mark.attrs?.href || '';
            if (isPlainLinks) {
              text = `${text} (${href})`;
            } else {
              text = `[${text}](${href})`;
            }
            break;
        }
      });
    }

    return text;
  }

  // Handle nodes recursively
  switch (node.type) {
    case 'paragraph':
      return `\n${node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : ''}\n`;

    case 'heading':
      const level = node.attrs?.level || 1;
      return `\n${'#'.repeat(level)} ${node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : ''}\n`;

    case 'bulletList':
      return `\n${node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : ''}`;

    case 'orderedList':
      return `\n${node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : ''}`;

    case 'listItem':
      const listItemContent = node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : '';
      const prefix = parent?.type === 'orderedList' ? '1. ' : '- ';
      return `${prefix}${listItemContent}\n`;

    case 'blockquote':
      const blockquoteContent = node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : '';
      return `\n> ${blockquoteContent}\n`;

    case 'codeBlock':
      const codeBlockContent = node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : '';
      const lang = node.attrs?.lang || '';
      return `\n\`\`\`${lang}\n${codeBlockContent}\n\`\`\`\n`;

    case 'horizontalRule':
      return `\n---\n`;

    case 'hardBreak':
      return `  \n`; // Markdown line break

    default:
      // Process child nodes recursively
      return node.content ? node.content.map(child => processNode(child, node, isPlainLinks)).join('') : '';
  }
};
