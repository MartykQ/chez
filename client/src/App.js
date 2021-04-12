import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join/Join";
import { createMuiTheme, ThemeProvider, Box } from "@material-ui/core";
import SimpleMeeting from "./components/SimpleMeeting/SimpleMeeting";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="primary.secondary" display="flex" flexDirection="column" height="100vh">
                <Router>
                    <Route path="/" exact component={Join} />
                    <Route path="/meet" exact component={SimpleMeeting} />
                </Router>
            </Box>
        </ThemeProvider>
    );
};

export default App;
