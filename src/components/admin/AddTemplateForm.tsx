import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  supportedCategories,
  supportedFrameworks,
  supportedLanguages,
} from "@/constants";
import type { AppDispatch, RootState } from "@/store";
import { createTemplate } from "@/store/slices/templateSlice";
import type { TemplateFile } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const templateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Template name must be at least 2 characters" })
    .max(100, { message: "Template name cannot exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
  category: z.enum(supportedCategories, {
    required_error: "Please select a category",
  }),
  language: z.enum(supportedLanguages, {
    required_error: "Please select a language",
  }),
  framework: z.string().optional().nullable(),
  tags: z
    .array(z.string())
    .min(1, { message: "Please add at least one tag" })
    .max(10, { message: "Maximum 10 tags allowed" }),
  fileName: z
    .string()
    .min(1, { message: "File name is required" })
    .regex(/^[a-zA-Z0-9\-_.]+$/, {
      message:
        "File name can only contain letters, numbers, hyphens, underscores, and dots",
    }),
  fileContent: z
    .string()
    .min(1, { message: "File content is required" })
    .max(50000, { message: "File content is too large (max 50KB)" }),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface AddTemplateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddTemplateForm({
  onSuccess,
  onCancel,
}: AddTemplateFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.template
  );

  const [tagInput, setTagInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Frontend",
      language: "JavaScript",
      framework: "",
      tags: [],
      fileName: "main.js",
      fileContent: "",
    },
  });

  const { watch, setValue } = form;
  const watchedTags = watch("tags");
  const watchedFileName = watch("fileName");
  const watchedFileContent = watch("fileContent");

  const handleFileUpload = (file: File) => {
    const validExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".go",
      ".rs",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".html",
      ".css",
      ".sql",
      ".json",
      ".xml",
      ".yaml",
      ".yml",
    ];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      form.setError("fileName", {
        message: "Invalid file type. Please upload a code file.",
      });
      return;
    }

    if (file.size > 50000) {
      form.setError("fileContent", {
        message: "File is too large. Maximum size is 50KB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setValue("fileContent", content);
      setValue("fileName", file.name);
      form.clearErrors(["fileName", "fileContent"]);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (
      trimmedTag &&
      !watchedTags.includes(trimmedTag) &&
      watchedTags.length < 10
    ) {
      setValue("tags", [...watchedTags, trimmedTag]);
      setTagInput("");
      form.clearErrors("tags");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const files: TemplateFile[] = [
        {
          id: `${data.name.toLowerCase().replace(/\s+/g, "-")}-root`,
          name: "root",
          type: "folder",
          isExpanded: false,
          children: [
            {
              id: `${data.name.toLowerCase().replace(/\s+/g, "-")}-${data.fileName.replace(/\./g, "-")}`,
              name: data.fileName,
              type: "file",
              parentId: `${data.name.toLowerCase().replace(/\s+/g, "-")}-root`,
              content: data.fileContent,
            },
          ],
        },
      ];

      const templateData = {
        name: data.name,
        description: data.description,
        category: data.category,
        language: data.language,
        framework:
          data.framework === "None" || !data.framework ? null : data.framework,
        tags: data.tags,
        files,
      };

      const result = await dispatch(createTemplate(templateData as any));

      if (createTemplate.fulfilled.match(result)) {
        onSuccess?.();
        form.reset();
        setTagInput("");
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedLanguages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedFrameworks.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter template description"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear description of what this template does and
                  when to use it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tags</h3>
          <FormField
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Add Tags *</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a tag"
                    disabled={watchedTags.length >= 10}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!tagInput.trim() || watchedTags.length >= 10}
                  >
                    Add Tag
                  </Button>
                </div>
                {watchedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FormDescription>
                  Add relevant tags to help users find your template. Maximum 10
                  tags.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Main File</h3>

          <FormField
            name="fileName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., main.js, index.html, app.py"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="fileContent"
            render={() => (
              <FormItem>
                <FormLabel>File Content *</FormLabel>

                <div
                  className={`flex items-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload
                    className={`h-5 w-5 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <div
                    className={`text-sm ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {isDragOver
                      ? "Drop your code file here"
                      : watchedFileContent
                        ? `File loaded: ${watchedFileName}`
                        : "Click here or drag and drop your code files"}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.html,.css,.sql,.json,.xml,.yaml,.yml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </div>

                <div className="mt-4">
                  <Label>Or paste your code directly:</Label>
                  <Textarea
                    placeholder="Paste your code here..."
                    rows={10}
                    value={watchedFileContent}
                    onChange={(e) => {
                      setValue("fileContent", e.target.value);
                      form.clearErrors("fileContent");
                    }}
                    className="font-mono text-sm mt-2"
                  />
                  <FormDescription>
                    You can either upload a file above or paste your code
                    directly here.
                  </FormDescription>
                </div>

                {watchedFileContent && (
                  <div className="mt-2">
                    <Label>Preview:</Label>
                    <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-32 mt-1">
                      <code>{watchedFileContent.slice(0, 200)}...</code>
                    </pre>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
