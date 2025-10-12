"use client";
import React from "react";
import clsx from "clsx";

export default function TabsBar({
  openFiles,
  activeFile,
  onSelect,
  onRemove,
}: {
  openFiles: string[];
  activeFile: string | null;
  onSelect: (file: string) => void;
  onRemove: (file: string) => void;
}) {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700">
      {openFiles.map((file) => (
        <div
          key={file}
          className={clsx(
            "flex items-center px-4 py-2 text-sm border-r border-gray-700 hover:bg-gray-700",
            activeFile === file ? "bg-gray-700 text-green-400" : "text-gray-300"
          )}
        >
          <button
            onClick={() => onSelect(file)}
            className="flex-1 text-left"
            type="button"
          >
            {file.split("/").pop()}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onSelect
              onRemove(file);
            }}
            className="ml-2 text-gray-400 hover:text-red-500"
            type="button"
            aria-label={`Close ${file.split("/").pop()}`}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
