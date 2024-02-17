// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;


import React from 'react';
import './App.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MovieListPage from './Pages/MovieListPage';
import MovieDetailPage from './Pages/MovieDetailPage';
import VideoPlayerPage from './Pages/VideoPlayerPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MovieListPage />,
  },
  {
    path: "/movie/:dbID",
    element: <MovieDetailPage />,
  },
  {
    path: "/play",
    element: <VideoPlayerPage />,
  },
]);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
