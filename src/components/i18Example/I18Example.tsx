import i18next from "i18next";
import { useTranslation } from "react-i18next";

function I18Example() {
  const { t } = useTranslation();

  const handleLangChange = () => {
    /**
     * you can below code in Root component to change the application language based on user preference. 
     * const { , i18n } = useTranslation();

       useEffect(() => {
         const lng = navigator.language;
         i18n.changeLanguage(lng);
       }, [i18]);
     */

    const getLanguage = localStorage.getItem("language");
    if (getLanguage === "fr") {
      i18next.changeLanguage("en");
    } else {
      i18next.changeLanguage("fr");
    }
  };

  const lng = navigator.language;

  return (
    <div className="nav">
      <div>Browser language : {lng}</div>
      <h1>{t("hey_how're_you_doing?")}</h1>
      <button onClick={handleLangChange}>Change Language</button>
    </div>
  );
}

export default I18Example;
