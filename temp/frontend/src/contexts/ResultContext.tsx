import { createContext } from "react";

export interface UserDTO {
  name: string;
  count: number;
}

interface ResultContextProps {
  results: UserDTO[] | UserDTO[][];
  setResults: (results: UserDTO[] | UserDTO[][]) => void;
}

export const ResultContext = createContext<ResultContextProps>({
  results: [],
  setResults: (results: UserDTO[] | UserDTO[][]) => {},
});
