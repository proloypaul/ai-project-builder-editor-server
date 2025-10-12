"use client";
import React from "react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

console.log("server to client");

export default function FileExplorer({
  structure,
  onOpenFile,
  prefix = "",
}: {
  structure: FileItem[];
  onOpenFile: (path: string) => void;
  prefix?: string;
}) {
  return (
    <ul className="text-sm pl-2">
      {structure.map((item) => (
        <li key={item.name}>
          {item.type === "folder" ? (
            <details open className="mb-1">
              <summary className="cursor-pointer text-blue-300 font-medium">
                📁 {item.name}
              </summary>
              <div className="ml-4">
                <FileExplorer
                  structure={item.children || []}
                  onOpenFile={onOpenFile}
                  prefix={`${prefix}${item.name}/`}
                />
              </div>
            </details>
          ) : (
            <button
              onClick={() => onOpenFile(`${prefix}${item.name}`)}
              className={`text-left pl-4 hover:text-green-400  w-full text-white  cursor-pointer`}
            >
              📄 {item.name}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
