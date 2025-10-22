import PixelHeart3D from './components/PixelHeart3D';
import PixelText3D from './components/PixelText3D';

function App() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      <div className="h-1/4 w-full">
        <PixelText3D text="I LOVE YOU BHAVI UTTAMCHANDANI" scale={1.2} />
      </div>
      <div className="h-3/4 w-full">
        <PixelHeart3D />
      </div>
    </div>
  );
}

export default App;
