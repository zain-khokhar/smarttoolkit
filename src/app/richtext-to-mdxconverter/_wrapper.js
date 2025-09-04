'use client';

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/richtext-editor/RichTextEditor'),
  {
    // ssr: false, // now allowed because this is a Client Component
    loading: () => (
      <div className="flex-1 animate-pulse">
        <div className="h-[500px] bg-slate-100 rounded-lg"></div>
      </div>
    ),
  }
);

const RichTextEditorWrapper = () => {
  return <RichTextEditor />;
};

export default RichTextEditorWrapper;
