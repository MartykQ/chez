import "./App.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { SocketContext, socket } from "./SocketContext";
import Join from "./components/Join/Join";
import { Box, CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import SimpleMeeting from "./components/SimpleMeeting/SimpleMeeting";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Box bgcolor="primary.secondary" display="flex" flexDirection="column" height="100vh">
                <Router>
                    <Route path="/" exact component={Join} />
                    <SocketContext.Provider value={socket}>
                        <Route path="/meet" exact component={SimpleMeeting} />
                    </SocketContext.Provider>
                </Router>
            </Box>
        </MuiThemeProvider>
    );
};

export default App;
