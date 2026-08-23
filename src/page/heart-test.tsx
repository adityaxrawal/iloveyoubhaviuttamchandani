import HandDrawnHeart from "../components/HandDrawnHeart";
import HandDrawnHeart2 from "../components/HandDrawnHeart2";
import LoveRingsIllustration from "../components/LoveRingsIllustration";
import TravelLoveIllustration from "../components/TravelLoveIllustration";
import CelebrationChampagneIllustration from "../components/CelebrationChampagneIllustration";
import LoveCoffeeCupsIllustration from "../components/LoveCoffeeCupsIllustration";
import HandDrawnSpark from "../components/HandDrawnSpark";
import LoveHouseIllustration from "../components/LoveHouseIllustration";
import TravelHeartFlightIllustration from "../components/TravelHeartFlightIllustration";
import LoveCoffeeMugsIllustration from "../components/LoveCoffeeMugsIllustration";
import LoveMessageBubblesIllustration from "../components/LoveMessageBubblesIllustration";
import CoupleLovePortraitIllustration from "../components/CoupleLovePortraitIllustration";

export default function HeartTestPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5ebdd", // matching paper color
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 264,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <HandDrawnHeart size="100%" />
        </div>

        <div
          style={{
            width: 280,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <HandDrawnHeart2 size="100%" />
        </div>

        <div
          style={{
            width: 280,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <LoveRingsIllustration size="100%" />
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <TravelLoveIllustration size="100%" />
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <CelebrationChampagneIllustration size="100%" />
        </div>

        <div
          style={{
            width: 280,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <LoveCoffeeCupsIllustration size="100%" />
        </div>

        <div
          style={{
            width: 160,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <HandDrawnSpark size="100%" />
        </div>

        <div
          style={{
            width: 400,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <LoveHouseIllustration size="100%" />
        </div>

        <div
          style={{
            width: 360,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <TravelHeartFlightIllustration size="100%" />
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <LoveCoffeeMugsIllustration size="100%" />
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <LoveMessageBubblesIllustration size="100%" />
        </div>

        <div
          style={{
            width: 320,
            padding: 20,
            background: "#f5ebdd",
          }}
        >
          <CoupleLovePortraitIllustration size="100%" />
        </div>
      </div>
    </div>
  );
}
