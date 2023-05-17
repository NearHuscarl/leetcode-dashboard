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
      }}
    />
  );
};
