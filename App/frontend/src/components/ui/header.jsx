import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-secondary w-full text-black font-roboto-slab flex justify-between items-center p-2">
      <h1 className="text-3xl px-6 hover:text-purple-600">
        <a href="/login">Notely</a>
      </h1>
      <h2 className="text-2xl px-6 hover:text-purple-600">
        <a href="/register">Sign up</a>
      </h2>
      <h3 className="text-2xl px-6 hover:text-purple-600">
        <a href="/login">Login</a>

      </h3>

      <div className="flex-1 flex justify-center px-6"> {/* Right side of the header */}

      </div>
    </header>
  );
};

export default Header;