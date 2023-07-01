import { createContext } from "react";

interface ErrorContextProps {
  error: number;
  setError: (error: number) => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
  error: 0,
  setError: (error: number) => {},
});
