import { AppDispatch, RootState } from "@/store";
import { loadUser, logout } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";
import { FaCodepen } from "react-icons/fa";
import { FiLoader, FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModeToggle from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "Templates", path: "/templates" },
    { name: "Snippets", path: "/snippets" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container h-16 flex justify-between items-center">
        <Link
          to="/"
          className="flex justify-center items-center gap-1 text-xl font-semibold text-primary"
        >
          <FaCodepen className="size-5" />
          <span>CodeIDE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              to={link.path}
              key={link.path}
              className={`font-medium text-sm transition-colors ${link.path === location.pathname ? "text-primary" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {isLoading && <FiLoader className="size-5 animate-spin" />}

          {isAuthenticated && !isLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={"/placeholder.svg?height=32&width=32"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    navigate(user?.role === "admin" ? "/admin" : "/dashboard")
                  }
                >
                  Dashboard
                </DropdownMenuItem>
                {user?.role !== "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isAuthenticated && !isLoading && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")}>Sign Up</Button>
            </div>
          )}

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <FiMenu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <nav className="flex flex-col items-center gap-6">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.path}>
                        <Link
                          to={link.path}
                          className={`font-medium text-sm transition-colors ${link.path === location.pathname ? "text-primary" : ""}`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                    {!isAuthenticated && !isLoading && (
                      <>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            onClick={() => navigate("/login")}
                          >
                            Sign In
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button onClick={() => navigate("/register")}>
                            Sign Up
                          </Button>
                        </SheetClose>
                      </>
                    )}
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
