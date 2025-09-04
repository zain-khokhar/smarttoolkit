'use client';
import '../../styles/_variables.scss';
import '../../styles/_keyframe-animations.scss';

import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import "./editor.module.css"
import {
    Copy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { processNode } from './processnose';
import { SimpleEditor } from '../tiptap-templates/simple/simple-editor';
import HorizontalRule from '../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
import TextAlign from '@tiptap/extension-text-align';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import { Selection } from '@tiptap/extensions';

// Create lowlight instance with selected languages
const lowlight = createLowlight({
    javascript,
    css,
    html,
});

export default function RichTextEditor() {
    const [mdxOutput, setMdxOutput] = useState('');
    
    // Convert TipTap JSON to MDX
    const convertToMdx = useCallback((content) => {
        if (!content || !content.content) return '';

        let mdxString = '';
        content.content.forEach((node) => {
            mdxString += processNode(node);
        });

        return mdxString;
    }, []);

    // Initialize the editor
    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            // Image,
            Typography,
            // Superscript,
            // Subscript,
            Selection,
            // ImageUploadNode.configure({
            //   accept: "image/*",
            //   maxSize: MAX_FILE_SIZE,
            //   limit: 3,
            //   upload: handleImageUpload,
            //   onError: (error) => console.error("Upload failed:", error),
            // }),
        ],
        content: "<p>Start typing or paste your rich text here...</p>",
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const mdx = convertToMdx(json);
            setMdxOutput(mdx);
        },
    });


    // // Set link
    // const setLink = useCallback(() => {
    //     if (!editor) return;

    //     const previousUrl = editor.getAttributes('link').href;
    //     const url = window.prompt('URL', previousUrl);

    //     if (url === null) return;
    //     if (url === '') {
    //         editor.chain().focus().extendMarkRange('link').unsetLink().run();
    //         return;
    //     }

    //     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    // }, [editor]);

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(mdxOutput);
            alert('MDX copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Editor Panel */}
            <div className="flex-1 flex flex-col">
                {/* <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-slate-700">Rich Text Editor</h2>

                    <div className="flex items-center space-x-2">
                        <Label htmlFor="plain-links" className="text-sm text-slate-600">Plain URLs</Label>
                        <Switch
                            id="plain-links"
                            checked={isPlainLinks}
                            onCheckedChange={setIsPlainLinks}
                        />
                    </div>
                </div> */}


                {/* Editor Content */}
                <div className="flex flex-col rounded-b-lg border-t-0 border-slate-200 min-h-[400px] overflow-auto">
                    <SimpleEditor editor={editor} />
                    {/* <EditorContent editor={editor} className="prose prose-slate max-w-none h-full" /> */}
                </div>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-slate-700">MDX Output</h2>

                    <Button onClick={copyToClipboard} size="sm" variant="outline" disabled={!mdxOutput}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy MDX
                    </Button>
                </div>

                <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 min-h-[400px] overflow-auto">
                    {mdxOutput ? (
                        <pre className="text-sm whitespace-pre-wrap font-mono text-slate-800">
                            {mdxOutput}
                        </pre>
                    ) : (
                        <p className="text-slate-400 italic">MDX output will appear here as you type...</p>
                    )}
                </div>
            </div>
        </div>
    );

}
