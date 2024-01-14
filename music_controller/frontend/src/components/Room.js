import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false
  });

  const [showCreatePage, setShowCreatePage] = useState(false);
  const navigate = useNavigate();

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get_room?code=${roomCode}`);
      if (!response.ok) {
        leaveRoomCallback();
        navigate("/");
        return;
      }
  
      const data = await response.json();
      setState((prevState) => ({
        ...prevState,
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      }));
      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };
  

  useEffect(() => {
    getRoomDetails();
  }, [roomCode, leaveRoomCallback, navigate]);

  const authenticateSpotify = () => {
    fetch('/spotify/is_authenticated')
      .then((response) => response.json())
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          spotifyAuthenticated: data.status
        }));
  
        if (!data.status) {
          fetch('/spotify/get_auth_url')
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };
  
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave_room/", requestOptions).then((_response) => {
      leaveRoomCallback();
      navigate("/");
    });
  };

  const updateShowSettings = (value) => {
    setState((prevState) => ({
      ...prevState,
      showSettings: value,
    }));
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={state.votesToSkip}
          guestCanPause={state.guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => updateShowSettings(false)}
        >
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button
        variant="contained"
        color="primary"
        onClick={() => updateShowSettings(!state.showSettings)}
      >
        Settings
      </Button>
    </Grid>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {state.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {state.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {state.isHost.toString()}
        </Typography>
      </Grid>
      {state.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
      {state.showSettings ? renderSettings() : null}
    </Grid>
  );
};

export default Room;