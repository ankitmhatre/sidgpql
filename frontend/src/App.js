import logo from "./logo.svg";
import "./App.css";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom"

import React from "react";
import Bin from "./components/Bin";
import NewPost from "./components/NewPost";
import Posts from "./components/Posts";
import Home from "./components/Home";


function App() {




  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/bin",
      element: <Bin />,
    },
    {
      path: "/my-posts",
      element: <Posts />,
    },
    {
      path: "/new-post",
      element: <NewPost />,
    },
  ]);





  return (
    <div className="App">

<a href = "/">
  <li>Home</li>
</a>
<a href = "/bin">
  <li>Bin</li>
</a>
<a href = "/my-posts">
  <li>My Posts</li>
</a>
<a href = "/new-post">
  <li>New Post</li>
</a>



<RouterProvider router={router} />

    </div>
  );
}

export default App;
