import { createContext } from "react";

interface ErrorContextprops {
  error: string;
  setError: (error: string) => void;
}

export const ErrorContext = createContext<ErrorContextprops>({
  error: "",
  setError: (error: string) => {},
});
