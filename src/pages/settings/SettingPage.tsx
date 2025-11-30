import LoadingSnipper from "@/components/LoadingSnipper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/store";
import {
  changePassword,
  deleteAccount,
  loadUser,
  logout,
  updateProfile,
} from "@/store/slices/authSlice";
import { ProfileForm } from "@/types";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { passwordFormValues, passwordSchema } from "@/schemas";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SettingPage = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isShowCurrentPassword, setIsShowCurrentPassword] =
    useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: user?.name,
    email: user?.email,
    imageFile: null,
  });
  const [passwordForm, setPasswordForm] = useState<passwordFormValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const showToast = useToast();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      navigate("/admin/settings");
      return;
    }
  }, [isAuthenticated, navigate, isAdmin]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, user, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user?.name,
        email: user?.email,
        imageFile: null,
      });
    }
  }, [user]);

  const profileFormChangeHandler = (field: string, value: any) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };
  const passwordFormChangeHandler = (
    field: keyof passwordFormValues,
    value: string
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveChangesHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name as string);
      formData.append("email", profileForm.email as string);

      if (profileForm.imageFile instanceof File)
        formData.append("imageFile", profileForm.imageFile);

      const result = await dispatch(updateProfile(formData));

      if (updateProfile.fulfilled.match(result)) {
        setProfileForm((prev) => ({ ...prev, imageFile: null }));
        showToast("Profile updated successfully!", "success");
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error: any) {
      setProfileForm((prev) => ({ ...prev, imageFile: null }));
      showToast(
        `Error: ${error.message || "Failed to update profile data"}`,
        "error"
      );
    }
  };

  const updatePasswordHandler = async () => {
    try {
      const validateData = passwordSchema.parse(passwordForm);

      const formData = new FormData();
      formData.append("currentPassword", validateData.currentPassword);
      formData.append("newPassword", validateData.newPassword);

      const result = await dispatch(changePassword(formData));
      if (changePassword.fulfilled.match(result)) {
        showToast("Password update successfully", "success");
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error: any) {
      let errorMessage;
      if (error.errors) {
        errorMessage = error.errors[0].message;
      } else {
        errorMessage = error.message;
      }
      showToast(`${errorMessage} ` || "Failed to updated Password", "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount());
      showToast("Account deleted successfully", "success");
      await dispatch(logout());
      navigate("/login");
    } catch (error: any) {
      showToast(`${error}` || "Failed to delete account", "error");
    }
  };

  if (isLoading) return <LoadingSnipper>Loading Settings...</LoadingSnipper>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex flex-col mb-8">
        <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-8">
              <Avatar className="h-[100px] w-[100px]  rounded-full border border-border">
                <AvatarImage
                  className="object-cover"
                  src={user?.avatarUrl}
                  alt={user?.name}
                />
                <AvatarFallback className="text-2xl">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <Label htmlFor="picture">Change picture</Label>
                <Input
                  type="file"
                  id="picture"
                  className="border border-border"
                  onChange={(e) => {
                    profileFormChangeHandler(
                      "imageFile",
                      e.target.files?.[0] || null
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={profileForm.name}
                  className=" border border-border"
                  onChange={(e) =>
                    profileFormChangeHandler("name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={profileForm.email}
                  className=" border border-border"
                  onChange={(e) =>
                    profileFormChangeHandler("email", e.target.value)
                  }
                />
              </div>
            </div>
            <Button onClick={saveChangesHandler}>Save Changes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Account ID</Label>
                <p>{user?._id}</p>
              </div>
              <div>
                <Label>Account Type</Label>
                <p>
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() +
                      user.role.slice(1).toLowerCase()
                    : "Free"}
                </p>
              </div>
              <div>
                <Label>Current Plan</Label>
                <p>
                  {user?.plan
                    ? user.plan.charAt(0).toUpperCase() +
                      user.plan.slice(1).toLowerCase()
                    : "Free"}
                </p>
              </div>
              <div>
                <Label>Email Verified</Label>
                <p>{user?.isEmailVerified ? "Verified" : "Not Verified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative space-y-2">
                <Label>Current Password</Label>
                <Input
                  type={isShowCurrentPassword ? "text" : "password"}
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("currentPassword", e.target.value)
                  }
                />
                <div
                  className={`absolute right-4 top-1/2   cursor-pointer`}
                  onClick={() => setIsShowCurrentPassword((prev) => !prev)}
                >
                  {isShowCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div className="space-y-2 relative">
                <Label>New Password</Label>
                <Input
                  type={isShowNewPassword ? "text" : "password"}
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("newPassword", e.target.value)
                  }
                />
                <div
                  className={`absolute right-4 top-1/2   cursor-pointer`}
                  onClick={() => setIsShowNewPassword((prev) => !prev)}
                >
                  {isShowNewPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <div className="space-y-2 relative">
                <Label>Confirm New Password</Label>
                <Input
                  type={isShowConfirmPassword ? "text" : "password"}
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("confirmPassword", e.target.value)
                  }
                />
                <div
                  className={`absolute right-4 top-1/2   cursor-pointer`}
                  onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                >
                  {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
            <Button onClick={updatePasswordHandler}>Update Password</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive font-bold">
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible account actions </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive">
                    <FaRegTrashCan />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers
                      including projects, snippets, and templates.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingPage;
