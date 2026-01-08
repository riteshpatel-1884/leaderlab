import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';

interface MacCodeWindowProps {
  code: string;
  title?: string;
}

export default function MacCodeWindow({ code, title = "code.sql" }: MacCodeWindowProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-[#1e1e1e]">
      {/* Mac-style window header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400 font-mono">{title}</span>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
      
      {/* Code content with syntax highlighting */}
      <div className="overflow-hidden">
        <CodeMirror
          value={code}
          height="auto"
          theme="dark"
          extensions={[sql()]}
          editable={false}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLineGutter: false,
            highlightActiveLine: false,
          }}
          style={{
            fontSize: '14px',
          }}
        />
      </div>
    </div>
  );
}