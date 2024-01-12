import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomCode } = useParams();
  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
  });

  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const response = await fetch(`/api/get_room/?code=${roomCode}`);
        const data = await response.json();

        setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      } catch (error) {
        console.error('Error fetching room details:', error);
        // Handle error as needed
      }
    };

    getRoomDetails();
  }, [roomCode]);

  return (
    <div>
      <h3>{roomCode}</h3>
      <p>Votes: {state.votesToSkip}</p>
      <p>Guest Can Pause: {state.guestCanPause.toString()}</p>
      <p>Host: {state.isHost.toString()}</p>
    </div>
  );
};

export default Room;
