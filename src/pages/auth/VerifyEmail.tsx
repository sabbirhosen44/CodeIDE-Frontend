import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store";
import { logout, verifyEmail } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

const VerifyEmailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(verifyEmail({ token: id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !error) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  if (!id) {
    return (
      <div className="container py-12 max-w-md mx-auto px-4">
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <FiAlertCircle className="size-4" />
              <AlertDescription>Invalid verification token.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-md mx-auto px-4">
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>We're verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isLoading && (
            <div className="space-y-4">
              <FiLoader className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Link to="/login" className="text-primary hover:underline">
                Go to login
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <FiCheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email verified successfully!
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard
                </p>
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
