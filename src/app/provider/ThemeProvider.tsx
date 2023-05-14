import { PropsWithChildren } from "react";
import { indigo } from "@mui/material/colors";
import {
  ThemeProvider as ThemeProvider2,
  createTheme,
} from "@mui/material/styles";

const defaultTheme = createTheme();
const primaryColor = indigo;

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor[500],
    },
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderTopRightRadius: defaultTheme.shape.borderRadius,
          borderTopLeftRadius: defaultTheme.shape.borderRadius,
          "&.Mui-selected": {
            backgroundColor: primaryColor[50],
          },
        },
      },
    },
  },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return <ThemeProvider2 theme={theme}>{children}</ThemeProvider2>;
};
