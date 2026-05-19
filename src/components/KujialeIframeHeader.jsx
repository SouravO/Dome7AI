import { LanguageSwitcher } from "./GoogleTranslate";

/** Language switcher overlay for Kujiale iframe pages (top-left, no logo / bar bg). */
const KujialeIframeHeader = ({ reloadOnChange = false }) => {
  return (
    <div
      className="fixed top-0 left-[calc(0.525rem+3*3.25rem)] z-[70] py-[0.525rem] pr-[0.525rem] sm:left-[calc(0.7rem+3*3.25rem)] sm:py-[0.7rem] sm:pr-[0.7rem] pointer-events-auto"
      aria-label="Language"
    >
      <LanguageSwitcher reloadOnChange={reloadOnChange} compact />
    </div>
  );
};

export default KujialeIframeHeader;
