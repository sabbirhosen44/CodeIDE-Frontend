import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileCode,
  Code2,
  Clock,
  Star,
  ArrowRight,
  MoreHorizontal,
  Pencil,
  Trash,
  Sparkles,
  Calendar,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Mock data
const mockProjects = [
  {
    _id: "1",
    name: "Project Alpha",
    description: "A full-stack e-commerce application with React and Node.js",
    language: "JavaScript",
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    name: "Project Beta",
    description: "Real-time weather app using OpenWeather API",
    language: "TypeScript",
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    name: "Project Gamma",
    description: "Simple task management application with drag and drop",
    language: "React",
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "4",
    name: "Project Delta",
    description: "Personal portfolio with modern design",
    language: "HTML/CSS",
    lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockSnippets = [
  {
    _id: "1",
    title: "Snippet One",
    description: "A reusable custom hook for fetching data with loading states",
    language: "TypeScript",
    likeCount: 42,
    commentCount: 8,
  },
  {
    _id: "2",
    title: "Snippet Two",
    description: "Smooth fade-in animation with keyframes",
    language: "CSS",
    likeCount: 28,
    commentCount: 5,
  },
  {
    _id: "3",
    title: "Snippet Three",
    description: "Utility function for making authenticated API calls",
    language: "JavaScript",
    likeCount: 35,
    commentCount: 12,
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [renameDialog, setRenameDialog] = useState({
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleRename = (item: any, type: "project" | "snippet") => {
    const name = type === "project" ? item.name : item.title;
    setNewName(name);
    setRenameDialog({ open: true, item, type });
  };

  const confirmRename = () => {
    console.log("Renaming", renameDialog.type, "to", newName);
    setRenameDialog({ open: false, item: null, type: null });
    setNewName("");
  };

  const handleDelete = (item: any, type: "project" | "snippet") => {
    setDeleteDialog({ open: true, item, type });
  };

  const confirmDelete = () => {
    console.log("Deleting", deleteDialog.type, deleteDialog.item);
    setDeleteDialog({ open: false, item: null, type: null });
  };

  const getTotalLikes = () => {
    return mockSnippets.reduce((sum, s) => sum + s.likeCount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, Developer!
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
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FileCode className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="snippets" className="gap-2">
              <Code2 className="h-4 w-4" />
              Snippets
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Active Projects
                    </CardTitle>
                    <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {mockProjects.length}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Total projects
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                      Code Snippets
                    </CardTitle>
                    <Code2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {mockSnippets.length}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
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
                      <Calendar className="h-5 w-5" />
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProjects.slice(0, 4).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FileCode className="h-6 w-6 text-primary" />
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
                              {project.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(project.lastModified)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm">
                          Open
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRename(project, "project")}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(project, "project")}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
                  {mockProjects.map((project) => (
                    <div
                      key={project._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <FileCode className="h-6 w-6 text-primary" />
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
                              {project.language}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDate(project.lastModified)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">Open Project</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRename(project, "project")}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(project, "project")}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" disabled>
                  <FaChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {mockProjects.length} projects
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
                  {mockSnippets.map((snippet) => (
                    <div
                      key={snippet._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {snippet.title}
                        </h4>
                        <p className="text-muted-foreground line-clamp-2 mb-2">
                          {snippet.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{snippet.language}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {snippet.likeCount} likes
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Code2 className="h-4 w-4" />
                            {snippet.commentCount} comments
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">View Snippet</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRename(snippet, "snippet")}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(snippet, "snippet")}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" disabled>
                  <FaChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {mockSnippets.length} snippets
                </span>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <FaChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rename Dialog */}
        <Dialog
          open={renameDialog.open}
          onOpenChange={(open) =>
            !open && setRenameDialog({ open: false, item: null, type: null })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Rename {renameDialog.type === "project" ? "Project" : "Snippet"}
              </DialogTitle>
              <DialogDescription>
                Enter a new name for this {renameDialog.type}.
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
                  onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setRenameDialog({ open: false, item: null, type: null })
                }
              >
                Cancel
              </Button>
              <Button onClick={confirmRename} disabled={!newName.trim()}>
                Save Changes
              </Button>
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
