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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppDispatch, RootState } from "@/store";
import { fetchUserProjects, updateProject } from "@/store/slices/projectSlice";
import {
  deleteSnippet,
  getUserSnippets,
  updateSnippet,
} from "@/store/slices/snippetSlice";
import { fetchTemplates } from "@/store/slices/templateSlice";
import { Project, Snippet, Template } from "@/types";
import { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaFileCode,
  FaRegClock,
  FaRegStar,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FiActivity, FiMoreHorizontal } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { LuFileSearch2 } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    token,
  } = useSelector((state: RootState) => state.auth);
  const {
    userProjects,
    isLoading: projectLoading,
    error: projectsError,
  } = useSelector((state: RootState) => state.project);
  const { userSnippets, isLoading: snippetLoading } = useSelector(
    (state: RootState) => state.snippet
  );
  const {
    templates,
    isLoading: templateLoading,
    error: templateError,
  } = useSelector((state: RootState) => state.template);
  const [editDialog, setEditDialog] = useState({
    open: false,
    item: null as any,
    type: null as "project" | "snippet" | null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null as any,
    type: null as "project" | "snippet" | null,
  });
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleEdit = (item: Project | Snippet, type: "project" | "snippet") => {
    const name =
      type === "project" ? (item as Project).name : (item as Snippet).title;
    const descriptoin =
      type === "project"
        ? (item as Project).description ?? ""
        : (item as Snippet).description ?? "";
    setNewName(name);
    setNewDescription(descriptoin);

    setEditDialog({ open: true, item, type });
  };

  const confirmEdit = async () => {
    if (newName.trim() === "" || newDescription.trim() === "") {
      setApiErrors((prev) => [...prev, "Name cannot be empty"]);
      return;
    }

    if (!editDialog.item || !editDialog.type) {
      setApiErrors((prev) => [...prev, "Invalid rename operation"]);
      return;
    }

    try {
      if (editDialog.type === "project") {
        await dispatch(
          updateProject({
            projectId: editDialog.item._id,
            projectData: {
              name: newName.trim(),
              description: newDescription.trim(),
            },
          })
        ).unwrap();
      } else if (editDialog.type === "snippet") {
        await dispatch(
          updateSnippet({
            snippetId: editDialog.item._id,
            snippetData: {
              title: newName.trim(),
              description: newDescription.trim(),
            },
          })
        ).unwrap();
      }
    } catch (error: any) {
      let errorMessage = "Failed to edit item";
      if (error.message?.includes("403")) {
        errorMessage = "You don't have permission to edit this item";
      } else if (error.message?.includes("404")) {
        errorMessage = "Item not found";
      } else if (error.message?.includes("401")) {
        errorMessage = "Please log in again";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setApiErrors((prev) => [...prev, errorMessage]);
    } finally {
      setEditDialog({ open: false, item: null, type: null });
      setNewName("");
      setNewDescription("");
    }
  };

  const getTotalLikes = useCallback(() => {
    try {
      return userSnippets.reduce((sum, s) => sum + (s.likeCount || 0), 0);
    } catch (error) {
      return 0;
    }
  }, [userSnippets]);

  const handleDelete = (item: any, type: "project" | "snippet") => {
    setDeleteDialog({ open: true, item, type });
  };

  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === "snippet") {
        await dispatch(deleteSnippet(deleteDialog.item._id)).unwrap();
      }
    } catch (error: any) {
      let errorMessage = "Failed to delete item";
      if (error.message?.includes("403")) {
        errorMessage = "You don't have permission to delete this item";
      } else if (error.message?.includes("404")) {
        errorMessage = "Item not found";
      } else if (error.message?.includes("401")) {
        errorMessage = "Please log in again";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setApiErrors((prev) => [...prev, errorMessage]);
    } finally {
      setDeleteDialog({ open: false, item: null, type: null });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setApiErrors([]);
      try {
        await dispatch(fetchUserProjects({}));
      } catch (error: any) {
        setApiErrors((prev) => [...prev, "Failed to load user Projects"]);
      }

      try {
        await dispatch(getUserSnippets());
      } catch (error: any) {
        setApiErrors((prev) => [...prev, "Failed to load user snippets"]);
      }

      try {
        await dispatch(fetchTemplates({}));
      } catch (error: any) {
        setApiErrors((prev) => [...prev, "Failed to load templates"]);
      }
    };
    fetchData();
  }, [user, isAuthenticated, token, editDialog, deleteDialog, dispatch]);

  if (authLoading || projectLoading || snippetLoading) {
    return <LoadingSnipper>{"Loading your dashboard..."}</LoadingSnipper>;
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-blue-600  bg-clip-text text-transparent">
              {`Welcome back, ${user?.name || "Developer!"}`}
            </h1>
            <p className="text-muted-foreground text-lg">
              Let's build something amazing today
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto h-12">
            <TabsTrigger value="overview" className="gap-2">
              <FiActivity className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FaFileCode className="size-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="snippets" className="gap-2">
              <FaCode className="size-4" />
              Snippets
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium ">
                      Active Projects
                    </CardTitle>
                    <FaFileCode className="size-5 " />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold ">
                    {userProjects.length}
                  </div>
                  <p className="text-xs  mt-1 font-bold">Total projects</p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium ">
                      Code Snippets
                    </CardTitle>
                    <FaCode className="size-5 " />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold ">
                    {userSnippets.length}
                  </div>
                  <p className="text-xs  mt-1 font-bold">
                    Total likes: {getTotalLikes()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <SlCalender className="size-4" />
                      Recent Projects
                    </CardTitle>
                    <CardDescription>
                      Your recently worked on projects
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("projects")}
                  >
                    View All
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProjects.slice(0, 4).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FaFileCode className="size-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">
                            {project.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {project?.templateId?.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FaRegClock className="size-3" />
                              {formatDate(project.lastModified)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(`/editor?project=${project?._id}`);
                          }}
                        >
                          Open
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <FiMoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEdit(project, "project")}
                            >
                              <FaPencil className="size-2 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Templates */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <IoSparkles className="h-5 w-5" />
                      Popular Templates
                    </CardTitle>
                    <CardDescription>
                      Explore available templates
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log("Navigating to templates");
                      navigate("/templates");
                    }}
                  >
                    Browse All
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...templates]
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 6)
                    .map((template: Template) => (
                      <Card
                        key={template._id}
                        className="border hover:border-primary/50 transition-all hover:shadow-md group cursor-pointer"
                        onClick={() => {
                          navigate(`/editor?template=${template._id}`);
                        }}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {template.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{template.language}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {template.downloads} downloads
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                          >
                            Use Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">My Projects</CardTitle>
                    <CardDescription>
                      Manage all your coding projects
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <LuFileSearch2 className="h-10 w-10 mb-3" />
                      <p className="text-lg font-semibold">No Projects Yet</p>
                      <p className="text-sm mt-1">
                        Create your first project to get started.
                      </p>
                    </div>
                  ) : (
                    userProjects.map((project) => (
                      <div
                        key={project._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <FaFileCode className="size-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {project.name}
                            </h4>
                            <p className="text-muted-foreground mb-2">
                              {project.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">
                                {project?.templateId?.language}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <FaRegClock className="size-4" />
                                {formatDate(project.lastModified)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigate(`/editor?project=${project?._id}`);
                            }}
                          >
                            Open Project
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FiMoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEdit(project, "project")}
                              >
                                <FaPencil className="size-4 mr-2 " />
                                Rename
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" disabled>
                  <FaChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {userProjects.length} projects
                </span>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <FaChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Snippets Tab */}
          <TabsContent value="snippets" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">My Code Snippets</CardTitle>
                    <CardDescription>
                      Manage your reusable code snippets
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSnippets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <LuFileSearch2 className="h-10 w-10 mb-3" />
                      <p className="text-lg font-semibold">No Snippets Yet</p>
                      <p className="text-sm mt-1">
                        Start creating your first snippet to see it here.
                      </p>
                    </div>
                  ) : (
                    userSnippets.map((snippet) => (
                      <div
                        key={snippet._id}
                        className="flex flex-col md:flex-row  cursor-pointer md:items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors group"
                      >
                        <div className="mb-4 md:mb-0">
                          <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {snippet.title}
                          </h4>
                          <p className="text-muted-foreground line-clamp-2 mb-2">
                            {snippet.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">
                              {snippet.language}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <FaRegStar className="size-4" />
                              {snippet.likeCount} likes
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <FaFileCode className="size-4" />
                              {snippet.commentCount || 0} comments
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigate(`/snippets/${snippet._id}`);
                            }}
                          >
                            View Snippet
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FiMoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEdit(snippet, "snippet")}
                              >
                                <FaPencil className="size-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDelete(snippet, "snippet")}
                              >
                                <FaRegTrashAlt className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" disabled>
                  <FaChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {userSnippets.length} snippets
                </span>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <FaChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog
          open={editDialog.open}
          onOpenChange={(open) =>
            !open && setEditDialog({ open: false, item: null, type: null })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {editDialog.type === "project" ? "Project" : "Snippet"}
              </DialogTitle>
              <DialogDescription>
                Enter a new data for this {editDialog.type}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                />
              </div>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Description</Label>
                <Input
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter new description"
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setEditDialog({ open: false, item: null, type: null })
                }
              >
                Cancel
              </Button>
              <Button onClick={confirmEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            !open && setDeleteDialog({ open: false, item: null, type: null })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your {deleteDialog.type} "
                {deleteDialog.type === "project"
                  ? deleteDialog.item?.name
                  : deleteDialog.item?.title}
                ". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() =>
                  setDeleteDialog({ open: false, item: null, type: null })
                }
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DashboardPage;
