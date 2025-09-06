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
import { RootState } from "@/store";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";

const SettingPage = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const profileFormChangeHandler = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };
  const passwordFormChangeHandler = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveChangesHandler = () => {};
  const updatePasswordHandler = () => {};

  if (isLoading)
    return <LoadingSnipper>Loading user profile...</LoadingSnipper>;

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
              <img
                src={
                  "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="profile picture"
                className="h-[100px] w-[100px] object-cover rounded-full border border-border"
              />
              <div className="space-y-2">
                <Label htmlFor="picture">Change picture</Label>
                <Input
                  type="file"
                  id="picture"
                  className="border border-border"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  placeholder=""
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
                  placeholder=""
                  className=" border border-border"
                  onChange={(e) =>
                    profileFormChangeHandler("password", e.target.value)
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
                <p>6872857c7a65c45646e32e03</p>
              </div>
              <div>
                <Label>Account Type</Label>
                <p>user</p>
              </div>
              <div>
                <Label>Current Plan</Label>
                <p>Free</p>
              </div>
              <div>
                <Label>Email Verified</Label>
                <p>Verified</p>
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
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("currentPassword", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("newPassword", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  className=" border border-border"
                  onChange={(e) =>
                    passwordFormChangeHandler("confirmPassword", e.target.value)
                  }
                />
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
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
