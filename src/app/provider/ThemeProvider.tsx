import { PropsWithChildren } from "react";
import grey from "@mui/material/colors/grey";
import cyan from "@mui/material/colors/cyan";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import {
  ThemeProvider as ThemeProvider2,
  createTheme,
} from "@mui/material/styles";

export const INPUT_HEIGHT = 35;

declare module "@mui/material/styles/createTheme" {
  interface Theme {
    chart: {
      legend: {
        color?: string;
        fontSize?: number;
      };
    };
    anki: {
      ease: {
        again: string;
        hard: string;
        good: string;
        easy: string;
        unknown: string;
      };
    };
  }
  interface ThemeOptions {
    chart: {
      legend: {
        color?: string;
        fontSize?: number;
      };
    };
    anki: {
      ease: {
        again: string;
        hard: string;
        good: string;
        easy: string;
        unknown: string;
      };
    };
  }
}

const defaultTheme = createTheme();
export const primaryColor = cyan;

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor[500],
    },
  },
  chart: {
    legend: {
      color: grey[400],
      fontSize: 11,
    },
  },
  anki: {
    ease: {
      again: grey[200],
      hard: orange[500],
      good: amber[500],
      easy: lightGreen[500],
      unknown: grey[900],
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: `rgba(0, 0, 0, 0.1) 0px 10px 50px`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: `rgba(0, 0, 0, 0.1) 0px 10px 50px`,
        },
      },
    },
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
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        root: {
          backgroundColor: grey[100],
          borderRadius: 4,
          transition: "0.2s background-color ease-in-out",
          "&:hover": {
            backgroundColor: grey[200],
          },
          "& fieldset": {
            border: "none",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: INPUT_HEIGHT,
          fontSize: 15,
        },
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
