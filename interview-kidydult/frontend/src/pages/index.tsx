import { useContext, useEffect, useState } from "react";
import SettingContext from "../contexts/SettingContext";
import { UserDTO, ResultContext } from "../contexts/ResultContext";
import { ErrorContext } from "@/contexts/ErrorContext";
import { UploadedContext } from "@/contexts/UploadedContext";

function Home() {
  const [type, setType] = useState<string>("ALL");
  const [order, setOrder] = useState<string>("DESC");
  const [find, setFind] = useState<string>("WORD");
  const [k, setK] = useState<number>(0);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<UserDTO[] | UserDTO[][]>([]);
  const [toolTip, setToolTip] = useState<string>("");
  const [error, setError] = useState<number>(0);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setAnimation(true);
    }, 500);
  }, []);

  return (
    <UploadedContext.Provider value={{ uploaded, setUploaded }}>
      <ErrorContext.Provider value={{ error, setError }}>
        <SettingContext.Provider
          value={{ type, order, find, k, droppedFiles, setDroppedFiles }}
        >
          <ResultContext.Provider value={{ results, setResults }}>
            <main className="font-jbmono px-4 py-10 lg:px-20 lg:pt-16 min-w-[530px]">
              <div className="flex flex-col lg:flex-row text-highlight justify-between gap-x-16 xl:gap-x-32">
                <div
                  className={`${
                    mounted ? "" : "opacity-0 -translate-x-16"
                  } transition-all ease-in-out duration-500 w-full lg:w-1/2 flex flex-col`}
                >
                  <h1
                    className={`${
                      animation ? "" : "opacity-0 translate-y-4"
                    } transition-all ease-in-out duration-500 text-4xl pb-5`}
                  >
                    Upload a log file (.txt)
                  </h1>
                  <FileDropZone />
                  <span
                    className={`${
                      animation ? "" : "opacity-0 -translate-y-4"
                    } transition-all ease-in-out duration-500 w-full pt-2 text-center text-accRed text-lg`}
                  >
                    {error === 1
                      ? "K must be a positive integer"
                      : error === 2
                      ? "Invalid file! (.txt files not more than 1MB only)"
                      : ""}
                  </span>
                </div>
                <div
                  className={`${
                    mounted ? "" : "opacity-0 translate-x-16"
                  } transition-all ease-in-out duration-500 w-full lg:w-1/2 pt-14 flex flex-col`}
                >
                  <h1
                    className={`${
                      animation ? "" : "opacity-0 translate-y-4"
                    } transition-all ease-in-out text-3xl pb-2`}
                  >
                    Results:
                  </h1>
                  <AnswerBox />
                  <div
                    className={`${
                      animation ? "" : "opacity-0 -translate-y-4"
                    } transition-all ease-in-out duration-700 flex flex-row justify-evenly pt-3`}
                  >
                    <SettingButton
                      opt1="ALL"
                      opt2="PER"
                      setter={setType}
                      setting={type}
                      setTooltip={setToolTip}
                    />
                    <SettingButton
                      opt1="DESC"
                      opt2="ASC"
                      setter={setOrder}
                      setting={order}
                      setTooltip={setToolTip}
                    />
                    <SettingButton
                      opt1="WORD"
                      opt2="SENT"
                      setter={setFind}
                      setting={find}
                      setTooltip={setToolTip}
                    />
                    <KInput setter={setK} />
                  </div>
                  <span
                    className={
                      "text-center w-full py-1 text-lg text-highlight animate-pulse"
                    }
                  >
                    {(toolTip === "" && "") ||
                      (toolTip === "ALL" && "Showing results from ALL files") ||
                      (toolTip === "PER" && "Showing results PER file") ||
                      (toolTip === "DESC" && "Showing results in DESC order") ||
                      (toolTip === "ASC" && "Showing results in ASC order") ||
                      (toolTip === "WORD" &&
                        "Showing results of WORD count per user") ||
                      (toolTip === "SENT" &&
                        "Showing results of SENTENCE count per user")}
                  </span>
                </div>
              </div>
            </main>
          </ResultContext.Provider>
        </SettingContext.Provider>
      </ErrorContext.Provider>
    </UploadedContext.Provider>
  );
}

export default Home;

const FileDropZone = () => {
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(false);
  const { type, order, find, k, droppedFiles, setDroppedFiles } =
    useContext(SettingContext);
  const { setResults } = useContext(ResultContext);
  const { error, setError } = useContext(ErrorContext);
  const { setUploaded } = useContext(UploadedContext);

  useEffect(() => {
    checkError(k, droppedFiles, setError);
    if (droppedFiles.length === 0) setUploaded(false);
  }, [droppedFiles]);

  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 500);
  });

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

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) setDroppedFiles([file]);
  };

  const handleRemoveFile = (file: File[]) => {
    setDroppedFiles((prevFiles: File[]) =>
      prevFiles.filter((prevFile) => !file.includes(prevFile))
    );
  };

  const handleUpload = () => {
    uploadFiles(type, order, find, k, droppedFiles, setResults);
    setUploaded(true);
  };

  const handleRemoveInvalid = () => {
    setDroppedFiles(
      droppedFiles.filter((file) => {
        return file.name.endsWith(".txt") && file.size <= 1000000;
      })
    );
    checkError(k, droppedFiles, setError);
  };

  const handleRemoveAll = () => {
    setDroppedFiles([]);
    setResults([]);
    setUploaded(false);
  };

  return (
    <div
      className={`${
        highlighted && droppedFiles.length === 0
          ? "bg-highlight text-dimshadow border-dimshadow"
          : "border-highlight"
      }
      ${
        droppedFiles.length === 0 && "justify-center flex flex-col h-[542px]"
      } relative w-full border-2 border-dashed py-4 text-center cursor-pointer rounded-md transition-all`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p
        className={`${
          animation ? "" : "opacity-0"
        } transition-all ease-in-out duration-1000 pb-2 text-2xl`}
      >
        {droppedFiles.length === 0
          ? "Drag and drop your files here"
          : "You can still drop more!"}
      </p>
      {droppedFiles.length === 0 ? (
        <p
          className={`${
            animation ? "" : "opacity-0"
          } transition-all ease-in-out duration-1000 text-lg`}
        >
          or click{" "}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleSelect}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-accCyan hover:underline text-xl"
          >
            HERE
          </label>
        </p>
      ) : (
        <></>
      )}
      {droppedFiles.length > 0 && (
        <>
          <hr className="mx-4" />
          <ul className="my-4 h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-highlight scrollbar-track-highlight/10">
            {droppedFiles.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between py-1 rounded-md transition-all hover:bg-highlight/10"
              >
                <span
                  className={`${
                    file.name.endsWith(".txt") && file.size <= 1000000
                      ? "text-highlight"
                      : "text-accRed"
                  } pl-4`}
                >
                  {file.name.length <= 16
                    ? file.name
                    : file.name.substring(0, 16) + "..."}
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
          <hr className="pb-4 mx-4" />
          <div className="flex flex-row justify-evenly">
            <button
              className={`w-1/4 font-bold border-2 px-2 py-1 ${
                error
                  ? "text-accGreen/50 border-accGreen/50"
                  : "text-accGreen border-accGreen hover:bg-accGreen hover:text-white"
              } rounded-md transition-all`}
              onClick={() => handleUpload()}
              disabled={error !== 0}
            >
              Upload
            </button>
            <button
              className={`${
                error === 2
                  ? "text-accCyan border-accCyan hover:bg-accCyan hover:text-white"
                  : "text-accCyan/50 border-accCyan/50"
              } w-1/4 border-2 px-2 py-1 rounded-md transition-all`}
              onClick={() => handleRemoveInvalid()}
              disabled={error !== 2}
            >
              Remove Invalid
            </button>
            <button
              className="text-accRed w-1/4 border-2 border-accRed px-2 py-1 rounded-md hover:bg-accRed hover:text-white transition-all"
              onClick={() => handleRemoveAll()}
            >
              Remove All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const AnswerBox = () => {
  const { find, droppedFiles } = useContext(SettingContext);
  const { results } = useContext(ResultContext);

  const ListItems = (props: { output: UserDTO[] | UserDTO[][] }) => (
    <ul>
      {props.output.map((result: any, userIndex: number) => (
        <li
          key={result.name}
          className="pb-1 flex flex-row justify-between rounded-md transition-all hover:bg-highlight/10"
        >
          <div className="flex flex-row">
            <span className="pl-4 font-bold w-14">{userIndex + 1}.</span>
            <span>
              {result.name.length <= 16
                ? result.name
                : result.name.substring(0, 16) + "..."}
            </span>
          </div>
          <span className="pr-4">
            {result.count} {find === "WORD" ? "words" : "sentences"}
          </span>
        </li>
      ))}
    </ul>
  );

  const NestedListItems = () => (
    <>
      {results.map((file: any, fileIndex) => (
        <div key={fileIndex} className="pb-2">
          <span className="text-lg ml-4">
            {droppedFiles[fileIndex] &&
            droppedFiles[fileIndex].name.length <= 32
              ? droppedFiles[fileIndex].name
              : droppedFiles[fileIndex].name.substring(0, 32) + "..."}
          </span>
          <hr className="mx-4 py-1" />
          <ListItems output={file} />
        </div>
      ))}
    </>
  );

  return (
    <div className="bg-dimshadow border-highlight">
      <div className="border-2 py-2 h-[440px] overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-highlight scrollbar-track-highlight/10 transition-all">
        {Array.isArray(results[0]) && results[0].length > 0 ? (
          <NestedListItems />
        ) : (
          <ListItems output={results} />
        )}
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
  if (Number.isNaN(k) || k < 1) return;
  formData.append("k", k.toString());
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/" + type.toLowerCase(),
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
  setTooltip: (toolTip: string) => void;
}

const SettingButton = (props: ISettingButton) => {
  const { opt1, opt2, setter, setting, setTooltip } = props;
  const { type, order, find, k, droppedFiles } = useContext(SettingContext);
  const { setResults } = useContext(ResultContext);
  const [hover, setHover] = useState<boolean>(false);
  const { uploaded } = useContext(UploadedContext);

  useEffect(() => {
    if (uploaded) uploadFiles(type, order, find, k, droppedFiles, setResults);
    setTooltip(setting);
  }, [setting]);

  useEffect(() => {
    setTooltip(hover ? setting : "");
  }, [hover]);

  return (
    <button
      className={`border-2 ${
        setting === opt1
          ? "border-accCyan text-accCyan hover:bg-accCyan"
          : "border-accYellow text-accYellow hover:bg-accYellow"
      } rounded-md w-1/5 transition-all text-lg hover:text-highlight`}
      onClick={() => setter(setting === opt1 ? opt2 : opt1)}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
  const { error, setError } = useContext(ErrorContext);
  const { uploaded } = useContext(UploadedContext);

  useEffect(() => {
    checkError(k, droppedFiles, setError);
    if (error) return;
    if (uploaded) uploadFiles(type, order, find, k, droppedFiles, setResults);
  }, [k]);

  return (
    <input
      type="number"
      placeholder="K Value"
      className={` w-1/5 bg-transparent rounded-md border-2 text-center text-lg number-input focus:outline-none hover:animate-none placeholder-highlight/50 ${
        Number.isNaN(k) || k < 1
          ? "animate-pulse border-accRed"
          : "border-highlight"
      }`}
      onChange={(e) => setter(parseInt(e.target.value))}
    />
  );
};

const checkError = (
  k: number,
  droppedFiles: File[],
  setError: (error: number) => void
) => {
  setError(0);
  if (Number.isNaN(k) || k < 1) setError(1);
  for (let file of droppedFiles) {
    if (!file.name.endsWith(".txt") || file.size > 1000000) setError(2);
  }
};
