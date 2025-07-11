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
import { AppDispatch, RootState } from "@/store";
import { clearError, register as registerUser } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiAlertCircle, FiLoader, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be atleast 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
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

type registerFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<registerFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: registerFormValues) => {
    const { name, email, password } = data;

    const result = await dispatch(registerUser({ name, email, password }));

    if (registerUser.fulfilled.match(result)) {
      setRegistrationSuccess(true);
      reset();
    }
  };

  if (registrationSuccess) {
    return (
      <div className="container py-12 max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We've sent you a verification link
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="mx-auto size-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiMail className="size-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please check your email and click the verification link to
                activate your account.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn't receive the email? Check your spam folder.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/login"
                className="text-primary hover:underline text-sm"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-md mx-auto px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create a CodeIDE account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 flex items-center">
              <FiAlertCircle className="-mt-1 size-4" />
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={isShowPassword ? "text" : "password"}
                placeholder="Enter password ..."
                {...register("password")}
              />
              <div
                className={`absolute right-4 ${errors.password ? "top-[35%]" : "top-1/2"}  cursor-pointer`}
                onClick={() => setIsShowPassword((prev) => !prev)}
              >
                {isShowPassword ? <FaEyeSlash /> : <FaEye />}
              </div>

              {errors.password && (
                <p className="text-sm text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Enter confirm password ..."
                {...register("confirmPassword")}
              />
              <div
                className={`absolute right-4  ${errors.confirmPassword ? "top-[35%]" : "top-1/2"} cursor-pointer`}
                onClick={() => setIsShowConfirmPassword((prev) => !prev)}
              >
                {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FiLoader className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
