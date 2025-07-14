import AddTemplateForm from "@/components/admin/AddTemplateForm";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppDispatch, RootState } from "@/store";
import { getAdminStats } from "@/store/slices/adminSlice";
import {
  clearError,
  deleteTemplate,
  fetchTemplates,
  setCurrentPage,
} from "@/store/slices/templateSlice";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCode,
  FaEye,
  FaFileAlt,
  FaLayerGroup,
  FaPlus,
  FaSearch,
  FaTachometerAlt,
  FaTrashAlt,
  FaUserCircle,
} from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    templates,
    isLoading: templatesLoading,
    error: templatesError,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.template);
  const { stats: adminStats, isLoading: adminStatsLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const [templateSearch, setTemplateSearch] = useState("");
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    dispatch(getAdminStats());
    if (activeTab === "templates") {
      dispatch(clearError());
      dispatch(
        fetchTemplates({
          page: currentPage,
          limit: 10,
          search: templateSearch || undefined,
        })
      );
    }
  }, [dispatch, activeTab, currentPage, templateSearch]);

  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", activeTab);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleTemplateSuccess = () => {
    setIsAddTemplateOpen(false);
    dispatch(setCurrentPage(1));
    dispatch(
      fetchTemplates({
        page: 1,
        limit: 10,
        search: templateSearch,
      })
    );
    setStatusMessage({
      type: "success",
      message: "Template created successfully",
    });
  };

  const viewTemplate = (template: any) => {
    console.log("Selected template:", template);
    setSelectedItem(template);
    setIsViewDialogOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await dispatch(deleteTemplate(templateId)).unwrap();
      setStatusMessage({
        type: "success",
        message: "Template deleted successfully",
      });
      dispatch(
        fetchTemplates({
          page: currentPage,
          limit: 10,
          search: templateSearch,
        })
      );
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        message: error || "Failed to delete template",
      });
    }
  };

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

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage templates</p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <FaCheckCircle className="size-5" />
          ) : (
            <FiXCircle className="size-5" />
          )}
          <span>{statusMessage.message}</span>
        </div>
      )}

      {templatesError && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 border border-red-200 flex items-center gap-2">
          <FiXCircle className="size-5" />
          <span>{templatesError}</span>
          <Button
            variant="link"
            className="ml-4"
            onClick={() => dispatch(clearError())}
          >
            Clear Error
          </Button>
        </div>
      )}

      <div className="mb-8 bg-card rounded-lg border shadow-sm">
        <div className="flex flex-wrap">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-4 ${
              activeTab === "overview"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FaTachometerAlt className="mr-2 size-5" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-4 ${
              activeTab === "users"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUserCircle className="mr-2 size-5" />
            Users
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-4 ${
              activeTab === "templates"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setActiveTab("templates")}
          >
            <FaFileAlt className="mr-2 size-5" />
            Templates
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-4 ${
              activeTab === "snippets"
                ? "bg-primary/10 border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setActiveTab("snippets")}
          >
            <FaCode className="mr-2 size-5" />
            Snippets
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FaUserCircle className="size-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">
                      {adminStatsLoading ? "..." : adminStats?.totalUsers || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FaLayerGroup className="size-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">
                      {adminStatsLoading
                        ? "..."
                        : adminStats?.totalProjects || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Templates & Snippets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <FaCode className="size-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">
                      {adminStatsLoading
                        ? "..."
                        : (adminStats?.totalTemplates || 0) +
                          (adminStats?.totalSnippets || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={adminStats?.userGrowth || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Growth</CardTitle>
                  <CardDescription>Monthly project creation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={adminStats?.projectGrowth || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="projects" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Under Construction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">
                  User management functionality is currently under construction.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "templates" && (
          <div>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Template Management</CardTitle>
                    <CardDescription>
                      Manage all platform templates
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <FaSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        className="pl-8 w-full sm:w-[200px]"
                        value={templateSearch}
                        onChange={(e) => {
                          setTemplateSearch(e.target.value);
                          dispatch(setCurrentPage(1));
                        }}
                      />
                    </div>
                    <Dialog
                      open={isAddTemplateOpen}
                      onOpenChange={setIsAddTemplateOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <FaPlus className="size-4 mr-2" />
                          Add Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Template</DialogTitle>
                          <DialogDescription>
                            Create a new code template for the platform
                          </DialogDescription>
                        </DialogHeader>
                        <AddTemplateForm
                          onSuccess={handleTemplateSuccess}
                          onCancel={() => setIsAddTemplateOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <div className="text-center py-8">Loading templates...</div>
                ) : templates.length > 0 ? (
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md"
                      >
                        <div className="mb-4 sm:mb-0">
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline">{template.language}</Badge>
                            {template.framework && (
                              <Badge variant="outline">
                                {template.framework}
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {template.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {template.downloads} downloads
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewTemplate(template)}
                          >
                            <FaEye className="size-4 mr-1" />
                            View
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
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the template.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteTemplate(template._id)
                                  }
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-6">
                      <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || templatesLoading}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={handleNextPage}
                        disabled={
                          currentPage === totalPages || templatesLoading
                        }
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaFileAlt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No templates found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search to find what you're looking for
                    </p>
                    <Button
                      onClick={() => {
                        setTemplateSearch("");
                        dispatch(setCurrentPage(1));
                        dispatch(clearError());
                      }}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "snippets" && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Snippet Management</CardTitle>
                <CardDescription>Under Construction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground">
                    Snippet management functionality is currently under
                    construction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.name || selectedItem?.title || "Template Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description || "No description available"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Language</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.language || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Framework</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.framework || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Downloads</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.downloads || 0}
                    </p>
                  </div>
                </div>

                {selectedItem.files && selectedItem.files.length > 0 ? (
                  <div>
                    <Label>Files</Label>
                    <div className="space-y-2 mt-2">
                      {selectedItem.files.map((file: any, index: number) => (
                        <div
                          key={file._id || index}
                          className="border rounded p-3"
                        >
                          <p className="font-medium">
                            {file.name || "Unnamed File"}
                          </p>
                          {file.content ? (
                            <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-64 mt-2 whitespace-pre-wrap">
                              <code>{file.content}</code>
                            </pre>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              No content available for this file
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No files available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No template selected
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
