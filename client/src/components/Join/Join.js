import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@material-ui/core";
import { Button } from "@material-ui/core";

import "./Join.css";

import { makeStyles } from "@material-ui/core/styles";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography variant="h3" fullWidth>
          Join room
        </Typography>
        <CssBaseline />
        <TextField
          variant="outlined"
          placeholder="name"
          margin="normal"
          fullWidth
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          variant="outlined"
          placeholder="room"
          margin="normal"
          fullWidth
          onChange={(event) => setRoom(event.target.value)}
        />
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
          to={`/meet?name=${name}&room=${room}`}
        >
          <Button type="submit" fullWidth variant="contained" color="primary">
            Join
          </Button>
        </Link>
      </div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default Join;
