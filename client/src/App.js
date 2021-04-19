

import { Box, CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Join from "./components/Join/Join";
import SimpleMeeting from "./components/SimpleMeeting/SimpleMeeting";
import { SocketProvider } from "./contexts/SocketContext";

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
