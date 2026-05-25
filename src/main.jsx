import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App";
import Admin from "./page/admin";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <Routes>

      <Route
        path="/"
        element={<App />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

    </Routes>

  </BrowserRouter>

);