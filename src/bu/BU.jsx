import React, { useRef } from "react";
import styles from "./BU.module.css";
import { useScrollColor } from "../hooks/useScrollColor";

// Section Components
import BirthdayCard from "./BirthdayCard/BirthdayCard";
import Messages from "./Messages/Messages";
import LoveCard from "./LoveCard/LoveCard";
import Footer from "./Footer/Footer";
import PostCard from "./PostCard/PostCard";

const SECTIONS = [
  { id: "birthday-card", color: "#FFB6C1" },
  { id: "text-one", color: "#E897A9" },
  { id: "love-card", color: "#D0637C" },
  { id: "text-two", color: "#B32244" },
  { id: "postcards", color: "#8B1A2F" },
  { id: "footer", color: "#8B1A2F" },
];

/**
 * Main Page Component
 * Renders a scroll-driven love letter experience with dynamic background transitions.
 */
export default function MyLoveBhavi() {
  const rootRef = useRef(null);

  // Drives the root container's background color dynamically on scroll
  useScrollColor(rootRef, SECTIONS);

  return (
    <div ref={rootRef} className={styles.rootWrapper}>
      {/* <BirthdayCard />

      <Messages
        id="text-one"
        heading="A few words from the heart..."
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
      /> */}

      {/* <LoveCard /> */}

      {/* <Messages
        id="text-two"
        heading="And then, there was you..."
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      /> */}

      <PostCard id="postcards" />

      {/* <Footer /> */}
    </div>
  );
}
