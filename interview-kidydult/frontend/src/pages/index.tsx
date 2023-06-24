import { useContext, useEffect, useState } from "react";
import SettingContext from "../contexts/SettingContext";
import { UserDTO, ResultContext } from "../contexts/ResultContext";

function Home() {
  const [type, setType] = useState<string>("ALL");
  const [order, setOrder] = useState<string>("DESC");
  const [find, setFind] = useState<string>("WORD");
  const [k, setK] = useState<number>(0);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<UserDTO[] | UserDTO[][]>([]);

  return (
    <SettingContext.Provider
      value={{ type, order, find, k, droppedFiles, setDroppedFiles }}
    >
      <ResultContext.Provider value={{ results, setResults }}>
        <main className=" font-jbmono p-20">
          <div className=" flex flex-row text-highlight justify-between gap-x-32">
            <div className=" w-1/2">
              <h1 className="text-4xl pb-5">Upload a log file (.txt)</h1>
              <FileDropZone />
              <button
                className=" text-accGreen text-2xl font-bold border-2 border-accGreen w-1/2 my-5 px-2 py-1 rounded-md hover:bg-accGreen hover:text-white transition-all"
                onClick={async () =>
                  uploadFiles(type, order, find, k, droppedFiles, setResults)
                }
              >
                Upload!
              </button>
            </div>

            <div className=" w-1/2 pt-14">
              <h1 className="text-2xl pb-2">Results:</h1>
              <AnswerBox />
              <div className=" flex flex-row justify-evenly pt-3">
                <SettingButton
                  opt1="ALL"
                  opt2="PER"
                  setter={setType}
                  setting={type}
                />
                <SettingButton
                  opt1="DESC"
                  opt2="ASC"
                  setter={setOrder}
                  setting={order}
                />
                <SettingButton
                  opt1="WORD"
                  opt2="PHRASE"
                  setter={setFind}
                  setting={find}
                />
                <KInput setter={setK} />
              </div>
            </div>
          </div>
        </main>
      </ResultContext.Provider>
    </SettingContext.Provider>
  );
}

export default Home;

const FileDropZone = () => {
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const { droppedFiles, setDroppedFiles } = useContext(SettingContext);

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
    setDroppedFiles((prevFiles: File[]) => [...prevFiles, ...uniqueFiles]);
  };

  const handleRemoveFile = (file: File[]) => {
    setDroppedFiles((prevFiles: File[]) =>
      prevFiles.filter((prevFile) => !file.includes(prevFile))
    );
  };

  return (
    <div
      className={`${
        highlighted && droppedFiles.length === 0
          ? "bg-highlight text-dimshadow border-dimshadow"
          : "border-highlight"
      }
      ${
        droppedFiles.length === 0 && "justify-center flex flex-col h-[500px]"
      } relative w-full border-2 border-dashed p-4 text-center cursor-pointer rounded-md transition-all`}
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
      {droppedFiles.length === 0 ? (
        <p>
          or click <input type="file" id="fileInput" className="hidden" />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-accCyan hover:underline"
          >
            HERE
          </label>
        </p>
      ) : (
        <></>
      )}
      {droppedFiles.length > 0 && (
        <>
          <hr />
          <ul className="my-4 h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-highlight scrollbar-track-highlight/10">
            {droppedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between py-1"
              >
                <span
                  className={`${
                    file.name.endsWith(".txt") && file.size < 1000000
                      ? "text-highlight"
                      : " text-accRed"
                  }`}
                >
                  {file.name.length <= 32
                    ? file.name
                    : file.name.substring(0, 32) + "..."}
                </span>
                <button
                  className="text-accRed hover:text-white transition-all hover:bg-accRed px-2 mr-2 rounded-md ease-linear"
                  onClick={() => handleRemoveFile([file])}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <hr className="pb-10" />
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
  const { find, droppedFiles } = useContext(SettingContext);
  const { results } = useContext(ResultContext);

  if (Array.isArray(results[0]) && results[0].length > 0)
    return (
      <div className="bg-dimshadow border-highlight">
        <div className="border-2 p-4 h-[400px] overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-highlight scrollbar-track-highlight/10">
          <ul className="transition-all">
            {results.map((file: any, fileIndex) => (
							<div className="pb-2">
								<span className=" text-lg">{droppedFiles[fileIndex].name.length <= 32 ? droppedFiles[fileIndex].name : droppedFiles[fileIndex].name.substring(0, 32) + "..."}</span>
								<hr className="py-1" />
                {file.map((result: any, userIndex: number) => (
                  <li key={result.name} className="pb-1 flex flex-row">
                    <span className="font-bold w-10">{userIndex + 1}.</span>
                    <span>
                      {result.name} - {result.count}{" "}
                      {find === "WORD" ? "words" : "phrases"}
                    </span>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  return (
    <div className="bg-dimshadow border-highlight">
      <div className="border-2 p-4 h-[400px] overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-highlight scrollbar-track-highlight/10">
        <ul className="transition-all">
          {results.map((result: any, index: number) => (
            <li key={result.name} className="pb-1 flex flex-row">
              <span className="font-bold w-10">{index + 1}.</span>
              <span>
                {result.name} - {result.count}{" "}
                {find === "WORD" ? "words" : "phrases"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const uploadFiles = async (
  type: string,
  order: string,
  find: string,
  k: number,
  droppedFiles: File[],
  setResults: (results: any) => void
) => {
  const formData = new FormData();

  droppedFiles.forEach((file) => {
    formData.append("file", file);
  });
  formData.append("order", order);
  formData.append("find", find);
  formData.append("k", k.toString());
  try {
    const response = await fetch(
      "http://localhost:3000/" + type.toLowerCase(),
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.status !== 201) {
      const errorResponse = await response.json();
      console.log(errorResponse.message);
    } else {
      const data = await response.json();
      setResults(data);
    }
  } catch (error) {
    console.log(error);
  }
};

interface ISettingButton {
  opt1: string;
  opt2: string;
  setter: (opt: string) => void;
  setting: string;
}

const SettingButton = (props: ISettingButton) => {
  const { opt1, opt2, setter, setting } = props;
  const { type, order, find, k, droppedFiles } = useContext(SettingContext);
  const { setResults } = useContext(ResultContext);

  useEffect(() => {
    uploadFiles(type, order, find, k, droppedFiles, setResults);
  }, [setting]);

  return (
    <button
      className={`border-2 ${
        setting === opt1
          ? "border-accCyan text-accCyan"
          : "border-accYellow text-accYellow"
      } rounded-md w-1/5 transition-all`}
      onClick={() => setter(setting === opt1 ? opt2 : opt1)}
    >
      {setting}
    </button>
  );
};

interface IKInput {
  setter: (k: number) => void;
}

const KInput = (props: IKInput) => {
  const { setter } = props;
  const { type, order, find, k, droppedFiles } = useContext(SettingContext);
  const { setResults } = useContext(ResultContext);

  useEffect(() => {
    if (Number.isNaN(k)) return;
    uploadFiles(type, order, find, k, droppedFiles, setResults);
  }, [k]);

  return (
    <input
      type="number"
      placeholder="K Value"
      className=" w-1/5 bg-transparent rounded-md border-2 border-highlight text-center number-input focus:outline-none"
      onChange={(e) => setter(parseInt(e.target.value))}
    />
  );
};
