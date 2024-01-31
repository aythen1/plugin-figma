import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";

declare function require(path: string): any;

function App() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [jsonData, setJsonData] = React.useState<any>(null);
  const [downloadRequested, setDownloadRequested] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("Extrayendo propiedades Css");

  const figmaJSON = async () => {
    setLoading(true);
    setProgress(0);
    setLoadingText("Extrayendo propiedades Css");

    console.log("Comenzando la generación de JSON...");

    const startTime = Date.now();
    parent.postMessage({ pluginMessage: { type: "figma-json" } }, "*");

    try {
      const jsonGenerationTime = 9000;

      const endTime = startTime + jsonGenerationTime;

      while (Date.now() < endTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const calculatedProgress = (elapsedTime / jsonGenerationTime) * 100;
        setProgress(Math.min(calculatedProgress, 100));
        if (calculatedProgress >= 50 && calculatedProgress < 100) {
          setLoadingText("Generando JSON con las propiedades");
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Generación de JSON completada.");
      setLoadingText("JSON Generado con éxito");
      setLoading(false);
      setDownloadRequested(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const handleDownload = () => {
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `plugin-${"figma"}.json`;
      if (progress < 50) {
        setLoadingText("Extrayendo propiedades Css");
      } else if (progress >= 50 && progress < 100) {
        setLoadingText("Generando JSON con las propiedades");
      } else {
        setLoadingText("JSON Generado con éxito");
      }

      downloadLink.click();

      URL.revokeObjectURL(blobUrl);
    }
    setJsonData(null)
    setDownloadRequested(false);

  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  React.useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      if (event.data && event.data.pluginMessage.type === "json-data" && !downloadRequested) {
        const receivedJsonData = event.data.pluginMessage.data;
        // console.log("Esta es la data del JSON:", receivedJsonData);
        setJsonData(receivedJsonData);
      }
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, [downloadRequested]);


  return (
    <main>
      <header>
        <img src={require("../public/logo512.svg")} alt="Aythen Logo" />
        <h2>Aythen Plugin</h2>
      </header>
      <footer>
        <button className="brand" onClick={figmaJSON}>
          Component
        </button>
        <button onClick={handleDownload}>Descargar</button>
        <button onClick={onCancel}>Cancelar</button>
        <div className="loading-bar-container">
          {loading && (
            <div className="loading-bar">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          <br />
        </div>
        <div>
          {loading && (
            <p className="loading-text">
              {progress < 50
                ? "Extrayendo propiedades CSS"
                : progress >= 50 && progress < 100
                  ? "Generando JSON con las propiedades"
                  : "JSON Generado con éxito"}
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("react-page")).render(<App />);
