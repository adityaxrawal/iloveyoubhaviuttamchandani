import PixelHeart3D from './components/PixelHeart3D';
import PixelText3D from './components/PixelText3D';

function App() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-start">
      <div className="h-1/6 w-full">
        <PixelText3D text="I LOVE YOU BHAVI UTTAMCHANDANI" scale={0.9} />
      </div>
      <div className="h-3/6 w-full">
        <PixelHeart3D scale={0.7} />
      </div>
    </div>
  );
}

export default App;
