import GlobalStyles from "@mui/material/GlobalStyles";
import grey from "@mui/material/colors/grey";

export const GlobalStyle = () => {
  return (
    <GlobalStyles
      styles={{
        h1: { color: "grey" },
        body: {
          backgroundColor: `${grey[100]} !important`,
        },
        "*": {
          // the fuck is it not included by default
          boxSizing: "border-box",
        },
        "@keyframes pulse": {
          "0%": {
            transform: "scale(1, 1)",
            opacity: 0.5,
          },
          "100%": {
            transform: "scale(3, 3)",
            opacity: 0,
          },
        },
      }}
    />
  );
};
