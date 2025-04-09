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
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);

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
          <form action="" className="space-y-6 ">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input type="text" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                type={isShowPassword ? "text" : "password"}
                placeholder="Enter password ..."
              />
              <div
                className="absolute right-4 top-1/2 cursor-pointer"
                onClick={() => setIsShowPassword((prev) => !prev)}
              >
                {isShowPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Input
                type={isShowConfirmPassword ? "text" : "password"}
                placeholder="Enter confirm password ..."
              />
              <div
                className="absolute right-4 top-1/2 cursor-pointer"
                onClick={() => setIsShowConfirmPassword((prev) => !prev)}
              >
                {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <Button asChild className="w-full">
              <Link to="/register">Sign up</Link>
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
