import { useEffect, useState } from "react";

function Home() {
  return (
    <main className=" font-jbmono p-20">
      <h1 className=" text-4xl text-highlight">Upload a log file (.txt)</h1>
      <FileDropZone />
    </main>
  );
}

export default Home;

const FileDropZone = () => {
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlighted(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlighted(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlighted(false);

    const files = Array.from(e.dataTransfer.files) as File[];
    const uniqueFiles = files.filter(
      (file) =>
        !droppedFiles.some((droppedFile) => droppedFile.name === file.name)
    );
    setDroppedFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
  };

  const handleRemoveFile = (file: File[]) => {
    setDroppedFiles((prevFiles) =>
      prevFiles.filter((prevFile) => !file.includes(prevFile))
    );
  };

  const handleUpload = async () => {
    const formData = new FormData();
    droppedFiles.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        body: formData,
      });
      if (response.status !== 201) {
        const errorResponse = await response.json();
        console.log(errorResponse.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`file-drop-zone ${
        highlighted
          ? "bg-highlight text-dimshadow border-dimshadow"
          : "border-highlight"
      } border-2 border-dashed p-4 text-center cursor-pointer`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      Drop files here
      {droppedFiles.length > 0 && (
        <div>
          <ul className="mt-4">
            {droppedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between py-1"
              >
                <span>
                  {file.name.length <= 32
                    ? file.name
                    : file.name.substring(0, 32) + "..."}
                </span>
                <button
                  className="text-accRed"
                  onClick={() => handleRemoveFile([file])}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <button
              className=" text-accGreen mt-4"
              onClick={() => handleUpload()}
            >
              Upload
            </button>
            <button
              className=" text-accRed mt-4"
              onClick={() => handleRemoveFile(droppedFiles)}
            >
              Remove All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
