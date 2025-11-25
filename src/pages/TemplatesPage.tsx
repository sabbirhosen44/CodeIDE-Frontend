import LoadingSnipper from "@/components/LoadingSnipper";
import Pagination from "@/components/Pagination";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedFrameworks, supportedLanguages } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/store";
import {
  createProjectFromTemplate,
  fetchUserProjects,
} from "@/store/slices/projectSlice";
import { fetchTemplates, setCurrentPage } from "@/store/slices/templateSlice";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFileCode } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TemplatesPage = () => {
  const { templates, isLoading, totalPages, currentPage } = useSelector(
    (state: RootState) => state.template
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { projects } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const showToast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string | undefined>(
    undefined
  );
  const [frameworkFilter, setFrameworkFilter] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(
      fetchTemplates({
        search: searchQuery || undefined,
        language: languageFilter !== "all" ? languageFilter : undefined,
        framework: frameworkFilter !== "all" ? frameworkFilter : undefined,
        page: currentPage,
        limit: 10,
      })
    );
  }, [dispatch, searchQuery, languageFilter, frameworkFilter, currentPage]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserProjects());
    }
  }, [dispatch, isAuthenticated, user]);

  const getProjectLimit = (plan: string) => {
    switch (plan) {
      case "free":
        return 5;
      case "pro":
        return Number.POSITIVE_INFINITY;
      default:
        return 5;
    }
  };

  const canCreateProject = () => {
    if (!user) return false;

    const limit = getProjectLimit(user.plan);
    return projects.length < limit;
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setProjectName(`My ${template.name} Project`);
    setProjectDescription(`Project based on ${template.name} template`);
  };

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectName.trim()) {
      showToast("Please enter a project name", "error");
      return;
    }

    if (!user) {
      navigate("/login");
    }

    setIsCreating(true);

    try {
      const result = await dispatch(
        createProjectFromTemplate({
          templateId: selectedTemplate._id,
          name: projectName.trim(),
          description: projectDescription.trim(),
        })
      );

      if (createProjectFromTemplate.fulfilled.match(result)) {
        const projectId = result.payload._id;
        setSelectedTemplate(null);
        setProjectName("");
        setProjectDescription("");
        navigate(`/editor?project=${projectId}`);
      } else {
        const errorMessage =
          (result.payload as string) || "Failed to create project";
        showToast(`Error: ${errorMessage}`, "error");
      }
    } catch (error: any) {
      showToast(
        `Error: ${error.message || "An unexpected error occurred"}`,
        "error"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setLanguageFilter("all");
    setFrameworkFilter("all");
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
    <div className="container py-8 mx-auto">
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-3xl font-bold mb-2">Templates</h3>
            <p className="text-muted-foreground">
              Browse and use pre-built templates to jumpstart your projects.
            </p>
          </div>
          {user && (
            <h2 className="text-sm text-muted-foreground font-bold">
              Projects: {projects.length}/
              {getProjectLimit(user.plan) === Number.POSITIVE_INFINITY
                ? "∞"
                : getProjectLimit(user.plan)}
            </h2>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Templates..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={languageFilter || "all"}
            onValueChange={(value) => setLanguageFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Languages</SelectItem>
                {supportedLanguages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={frameworkFilter || "all"}
            onValueChange={(value) => setFrameworkFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Frameworks</SelectItem>
                {supportedFrameworks.map((framework) => (
                  <SelectItem key={framework} value={framework}>
                    {framework}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSnipper>{"Loading Templates..."}</LoadingSnipper>
      ) : templates.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {template.language && (
                      <Badge variant="outline">{template.language}</Badge>
                    )}
                    {template.framework && (
                      <Badge variant="outline">{template.framework}</Badge>
                    )}
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-end text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FaFileCode className="size-4 mr-1" />
                      <span>{template.files.length} files</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Pagination
            onHandlePreviousPage={handlePreviousPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onHandleNextPage={handleNextPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <FaFileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter to find what you're looking for
          </p>
          <Button onClick={handleClearFilters}>Clear filters</Button>
        </div>
      )}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project from the "{selectedTemplate?.name}" template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Name
              </Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
                placeholder="Enter project name"
                disabled={isCreating}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectDescription" className="text-right">
                Description
              </Label>
              <Input
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter project description (optional)"
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateProject}
              disabled={!projectName.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;
