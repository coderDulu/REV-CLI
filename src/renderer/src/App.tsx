import React, { useEffect } from "react";
import Layout from "./components/layout/page";
import { useLocation, useBlocker } from 'react-router-dom';

function App() {
  // const history = useLocation();

  // useEffect(() => {
  //   const pathname = history.pathname
  //   sessionStorage.setItem('route-path', pathname);
  // }, [history.pathname]);

  return <Layout />;
}

export default App;
