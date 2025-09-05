import Button from '../components/button'
export const Header = () => {
  return (
    <header className="bg-primary w-full text-black font-roboto-slab flex p-2">
      <h1 className="text-3xl px-6 hover:text-orange-200">
        <a href="/">Notely</a>
      </h1>
      <h2 className="text-2xl px-6 p-1 hover:text-orange-200">
        <a href="/registration">Sign up</a>
      </h2>
      <h3 className="text-2xl px-6 p-1 hover:text-orange-200">
        <a href="/login">Login</a>
      </h3>
    </header>
  );
};

export default Header;