const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#F1C40F",
            dark: "#D4AC0D",
            contrastText: "#000000",
          },
          secondary: {
            main: "#000000",
            contrastText: "#FFFFFF",
          },
          background: {
            default: "#FFF9E6",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#1C1C1C",
            secondary: "#4F4F4F",
          },
          divider: "#F1C40F",
        }
      : {
          primary: {
            main: "#F1C40F",
            dark: "#D4AC0D",
            contrastText: "#000000",
          },
          secondary: {
            main: "#F9E79F",
            contrastText: "#000000",
          },
          background: {
            default: "#0D0D0D",
            paper: "#1A1A1A",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#CCCCCC",
          },
          divider: "#333333",
        }),
  },

  typography: {
    fontFamily: `'Poppins', 'Roboto', 'Arial', sans-serif`,
    h1: { fontWeight: 700, letterSpacing: "0.5px" },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
    button: {
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.8px",
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 8px rgba(0,0,0,0.05)"
              : "0 2px 10px rgba(255,255,255,0.05)",
          transition: "all 0.3s ease",
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: "10px",
          fontWeight: 600,
          padding: "10px 22px",
          transition: "all 0.3s ease",

          ...(ownerState.variant === "contained" && {
            color:
              theme.palette[ownerState.color]?.contrastText ||
              theme.palette.primary.contrastText,
            backgroundColor:
              theme.palette[ownerState.color]?.main ||
              theme.palette.primary.main,
            "&:hover": {
              backgroundColor:
                theme.palette[ownerState.color]?.dark ||
                theme.palette.primary.dark,
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }),

          ...(ownerState.variant === "outlined" && {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(245, 184, 0, 0.1)"
                  : "rgba(255,255,255,0.1)",
              borderColor: theme.palette.primary.dark,
            },
          }),
        }),
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
          height: "4px",
          borderRadius: "4px",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          color: theme.palette.text.secondary,
          "&.Mui-selected": {
            color: theme.palette.text.primary,
          },
          "&:hover": {
            color: theme.palette.text.primary,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.23)"
                : "rgba(255, 255, 255, 0.23)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
          margin: "8px 0",
        }),
      },
    },
  },
});

export default getDesignTokens;
