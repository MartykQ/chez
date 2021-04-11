import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join/Join";
import Meeting from "./components/Meeting/Meeting";
import { createMuiTheme, ThemeProvider, Box } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        bgcolor="primary.secondary"
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        <Router>
          <Route path="/" exact component={Join} />
          <Route path="/meet" exact component={Meeting} />
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;
