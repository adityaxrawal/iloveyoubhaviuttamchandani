import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PixelPage3D from "./page/3d-heart";
import GlobalCursor from "./components/global-context/global-cursor";
// import PixelRose from "./components/pixel-rose/pixel-rose";

import LetterPage from "./page/letter";
import TextingPage from "./page/texting";
import PixelPage3D from "./page/3d-heart";
import PixelRose from "./components/pixel-rose/pixel-rose";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/love" element={<PixelPage3D />} />
        <Route path="/rose" element={<PixelRose />} />
        <Route path="*" element={<LetterPage />} />
        <Route path="texting" element={<TextingPage />} />
      </Routes>
      <GlobalCursor />
    </BrowserRouter>
  );
}

export default App;
