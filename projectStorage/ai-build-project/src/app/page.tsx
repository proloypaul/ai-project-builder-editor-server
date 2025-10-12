"use client";
import React, { useEffect, useState } from "react";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import TabsBar from "./components/TabsBar";
import projectData from "../../constant/project.json";
import UserPrompt from "./components/UserPrompt";

interface FileData {
  path: string;
  language: string;
  content: string;
}

export default function Page() {
  const [project, setProject] = useState(projectData);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, FileData>>(
    {}
  );

  useEffect(() => {
    const files: Record<string, FileData> = {};
    project.files.forEach((f: FileData) => (files[f.path] = f));
    setFileContents(files);
  }, [project]);

  const openFile = (path: string) => {
    if (!openFiles.includes(path)) setOpenFiles([...openFiles, path]);
    setActiveFile(path);
  };

  const updateContent = (value: string | undefined) => {
    if (activeFile)
      setFileContents({
        ...fileContents,
        [activeFile]: { ...fileContents[activeFile], content: value || "" },
      });
  };

  const active = activeFile ? fileContents[activeFile] : null;

  const handleRemove = (file: string) => {
    setOpenFiles((files) => files.filter((f) => f !== file));
    if (activeFile === file) {
      // Select another file if active is removed
      setActiveFile((prev) => {
        const remaining = openFiles.filter((f) => f !== file);
        return remaining.length ? remaining[0] : null;
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* User Prompt  */}

      <div className="w-[25%]">
        <UserPrompt />
      </div>
      {/* Sidebar */}
      <div className="w-[20%] bg-gray-900 border-r border-gray-700 p-3 overflow-y-auto">
        <h2 className="text-green-400 font-semibold mb-2">
          📦 {project.projectId}
        </h2>

        <FileExplorer
          //@ts-expect-error
          structure={project.structure}
          onOpenFile={openFile}
        />
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col w-[55%]">
        <TabsBar
          openFiles={openFiles}
          activeFile={activeFile}
          onSelect={setActiveFile}
          onRemove={handleRemove}
        />
        {active ? (
          <CodeEditor
            key={activeFile}
            content={active.content}
            language={active.language}
            onChange={updateContent}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a file to start editing 🧠
          </div>
        )}
      </div>
    </div>
  );
}
