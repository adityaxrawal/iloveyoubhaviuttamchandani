import { BrowserRouter, Routes, Route } from "react-router-dom";
import PixelPage3D from "./page/3d-heart";
import GlobalCursor from "./components/global-context/global-cursor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/love" element={<PixelPage3D />} />
        <Route path="*" element={<PixelPage3D />} />
      </Routes>
      <GlobalCursor />
    </BrowserRouter>
  );
}

export default App;
