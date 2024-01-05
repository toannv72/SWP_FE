
import { RouterProvider } from 'react-router-dom';
import { routers } from './routes.tsx';

function App() {
  return (
    <div className="App">
    <RouterProvider router={routers}/>
    </div>
  );
}

export default App;
