import { CSSProperties, PropsWithChildren } from "react";
import red from "@mui/material/colors/red";
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

export type TMuiColor = Record<keyof typeof grey, string>;

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
      cardType: {
        New: string;
        Learning: string;
        Young: string;
        Mature: string;
        Relearning: string;
        Unknown: string;
      };
    };
  }
  interface ThemeOptions {
    chart: {
      legend: CSSProperties;
    };
    anki: {
      ease: {
        again: string;
        hard: string;
        good: string;
        easy: string;
        unknown: string;
      };
      cardType: {
        New: string;
        Learning: string;
        Young: string;
        Mature: string;
        Relearning: string;
        Unknown: string;
      };
    };
  }
}
declare module "@mui/material/styles/createPalette" {
  interface SimplePaletteColorOptions {
    color?: TMuiColor;
  }
  interface PaletteColor {
    color: TMuiColor;
  }
}

const defaultTheme = createTheme();
export const primaryColor = cyan;
export const secondaryColor = amber;

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor[500],
      color: primaryColor,
    },
    secondary: {
      main: secondaryColor[500],
      color: secondaryColor,
    },
  },
  chart: {
    legend: {
      color: grey[400],
      fontSize: 11,
      fill: "currentColor",
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
    cardType: {
      New: secondaryColor[500],
      Learning: primaryColor[300],
      Young: primaryColor[600],
      Mature: primaryColor[900],
      Relearning: red[500],
      Unknown: grey[500],
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
