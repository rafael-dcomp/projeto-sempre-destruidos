import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get room ID from URL query parameter or fetch available room
    const urlParams = new URLSearchParams(window.location.search);
    const urlRoomId = urlParams.get('room');

    if (urlRoomId) {
      setRoomId(urlRoomId);
    } else {
      // Fetch available room from backend
      fetch('/api/rooms/available')
        .then(response => response.text())
        .then(data => {
          setRoomId(data);
        })
        .catch(error => {
          console.error('Error fetching room:', error);
          setRoomId('room-1'); // Default fallback
        });
    }
  }, []);

  const handleConnect = () => {
    if (roomId) {
      setIsConnected(true);
    }
  };

  if (!roomId) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="App">
        <div className="lobby">
          <h1>Multiplayer Soccer</h1>
          <div className="room-info">
            <p>Room ID: <strong>{roomId}</strong></p>
          </div>
          <button className="connect-button" onClick={handleConnect}>
            Join Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Game roomId={roomId} />
    </div>
  );
}

export default App;
