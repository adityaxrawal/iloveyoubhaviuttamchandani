import React from 'react';
import PostCard from './PostCard';

/**
 * Route-level page component rendered at /bhavi
 * Wraps <ValentinePostcard> — customise props here to personalise.
 */
export default function PostCardPage() {
  return (
    <PostCard
      toName="Bhavi"
      fromName="Aditya"
      salutation="My Love, Bhavi"
      date="12/05"
      bodyText={`Every moment with you feels like the first day of spring — warm, gentle, and full of promise. You are the melody that plays in my heart when the world is quiet, and the reason my mornings feel brighter. Words fall short of what you mean to me, but know this: you are my greatest adventure, my softest place to land, and the answer to every silent wish I have ever made.`}
    />
  );
}
