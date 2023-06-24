import { createContext } from "react";

export interface UserDTO {
  name: string;
  count: number;
}

interface ResultContextprops {
  results: UserDTO[] | UserDTO[][];
  setResults: (results: UserDTO[] | UserDTO[][]) => void;
}

export const ResultContext = createContext<ResultContextprops>({
  results: [],
  setResults: (results: UserDTO[] | UserDTO[][]) => {},
});
