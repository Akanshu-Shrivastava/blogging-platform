import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "../redux/store.js";
import "react-quill-new/dist/quill.snow.css"; // ✅ correct import

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import BlogDetail from "./pages/BlogDetails.jsx";
import BlogEdit from "./pages/BlogEdit.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUser from "./pages/admin/CreateUser.jsx";
import LandingPage from "./pages/LandingPage.jsx";

// Routes configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "create", element: <CreateBlog /> },
      { path: "blogs/:id", element: <BlogDetail /> },
      { path: "blogs/:id/edit", element: <BlogEdit /> },
      { path: "/profile", element: <Profile /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "admin/create-user", element: <CreateUser /> },
      { path: "/", element: <LandingPage /> },
      // <Route path="/" element={<LandingPage />} />
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
