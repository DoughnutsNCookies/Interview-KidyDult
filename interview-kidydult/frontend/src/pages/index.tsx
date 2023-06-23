import { useState } from "react";

function Home() {
  const [type, setType] = useState<string>("ALL");
  const [order, setOrder] = useState<string>("DESC");
  const [find, setFind] = useState<string>("PHRASE");

  return (
    <main className=" font-jbmono p-20">
      <div className=" flex flex-row text-highlight justify-between gap-x-32">
        <div className=" w-1/2">
          <h1 className="text-4xl pb-5">Upload a log file (.txt)</h1>
          <FileDropZone />
          <button className=" text-accGreen text-2xl font-bold border-2 border-accGreen w-1/2 my-5 px-2 py-1 rounded-md hover:bg-accGreen hover:text-white transition-all">
            Upload!
          </button>
        </div>

        <div className=" w-1/2 pt-14">
          <h1 className="text-2xl pb-2">Results:</h1>
          <AnswerBox />
          <div className=" flex flex-row justify-evenly pt-3">
            <button
              className={`border-2 ${type === "ALL" ? "border-accCyan text-accCyan" : "border-accYellow text-accYellow"} rounded-md w-1/5 transition-all`}
              onClick={() => setType(type === "ALL" ? "PER" : "ALL")}
            >
              {type}
            </button>
            <button
              className={`border-2 ${order === "DESC" ? "border-accCyan text-accCyan" : "border-accYellow text-accYellow"} rounded-md w-1/5 transition-all`}
              onClick={() => setOrder(order === "DESC" ? "ASC" : "DESC")
            }
            >
              {order}
            </button>
            <button
              className={`border-2 ${find === "PHRASE" ? "border-accCyan text-accCyan" : "border-accYellow text-accYellow"} rounded-md w-1/5 transition-all`}
              onClick={() => setFind(find === "PHRASE" ? "WORD" : "PHRASE")}
            >
              {find}
            </button>
            <input
              type="number"
              placeholder="K Value"
              className=" w-1/5 bg-transparent rounded-md border-2 border-highlight text-center number-input focus:outline-none"
            />
          </div>
        </div>
      </div>
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
      formData.append("file", file);
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
      className={`${
        highlighted && droppedFiles.length === 0
          ? "bg-highlight text-dimshadow border-dimshadow"
          : "border-highlight"
      }
      ${
        droppedFiles.length === 0 && "justify-center flex flex-col"
      } relative w-full h-[500px] border-2 border-dashed p-4 text-center cursor-pointer`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p className="pb-2">
        {droppedFiles.length === 0
          ? "Drag and drop your files here"
          : "You can still drop more!"}
      </p>
      {droppedFiles.length === 0 ? <p>
        or click <input type="file" id="fileInput" className="hidden"/><label htmlFor="fileInput" className="cursor-pointer text-accCyan hover:underline">HERE</label>
      </p> : <></>}
      {droppedFiles.length > 0 && (
        <>
          <hr />
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
                  className="text-accRed hover:text-white transition-all hover:bg-accRed px-2 rounded-md ease-linear"
                  onClick={() => handleRemoveFile([file])}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="text-accRed absolute bottom-3 left-1/2 -translate-x-1/2 border-2 border-accRed px-2 py-1 rounded-md hover:bg-accRed hover:text-white transition-all"
            onClick={() => handleRemoveFile(droppedFiles)}
          >
            Remove All
          </button>
        </>
      )}
    </div>
  );
};

const AnswerBox = () => {
  return (
    <div className="text-center bg-dimshadow border-highlight">
      <div className="border-2 p-4 h-[400px]"></div>
    </div>
  );
};
