import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white w-full text-black font-roboto-slab flex items-center p-2">
      <div className="flex items-center">
        <img src="/src/assets/logoV1.png" alt="Logo" className="h-12 w-auto mr-4" />
      </div>
      <nav className="text-3xl px-6 hover:text-purple-950">
        <a href="/login">Notely</a>
      </nav>
      <div className="flex-1"></div>
      <div className="h-8 w-px bg-gray-300"></div>
      <div className="flex flex-row pl-6">
        <nav className="relative group text-2xl px-4 hover:text-purple-950 pt-2 transition-all duration-300 ease-in-out">
          <a href="/login" className="relative z-10 text-lg">{t("header.buttons.login")}</a>
          <span
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-950 transition-all duration-300 group-hover:w-full"
          ></span>
        </nav>
        <nav className="text-2xl px-2">
          <a
            href="/register"
            className="rounded-full border-b-purple-950 text-white bg-purple-950 px-6 py-2 hover:bg-purple-900 transition-all duration-300 ease-in-out shadow"
            style={{ display: "inline-block" }}
          >
            {t("header.buttons.register")}
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
