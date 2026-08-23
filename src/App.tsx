import { BrowserRouter, Routes, Route } from "react-router-dom";
// import PixelPage3D from "./page/3d-heart";
import GlobalCursor from "./components/global-context/global-cursor";
// import PixelRose from "./components/pixel-rose/pixel-rose";

import LetterPage from "./page/letter";
import TextingPage from "./page/texting";
import PixelPage3D from "./page/3d-heart";
import PixelRose from "./components/pixel-rose/pixel-rose";
import AnniversaryPage from "./page/anniversary";
import HeartTestPage from "./page/heart-test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/love" element={<PixelPage3D />} />
        <Route path="/rose" element={<PixelRose />} />
        <Route path="/anniversary" element={<AnniversaryPage />} />
        <Route path="/heart-test" element={<HeartTestPage />} />
        <Route path="/texting" element={<TextingPage />} />
        <Route path="*" element={<LetterPage />} />
      </Routes>
      <GlobalCursor />
    </BrowserRouter>
  );
}

export default App;
