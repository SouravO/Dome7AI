import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    if (window.google?.translate) return;

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,ta,te,ml",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_hidden" style={{ display: "none" }} />;
};

export default GoogleTranslate;

const languages = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "ml", label: "ML" },
  { code: "te", label: "TE" },
];

const changeLanguage = (lang) => {
  const select = document.querySelector("select.goog-te-combo");
  if (!select) return;

  select.value = lang;
  select.dispatchEvent(new Event("change"));
};

export const LanguageSwitcher = () => {
  return (
    <div style={styles.wrapper}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={styles.button}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    background: "#111",
    borderRadius: "20px",
  },
  button: {
    padding: "6px 12px",
    borderRadius: "14px",
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  },
};

