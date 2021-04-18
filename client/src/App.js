import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SocketContext, SocketProvider } from "./SocketContext";
import Join from "./components/Join/Join";
import { Box, CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import SimpleMeeting from "./components/SimpleMeeting/SimpleMeeting";
import { useEffect } from "react";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const App = () => {
    useEffect(() => {
        console.log("App mounted");
    }, []);

    return (
        <Router>
            <SocketProvider>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box
                        bgcolor="primary.secondary"
                        display="flex"
                        flexDirection="column"
                        height="100vh"
                    >
                        <Route path="/" exact component={Join} />
                        <Route path="/meet" exact component={SimpleMeeting} />
                    </Box>
                </MuiThemeProvider>
            </SocketProvider>
        </Router>
    );
};

export default App;
