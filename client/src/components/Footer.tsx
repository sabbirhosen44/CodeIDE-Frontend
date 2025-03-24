import { FaCodepen, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-1 font-semibold text-primary text-xl"
            >
              <FaCodepen className="size-5 " />
              <span>CodeIDE</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A powerful cloud-based IDE for developers to code, collaborate,
              and create amazing projects.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FaGithub className="size-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FaTwitter className="size-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <FaLinkedin className="size-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/features"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/templates"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/snippets"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Snippets
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/docs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Documentaion
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className=" border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground ">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Cloud IDE. All rights reserved.
          </p>
          <div className=" flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className=" hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className=" hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/cookies" className=" hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
