import { navLinks } from "@/constants";
import { FaCodepen } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur ">
      <div className="container h-16 flex justify-between items-center ">
        <Link
          to="/"
          className="flex justify-center items-center gap-1 text-xl font-semibold text-primary"
        >
          <FaCodepen className="size-5 " />
          <span>CodeIDE</span>
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

        <div className="flex items-center gap-4 ">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/register")}>Sign Up</Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild aria-label="Toggle Menu">
                <Button variant="ghost">
                  <FiMenu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <nav className="flex flex-col items-center gap-6">
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
                    <Button variant="ghost" onClick={() => navigate("/login")}>
                      Sign In
                    </Button>
                    <Button onClick={() => navigate("/register")}>
                      Sign Up
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
