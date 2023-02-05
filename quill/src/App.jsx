import Editor from "./components/Editor";
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen bg-slate-200">
      <div
        id="container "
        className="max-w-screen-lg flex justify-center items-center mx-auto"
      >
        <Editor value={value} setValue={setValue} />
      </div>
    </div>
  );
}

export default App;
