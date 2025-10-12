"use client";
import Editor from "@monaco-editor/react";
import React from "react";

interface Props {
  content: string;
  language: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ content, language, onChange }: Props) {
  return (
    <div className="w-full h-full border-l border-gray-700">
      <Editor
        height="100vh"
        theme="vs-dark"
        defaultLanguage={language}
        defaultValue={content}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
        }}
        onChange={onChange}
      />
    </div>
  );
}
