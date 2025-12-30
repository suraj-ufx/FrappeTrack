import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
 useEffect(() => {
  console.log("electronAPI available?", window.electronAPI);
  console.log("setCookie function?", typeof window.electronAPI?.setCookie);
}, []);
console.log("react is executing")
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
