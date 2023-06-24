import { createContext } from "react";

interface UploadedContextProps {
  uploaded: boolean;
  setUploaded: (uploaded: boolean) => void;
}

export const UploadedContext = createContext<UploadedContextProps>({
  uploaded: false,
  setUploaded: (uploaded: boolean) => {},
});
