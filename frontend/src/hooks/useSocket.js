import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (eventHandlers = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
};
