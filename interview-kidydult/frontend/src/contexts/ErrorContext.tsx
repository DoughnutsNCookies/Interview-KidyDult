import { createContext } from "react";

interface ErrorContextProps {
  error: string;
  setError: (error: string) => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
  error: "",
  setError: (error: string) => {},
});
