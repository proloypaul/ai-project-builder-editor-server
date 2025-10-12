import React from "react";

const UserPrompt = () => {
  return (
    <div className="bg-gray-800 p-4 shadow-lg flex flex-col h-full relative">
      <h2 className="text-white font-semibold text-xl mb-4">
        🧠 Ztrios Ai Project Solution
      </h2>
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-300">
          "What would you like the AI to do?"
        </div>
        <div className="text-sm text-gray-300">
          "Give your prompt make your Full stack project"
        </div>
        <textarea
          rows={5}
          placeholder="Type your Prompt..."
          className="bg-gray-700 text-white p-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 absolute bottom-5 left-0 w-full"
        />
      </div>
    </div>
  );
};

export default UserPrompt;
