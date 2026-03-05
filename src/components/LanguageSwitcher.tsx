import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CloudFog, FlagIcon, Globe, Loader2 } from "lucide-react";
import { useGetLanguagesQuery } from "@/store/api/i18nApi";

const FALLBACK_LANGUAGES = [
  {
    code: "en",
    name: "English",
    native_name: "English",
    flag: "🇺🇸",
    is_default: true,
  },
  {
    code: "es",
    name: "Spanish",
    native_name: "Español",
    flag: "🇪🇸",
    is_default: false,
  },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { data, isLoading } = useGetLanguagesQuery();
  const languages = data?.languages?.length
    ? data.languages
    : FALLBACK_LANGUAGES;

  const currentCode = i18n.language?.split("-")[0] || "en";
  const currentLang =
    languages.find((l) => l.code === currentCode) ?? languages[0];
  console.log({ currentLang, i18n });
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    try {
      localStorage.setItem("language", language);
    } catch {
      console.warn("Could not save language preference");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 bg-gray-100">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-lg">{currentLang?.flag}</span>
          )}
          <span className="">
            {isLoading
              ? currentCode
              : `${currentLang?.name} (${currentLang?.code?.toUpperCase()})`}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.flag} {lang.native_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
