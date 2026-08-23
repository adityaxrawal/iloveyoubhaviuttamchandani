import section5Bg from "../background/section5.svg";
import tulipBouquetExactSvg from "../elements/tulip_bouquet_exact.svg";

// Note Card SVGs
import twoCupsSvg from "../elements/two_cups_you_make_ordinary_special_exact.svg";
import youreSafeplaceSvg from "../elements/youre_my_safe_place_exact.svg";
import alwaysWithYouSvg from "../elements/always_with_you_note_exact.svg";
import yourSmileSvg from "../elements/your_smile_world_brighter_exact.svg";
import endlessConvoSvg from "../elements/i_love_our_endless_conversations_exact.svg";
import everyAdventureSvg from "../elements/every_adventure_better_with_you_exact.svg";
import cantWaitSvg from "../elements/i_cant_wait_for_all_our_tomorrows_exact.svg";
import simplyLoveSvg from "../elements/simply_put_just_love_you_exact.svg";

// Scrapbook Elements from src/anniversary/elements
import heartPostageStamp_12_23ExactSvg from "../elements/heart_postage_stamp_12_23_exact.svg";
import cherriesExactSvg from "../elements/cherries_exact.svg";
import ticTacToeHanddrawnExactSvg from "../elements/tic_tac_toe_handdrawn_exact.svg";
import goldenHeartExactSvg from "../elements/golden_heart_exact.svg";
import redHanddrawnHeartExactSvg from "../elements/red_handdrawn_heart_exact.svg";
import redHeartBalloonsExactSvg from "../elements/red_heart_balloons_exact.svg";

import Doodle from "../components/Doodle";
import s from "./S5Reasons.module.css";

/* ── Card data ─────────────────────────────────────── */
const CARDS = [
  { id: 0, svg: twoCupsSvg },
  { id: 1, svg: youreSafeplaceSvg },
  { id: 2, svg: alwaysWithYouSvg },
  { id: 3, svg: yourSmileSvg },
  { id: 4, svg: endlessConvoSvg },
  { id: 5, svg: everyAdventureSvg },
  { id: 6, svg: cantWaitSvg },
  { id: 7, svg: simplyLoveSvg },
] as const;

/* ── Component ─────────────────────────────────────── */
export default function S5Reasons() {
  return (
    <section className={s.section} id="S5Reasons">
      {/* ─── Background ─── */}
      <img src={section5Bg} alt="" className={s.bg} aria-hidden="true" />

      {/* ─── Header ─── */}
      <header className={s.headerBlock}>
        <Doodle name="star-5" size={18} className={s.heartTopDeco} />

        <h2 className={s.titleMain}>
          Reasons I Love You
          <span className={s.titleHeart} aria-hidden="true">♡</span>
        </h2>

        <p className={s.subtitle}>A million little reasons…</p>
      </header>

      {/* ─── Scrapbook Elements ─── */}
      {/* Left Side: Sweet Cherries + Handdrawn Tic-Tac-Toe */}
      <img
        src={cherriesExactSvg}
        alt=""
        aria-hidden="true"
        className={s.elemCherries}
      />
      <img
        src={ticTacToeHanddrawnExactSvg}
        alt="Tic Tac Toe with hearts"
        className={s.elemTicTacToe}
      />

      {/* Right Side: Heart Postage Stamp + Balloons + Golden Heart */}
      <img
        src={heartPostageStamp_12_23ExactSvg}
        alt="Postage stamp"
        className={s.elemStamp}
      />
      <img
        src={redHeartBalloonsExactSvg}
        alt=""
        aria-hidden="true"
        className={s.elemBalloons}
      />
      <img
        src={goldenHeartExactSvg}
        alt=""
        aria-hidden="true"
        className={s.elemGoldenHeartMidRight}
      />

      {/* Footer Accent Heart */}
      <img
        src={redHanddrawnHeartExactSvg}
        alt=""
        aria-hidden="true"
        className={s.elemCrayonHeartFooter}
      />

      {/* ─── Star & Sparkle Doodles Constellations ─── */}
      {/* Top zone */}
      <Doodle name="sparkle" size={24} className={[s.doodleSparkle, s.sparkleTopFarLeft].join(" ")} />
      <Doodle name="star-5" size={22} className={[s.doodleStar, s.starTopLeft1].join(" ")} />
      <Doodle name="sparkle" size={18} className={[s.doodleSparkleCrimson, s.sparkleTopLeftNear].join(" ")} />
      <Doodle name="star-outline" size={20} className={[s.doodleStar, s.starTopCenterLeft].join(" ")} />

      <Doodle name="star-outline" size={20} className={[s.doodleStar, s.starTopCenterRight].join(" ")} />
      <Doodle name="sparkle" size={18} className={[s.doodleSparkleCrimson, s.sparkleTopRightNear].join(" ")} />
      <Doodle name="shooting-star" width={52} height={30} className={[s.doodleStar, s.shootingStarTopRight].join(" ")} />
      <Doodle name="star-5" size={24} className={[s.doodleStar, s.starTopFarRight].join(" ")} />

      {/* Left Margin */}
      <Doodle name="star-5" size={24} className={[s.doodleStar, s.starMidLeft1].join(" ")} />
      <Doodle name="sparkle" size={26} className={[s.doodleSparkle, s.sparkleMidLeft1].join(" ")} />
      <Doodle name="star-outline" size={20} className={[s.doodleStar, s.starMidLeft2].join(" ")} />
      <Doodle name="sparkle" size={22} className={[s.doodleSparkleCrimson, s.sparkleMidLeft2].join(" ")} />
      <Doodle name="star-5" size={18} className={[s.doodleStar, s.starLowerLeft].join(" ")} />

      {/* Right Margin */}
      <Doodle name="sparkle" size={28} className={[s.doodleSparkle, s.sparkleMidRight1].join(" ")} />
      <Doodle name="star-5" size={22} className={[s.doodleStar, s.starMidRight1].join(" ")} />
      <Doodle name="sparkle" size={22} className={[s.doodleSparkleCrimson, s.sparkleMidRight2].join(" ")} />
      <Doodle name="star-outline" size={18} className={[s.doodleStar, s.starMidRight2].join(" ")} />
      <Doodle name="star-5" size={20} className={[s.doodleStar, s.starLowerRight].join(" ")} />

      {/* Inter-card Micro Sparkles & Stars */}
      <Doodle name="sparkle" size={16} className={[s.doodleSparkleCrimson, s.sparkleGridCenter].join(" ")} />
      <Doodle name="star-outline" size={15} className={[s.doodleStar, s.starGridTopGap].join(" ")} />
      <Doodle name="sparkle" size={15} className={[s.doodleSparkle, s.sparkleGridBottomGap].join(" ")} />

      {/* Bottom Footer Area */}
      <Doodle name="sparkle" size={20} className={[s.doodleSparkle, s.sparkleFooterLeft].join(" ")} />
      <Doodle name="star-5" size={18} className={[s.doodleStar, s.starFooterRight].join(" ")} />

      {/* ─── 2 × 4 Card Grid ─── */}
      <div className={s.cardsGrid} role="list" aria-label="Reasons I love you">
        {CARDS.map((card) => (
          <article
            key={card.id}
            role="listitem"
            className={[s.noteCard, s[`card${card.id}`]].join(" ")}
          >
            <img
              src={card.svg}
              alt=""
              aria-hidden="true"
              className={s.cardSvg}
            />
          </article>
        ))}
      </div>

      {/* ─── Gypsophila bouquets ─── */}
      <img
        src={tulipBouquetExactSvg}
        alt=""
        aria-hidden="true"
        className={s.flowerLeft}
      />
      <img
        src={tulipBouquetExactSvg}
        alt=""
        aria-hidden="true"
        className={s.flowerRight}
      />

      {/* ─── Footer ─── */}
      <footer className={s.footerBlock}>
        <p className={s.footerSubtitle}>And a thousand more…</p>
      </footer>

      {/* ─── Bottom-right sign-off ─── */}
      <p className={s.footerSignoff} aria-hidden="true">Forever you. ♡</p>
    </section>
  );
}
