'use client'
import dynamic from "next/dynamic";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.bubble.css";

const ProductDescription = ({ desc }: { desc: string }) => {
  return (
    <ReactQuill
      theme="bubble"
      value={desc}
     
      className="mt-3 text-neutral-700"
    />
  );
};

export default ProductDescription;
