import { createContext, useContext, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { routers } from './routes.tsx';
import io from 'socket.io-client';

// Tạo context cho kết nối Socket.IO
const SocketContext = createContext();

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Thiết lập kết nối Socket.IO
    const socket = io(process.env.REACT_APP_BASE_SOCKET, {transports: ["websocket"]}); // Thay đổi URL thành URL của máy chủ Socket.IO của bạn
    setSocket(socket);

    // Đảm bảo đóng kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {/* Cung cấp kết nối Socket.IO qua context provider */}
      <SocketContext.Provider value={socket}>
        <RouterProvider router={routers}/>
      </SocketContext.Provider>
    </div>
  );
}

// Hook để sử dụng kết nối Socket.IO trong các component con
export function useSocket() {
  return useContext(SocketContext);
}

export default App;
