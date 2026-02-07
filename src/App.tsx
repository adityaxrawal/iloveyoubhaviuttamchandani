import { BrowserRouter, Routes, Route } from "react-router-dom";
import PixelPage3D from "./page/PixelPage3D";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/love" element={<PixelPage3D />} />
        <Route path="*" element={<PixelPage3D />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
