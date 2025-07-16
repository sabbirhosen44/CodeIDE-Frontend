import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <FaHome size={16} />
              Go Home
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link
              to="#"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <FiArrowLeft size={16} />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
