import React, { useRef, useState } from "react";
// eslint-disable-next-line import/extensions
import { importPsd } from "@/utils";

const App: React.FC = () => {
  // eslint-disable-next-line unicorn/no-null
  const inputEle = useRef<HTMLInputElement>(null);
  const onFileChange = async () => {
    const PSD = await importPsd();
    const files = inputEle.current?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    const psd = await PSD.fromURL(url);
    // document.body.append(png);
    const tree = psd.tree();
    const img = tree.children()[0].layer.image.toPng();
    document.body.append(img);
  };
  return (
    <div className="app">
      <h1>hello world</h1>
      <input ref={inputEle} type="file" onChange={onFileChange} />
    </div>
  );
};

export default App;
