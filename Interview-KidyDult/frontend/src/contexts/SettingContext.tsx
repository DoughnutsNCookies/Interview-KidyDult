import { createContext } from "react";

interface SettingContextProps {
  type: string;
  order: string;
	find: string;
	k: number;
	droppedFiles: File[];
	setDroppedFiles: (files: any) => void,
}

const SettingContext = createContext<SettingContextProps>({
  type: "ALL",
  order: "DESC",
	find: "WORD",
	k: 0,
	droppedFiles: [],
	setDroppedFiles: (files: any) => {},
});

export default SettingContext;