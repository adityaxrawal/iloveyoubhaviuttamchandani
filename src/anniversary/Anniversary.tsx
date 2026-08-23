import { useEffect, useState, type ComponentType } from "react";
/* Order follows the mockups: the anniversary hero opens the page, the night
   we met follows it. Both files keep their original names. */
import S1Anniversary from "./sections/S1Anniversary";
import S2NightWeMet from "./sections/S2NightWeMet";
import S3Timeline from "./sections/S3Timeline";
import S4Memories from "./sections/S4Memories";
import S5Reasons from "./sections/S5Reasons";
import S6Letter from "./sections/S6Letter";
import S7Future from "./sections/S7Future";
import s from "./anniversary.module.css";

export default function Anniversary() {
  /* /anniversary?edit replaces the page with the drag-to-place editor, which
     renders the real page inside a device-sized iframe. Dynamic import, so
     the production bundle never sees it. */
  const editing =
    import.meta.env.DEV && new URLSearchParams(location.search).has("edit");
  const [Editor, setEditor] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (!editing) return;
    document.documentElement.classList.add("am-editing");
    void import("./dev/LayoutEditor").then((m) => setEditor(() => m.default));
    return () => document.documentElement.classList.remove("am-editing");
  }, [editing]);

  // Desktop scroll-snap + the wine backdrop live on <html>, so overscroll
  // doesn't flash the app's global black. Both come off on unmount.
  useEffect(() => {
    document.documentElement.classList.add("am-active");
    const prevTitle = document.title;
    document.title = "Happy 1 Year Anniversary";
    return () => {
      document.documentElement.classList.remove("am-active");
      document.title = prevTitle;
    };
  }, []);

  // The editor owns the window; the page it edits lives in its iframe.
  if (editing) return Editor ? <Editor /> : null;

  return (
    <main className={s.page}>
      <S1Anniversary />
      <S2NightWeMet />
      <S3Timeline />
      <S4Memories />
      <S5Reasons />
      <S6Letter />
      <S7Future />
    </main>
  );
}
