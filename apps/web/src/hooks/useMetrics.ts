import { useEffect, useState, useRef } from 'react';

export interface SystemMetrics {
  cpu: number;
  memory: number;
  diskIO: { read: number; write: number };
  network: { tx: number; rx: number };
  timestamp: number;
}

export const useMetrics = (url: string = '/api/system/ws/metrics') => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      // Get token from somewhere (localStorage, cookies, or authStore)
      // For now, let's assume we can get it from localStorage or window.access_token
      const token = localStorage.getItem('access_token') || '';
      
      if (!token && !url.includes('token=')) {
        console.log('WS Waiting for token...');
        reconnectTimeout = setTimeout(connect, 2000);
        return;
      }

      const host = window.location.hostname;
      const port = '8000'; // Backend port
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      
      let wsUrl = url.startsWith('ws') ? url : `${protocol}//${host}:${port}${url}`;
      
      // Add token to query string
      if (!wsUrl.includes('token=')) {
        wsUrl += (wsUrl.includes('?') ? '&' : '?') + `token=${token}`;
      }
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
        console.log('WS Connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMetrics(data);
          setHistory((prev) => {
            const newHistory = [...prev, data];
            return newHistory.slice(-60); // Keep last 60 points
          });
        } catch (err) {
          console.error('WS Parse Error', err);
        }
      };

      socket.onclose = () => {
        setConnected(false);
        console.log('WS Disconnected, retrying in 3s...');
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.error('WS Error', err);
        socket.close();
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [url]);

  return { metrics, history, connected };
};
