import { CSSProperties, PropsWithChildren } from "react";
import red from "@mui/material/colors/red";
import grey from "@mui/material/colors/grey";
import cyan from "@mui/material/colors/cyan";
import orange from "@mui/material/colors/orange";
import amber from "@mui/material/colors/amber";
import lightGreen from "@mui/material/colors/lightGreen";
import lime from "@mui/material/colors/lime";
import teal from "@mui/material/colors/teal";
import {
  ThemeProvider as ThemeProvider2,
  createTheme,
} from "@mui/material/styles";
import { TDueStatus } from "app/helpers/card";

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
    leetcode: {
      difficulty: {
        Easy: string;
        Medium: string;
        Hard: string;
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
      dueStatus: Record<TDueStatus, string>;
    };
  }
  interface ThemeOptions {
    chart: {
      legend: CSSProperties;
    };
    leetcode: {
      difficulty: {
        Easy: string;
        Medium: string;
        Hard: string;
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
      dueStatus: Record<TDueStatus, string>;
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
  leetcode: {
    difficulty: {
      Easy: lightGreen[500],
      Medium: amber[500],
      Hard: red[500],
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
    dueStatus: {
      stale: red[500],
      bad: orange[500],
      now: amber[500],
      soon: lime[500],
      good: lightGreen[500],
      safe: teal[500],
      none: grey[500],
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
    MuiLink: {
      defaultProps: {
        underline: "hover",
        color: "Highlight",
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: "#ffffff55",
          backdropFilter: "blur(5px)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          height: INPUT_HEIGHT,
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
