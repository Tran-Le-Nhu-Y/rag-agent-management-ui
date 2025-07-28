import { createContext, useContext } from 'react';
import type { SnackbarSeverity } from '../util';

export interface SnackbarValue {
  message: string;
  severity?: SnackbarSeverity;
  duration?: number;
}

interface SnackbarProps {
  show: (value: SnackbarValue) => void;
}

const SnackbarContext = createContext<SnackbarProps>({
  show: () => {},
});

const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export { SnackbarContext, useSnackbar };
