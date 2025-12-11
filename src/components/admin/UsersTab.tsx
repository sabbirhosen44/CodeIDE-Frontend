import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/store";
import {
  deleteUser,
  getuserDetails,
  getUsers,
  setCurrentPage,
} from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../Pagination";
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
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { current } from "@reduxjs/toolkit";

const UsersTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userSearch, setUserSearch] = useState<string>("");
  const { users, currentPage, totalPages, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const showToast = useToast();

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(
          getUsers({ search: userSearch, page: currentPage, limit: 10 })
        ).unwrap();
      } catch (error: any) {
        showToast(`${error}`, "error");
      }
    };
    fetchUsers();
  }, [dispatch, userSearch, currentPage]);

  useEffect(() => {
    if (currentUser) {
      setIsViewDialogOpen(true);
    }
  }, [currentUser]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      await dispatch(
        getUsers({ search: userSearch, page: currentPage, limit: 10 })
      );
      showToast("User deleted successfully", "success");
    } catch (error: any) {
      showToast(error?.message || "Failed to delete user", "error");
    }
  };

  const viewUserProfile = async (userId: string) => {
    try {
      await dispatch(getuserDetails(userId)).unwrap();
    } catch (error: any) {
      showToast(error?.message || "Failed to get user details", "error");
    }
  };

  console.log(currentUser);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <FaSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center mb-2 sm:mb-0">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                        <Badge variant="outline">{user.plan}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewUserProfile(user._id)}
                    >
                      <FaEye className="size-4 mr-1" />
                      View Profile
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 bg-transparent"
                        >
                          <FaTrashAlt className="size-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              onHandlePreviousPage={handlePreviousPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onHandleNextPage={handleNextPage}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{currentUser?.name}</DialogTitle>
            <DialogDescription>{currentUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentUser && (
              <div className="space-y-4">
                {/* User Profile View */}
                {currentUser.email && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={currentUser.avatarUrl || "/placeholder.svg"}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="text-lg">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentUser.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {currentUser.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              currentUser.role === "admin"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {currentUser.role.charAt(0).toUpperCase() +
                              currentUser.role.slice(1)}
                          </Badge>
                          <Badge variant="outline">{currentUser.plan}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Username
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentUser.name || "Not set"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Total Projects
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentUser?.projectCount || 0} projects
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Total Snippets
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentUser?.snippetCount || 0} snippets
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Member Since
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(currentUser.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Plan Type
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentUser.plan.charAt(0).toUpperCase() +
                              currentUser.plan.slice(1)}{" "}
                            Plan
                          </p>
                        </div>
                        {currentUser.lastLogin && (
                          <div>
                            <Label className="text-sm font-medium">
                              Last Login
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(
                                currentUser.lastLogin
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersTab;
