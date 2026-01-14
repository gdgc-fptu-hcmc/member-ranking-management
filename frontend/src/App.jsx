import { Route, Routes } from 'react-router-dom'
import { routes } from './routes';
import './App.css'

const renderRoutes = (routes) => {
  console.log("Rendering routes:", routes);
  return routes.map((r) => {
    return (
      <Route key={r.path} path={r.path} element={r.element}>
        {r.children && renderRoutes(r.children)}
      </Route>
    );
  });
};

function App() {
  return (
    <>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </>
  )
}

export default App
