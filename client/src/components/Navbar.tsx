import { Link, useNavigate } from "react-router-dom";
import { navLinks } from "./constants";
import { FaCodepen } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
      <div className="container h-20 flex justify-between ">
        <Link
          to="/"
          className="flex justify-center items-center gap-1 font-semibold text-primary"
        >
          <FaCodepen className="size-5 " />
          <span className="hidden md:inline-block">Code IDE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            return (
              <Link
                to={link.path}
                key={link.path}
                className={`font-medium text-sm transition-colors ${link.path === location.pathname ? "text-primary" : ""}`}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
