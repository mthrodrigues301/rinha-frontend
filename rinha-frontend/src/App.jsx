import { useRef, useState, useMemo } from "react";
import "./App.css";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

function App() {
  const inputRef = useRef(null);
  const [contentFile, setContentFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const handleClick = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  const readFile = async (file) => {
    try {
      const reader = new FileReader();

      reader.onprogress = async (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
          console.log(percentLoaded);
        }
      };

      reader.onload = async (event) => {
        setLoading(true);
        const jsonContent = event.target.result;
        await setContentFile(jsonContent);
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (e) {
      setErrorMessage("Invalid file. Please load a valid JSON file");
    }
  };

  const handleFileChange = async (event) => {
    try {
      setErrorMessage(null);

      const fileObj = event.target.files && event.target.files[0];
      if (!fileObj) {
        return;
      }

      await readFile(fileObj);

      // 👇️ reset file input
      event.target.value = null;
    } catch (e) {
      console.log("🚀 ~ file: App.jsx:48 ~ handleFileChange ~ e:", e);
      setErrorMessage(e);
    }
  };

  const parsedJson = useMemo(() => {
    try {
      if (!contentFile) return contentFile;

      return JSON.parse(contentFile);
    } catch (e) {
      setErrorMessage("Invalid file. Please load a valid JSON file");
    }
  }, [contentFile, setErrorMessage]);

  return (
    <>
      <h1>JSON Tree Viewer</h1>
      <h3>
        Simple JSON Viewer that runs completely on-client. No data exchange
      </h3>
      <div className="card">
        <input
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          accept="application/JSON"
        />

        <button onClick={handleClick}>Load JSON</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>

      {isLoading && (
        <>
          <h2>Loading...</h2>
        </>
      )}

      {parsedJson && (
        <div className="left">
          <JsonView
            data={parsedJson}
            shouldExpandNode={allExpanded}
            style={darkStyles}
          />
        </div>
      )}

      <p>
        Feito com ❤️ por <b>Matheus Rodrigues</b>
      </p>
    </>
  );
}

export default App;
