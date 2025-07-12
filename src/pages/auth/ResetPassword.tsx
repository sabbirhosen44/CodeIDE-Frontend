import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppDispatch, RootState } from "@/store";
import { clearError, logout, resetPassword } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must include atleast one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must include atleast one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must include atleast one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must include atleast one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout());
    }
  }, [isAuthenticated, dispatch]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!id) return;
    const { password } = data;
    await dispatch(resetPassword({ token: id, password }));

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  if (!id) {
    return (
      <div className="container py-12 max-w-md mx-auto px-4">
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <FiAlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid reset token. Please request a new password reset.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-md mx-auto px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <FiAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type={isShowPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter new password..."
              />
              <div
                className={`absolute right-4 ${errors.password ? "top-[35%]" : "top-1/2"} cursor-pointer`}
                onClick={() => setIsShowPassword((prev) => !prev)}
              >
                {isShowPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={isShowConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm new password..."
              />
              <div
                className={`absolute right-4 ${errors.confirmPassword ? "top-[35%]" : "top-1/2"} cursor-pointer`}
                onClick={() => setIsShowConfirmPassword((prev) => !prev)}
              >
                {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FiLoader className="mr-2 size-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
