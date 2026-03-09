import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
    },
  });
