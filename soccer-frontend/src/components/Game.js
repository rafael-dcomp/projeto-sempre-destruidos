import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './Game.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_RADIUS = 20;
const BALL_RADIUS = 10;
const GOAL_WIDTH = 50;
const GOAL_HEIGHT = 200;

function Game({ roomId }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const inputsRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    action: false
  });

  useEffect(() => {
    // Setup WebSocket connection
    const socket = new SockJS('/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        // Subscribe to room updates
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const state = JSON.parse(message.body);
          setGameState(state);
        });

        // Join the room
        client.publish({
          destination: `/app/join/${roomId}`,
          body: JSON.stringify({})
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId]);

  useEffect(() => {
    // Send input updates
    if (stompClient && connected) {
      const interval = setInterval(() => {
        stompClient.publish({
          destination: `/app/input/${roomId}`,
          body: JSON.stringify(inputsRef.current)
        });
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(interval);
    }
  }, [stompClient, connected, roomId]);

  useEffect(() => {
    // Keyboard controls
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          inputsRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'd':
          inputsRef.current.right = true;
          break;
        case 'ArrowUp':
        case 'w':
          inputsRef.current.up = true;
          break;
        case 'ArrowDown':
        case 's':
          inputsRef.current.down = true;
          break;
        case ' ':
          inputsRef.current.action = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          inputsRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'd':
          inputsRef.current.right = false;
          break;
        case 'ArrowUp':
        case 'w':
          inputsRef.current.up = false;
          break;
        case 'ArrowDown':
        case 's':
          inputsRef.current.down = false;
          break;
        case ' ':
          inputsRef.current.action = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    // Render game
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw field lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Goals
    ctx.fillStyle = '#888888';
    // Left goal
    ctx.fillRect(0, (CANVAS_HEIGHT - GOAL_HEIGHT) / 2, GOAL_WIDTH, GOAL_HEIGHT);
    // Right goal
    ctx.fillRect(CANVAS_WIDTH - GOAL_WIDTH, (CANVAS_HEIGHT - GOAL_HEIGHT) / 2, GOAL_WIDTH, GOAL_HEIGHT);

    // Draw players
    if (gameState.players) {
      Object.entries(gameState.players).forEach(([socketId, player]) => {
        ctx.fillStyle = player.team === 'red' ? '#ff4444' : '#4444ff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Draw ball
    if (gameState.ball) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [gameState]);

  if (!connected) {
    return <div className="game-container">Connecting to game server...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="room-id">Room: {roomId}</div>
        <div className="scoreboard">
          <span className="score red-score">
            Red: {gameState?.score?.red || 0}
          </span>
          <span className="timer">
            {gameState?.matchTime || 60}s
          </span>
          <span className="score blue-score">
            Blue: {gameState?.score?.blue || 0}
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <div className="controls-info">
        <p>Controls: WASD or Arrow Keys to move | Space to action</p>
      </div>
    </div>
  );
}

export default Game;
