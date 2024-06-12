import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import './markdown.css'

const ProDesc = ({ markdownContent }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkHtml, remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default ProDesc;
