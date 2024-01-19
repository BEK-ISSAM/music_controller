import React, { useState, useEffect } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const MusicPlayer = (props) => {
  const { time, duration, image_url, title, artist, propIsPlaying } = props;
  const [is_playing, setIsPlaying] = useState(propIsPlaying);

  const songProgress = (time / duration) * 100;

  useEffect(() => {
    setIsPlaying(propIsPlaying);
  }, [propIsPlaying]);

  const skipSong = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch('/spotify/skip', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Skip request failed");
        }
        // handle successful response if needed
      })
      .catch((error) => {
        console.error("Error skipping song:", error);
      });
  }

  const pauseSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_playing: false }), // Send the current state
    };

    fetch("/spotify/pause", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pause request failed");
        }
        console.log("Pause request successful: " + !is_playing);
        setIsPlaying(false);
      })
      .catch((error) => {
        console.error("Error pausing song:", error);
      });
  };

  const playSong = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_playing: true }), // Send the current state
    };

    fetch("/spotify/play", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Play request failed");
        }
        console.log("Play request successful: " + !is_playing);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing song:", error);
      });
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={image_url} height="100%" width="100%" alt="Album Cover" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton onClick={() => (is_playing ? pauseSong() : playSong())}>
              {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={() => {skipSong()}}>
            {props.votes} /{" "}{props.votes_required}
            <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
