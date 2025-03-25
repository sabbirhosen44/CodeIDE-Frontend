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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TEMPLATES } from "@/mockdata";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFileCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TemplatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [frameworkFilter, setFrameworkFilter] = useState("all");
  const navigate = useNavigate();

  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      template.description
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );

    const matchesLanguage =
      languageFilter === "all" || template.language === languageFilter;

    const matchesFramework =
      frameworkFilter === "all" || template.framework === frameworkFilter;

    return matchesSearch && matchesLanguage && matchesFramework;
  });

  const handleUseTemplate = (templateId: number) => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col  mb-6">
        <h3 className="text-3xl font-bold mb-2">Templates</h3>
        <p className="text-muted-foreground">
          Browse and use pre-built templates to jumpstart your projects.
        </p>
      </div>

      {/* Search & Templates */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search Templates..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            defaultValue="all"
            onValueChange={(value) => {
              setLanguageFilter(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Language</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
                <SelectItem value="Typescript">Typescript</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="PHP">PHP</SelectItem>
                <SelectItem value="C#">C#</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            defaultValue="all"
            onValueChange={(value) => setFrameworkFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Next.js">Next.js</SelectItem>
              <SelectItem value="Vue">Vue</SelectItem>
              <SelectItem value="Express">Express</SelectItem>
              <SelectItem value="Django">Django</SelectItem>
              <SelectItem value="Mern">Mern</SelectItem>
              <SelectItem value="Laravel">Laravel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
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
                  <Badge variant="outline">{template.language}</Badge>
                  <Badge variant="outline">{template.framework}</Badge>
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
                  onClick={() => handleUseTemplate(template._id)}
                  className="w-full"
                >
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaFileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter to find what you're looking for
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
