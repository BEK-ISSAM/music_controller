import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
  const { roomCode } = useParams();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {},
  });

  const [showCreatePage, setShowCreatePage] = useState(false);
  const navigate = useNavigate();

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get_room/?code=${roomCode}`);
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

    const interval = setInterval(getCurrentSong, 3000);
    return () => clearInterval(interval);

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

  const getCurrentSong = () => {
    fetch('/spotify/current_song')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        else{
          return response.json();
        }
      })
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          song: data
        }));
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching current song:', error);
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
      <MusicPlayer {...state.song} />
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