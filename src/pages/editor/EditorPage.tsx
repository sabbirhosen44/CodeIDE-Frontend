import AIAssistant from "@/components/ai/AiAssistant";
import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EDITOR_THEMES, LANGUAGE_MAP } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import type { AppDispatch, RootState } from "@/store";
import { loadUser } from "@/store/slices/authSlice";
import {
  clearCurrentProject,
  fetchProjectById,
  updateProject,
} from "@/store/slices/projectSlice";
import type { EditorSettings, TemplateFile } from "@/types";
import Editor from "@monaco-editor/react";
import { PanelBottomIcon as LuPanelBottom } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiLoader,
  FiMaximize,
  FiMessageSquare,
  FiMinimize,
  FiPlay,
  FiSettings,
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OutputConsole from "../../components/editor/OutputConsole";
import { createSnippet } from "@/store/slices/snippetSlice";

const EditorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const showToast = useToast();
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
  } = useSelector((state: RootState) => state.auth);
  const {
    currentProject,
    isLoading: projectLoading,
    error: projectError,
  } = useSelector((state: RootState) => state.project);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [snippetForm, setSnippetForm] = useState({
    title: "",
    description: "",
    tags: "",
    language: "",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false);
  const [activeFile, setActiveFile] = useState<TemplateFile | null>(null);

  const [editorSettings, setEditorSettings] = useState<EditorSettings>(() => {
    const savedSettings = localStorage.getItem("editorSettings");
    const defaultSettings = {
      theme: "vs-dark",
      fontSize: 14,
      tabSize: 2,
      wordWrap: "on",
      lineNumbers: "on",
      miniMap: { enabled: true },
      autoIndent: "advanced",
      formatOnPaste: true,
      formatOnType: true,
      formatOnSave: false,
      snippetSuggestions: "inline",
      codeLens: true,
      cursorBlinking: "blink",
      cursorStyle: "line",
      cursorWidth: 2,
      fontFamily: "'Consolas', 'Courier New', monospace",
      fontLigatures: false,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontWeight: "normal",
      smoothScrolling: true,
      renderWhitespace: "none",
      bracketPairColorization: { enabled: true },
      autoSave: true,
      detectIndentation: true,
      trimTrailingWhitespace: false,
      insertFinalNewline: false,
    };
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      } catch (error) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    const projectId = searchParams.get("project");
    const token = localStorage.getItem("token");

    if (!projectId || (currentProject && currentProject._id !== projectId)) {
      dispatch(clearCurrentProject());
      setActiveFile(null);
    }

    if (!projectId) {
      navigate("/templates");
      return;
    }

    if (token && !isAuthenticated && !authLoading) {
      dispatch(loadUser());
      return;
    }

    if (!token && !isAuthenticated && !authLoading) {
      navigate("/login");
      return;
    }

    if (user?.role === "admin") {
      navigate("/templates");
      return;
    }

    if (
      isAuthenticated &&
      projectId &&
      !authLoading &&
      (!currentProject || currentProject._id !== projectId)
    ) {
      dispatch(fetchProjectById(projectId));
    }
  }, [
    searchParams.get("project"),
    dispatch,
    navigate,
    isAuthenticated,
    authLoading,
    user,
  ]);

  useEffect(() => {
    if (
      currentProject &&
      currentProject.files &&
      currentProject.files.length > 0
    ) {
      setActiveFile(currentProject.files[0]);
    } else {
      setActiveFile(null);
    }
  }, [currentProject]);

  useEffect(() => {
    if (
      editorSettings.autoSave &&
      activeFile &&
      currentProject &&
      activeFile.content !== undefined
    ) {
      const handler = setTimeout(() => {
        const fileIndex = currentProject.files.findIndex(
          (file) => file.id === activeFile.id
        );

        if (fileIndex !== -1) {
          const updatedFiles = currentProject.files.map((file, idx) =>
            idx === fileIndex ? { ...file, content: activeFile.content } : file
          );

          dispatch(
            updateProject({
              projectId: currentProject._id,
              projectData: { files: updatedFiles },
            })
          );
        }
      }, 3000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [
    activeFile?.content,
    editorSettings.autoSave,
    dispatch,
    activeFile,
    currentProject,
  ]);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode === undefined || !activeFile) return;
    setActiveFile((prev) => {
      if (!prev) return null;
      const updated = { ...prev, content: newCode };
      return updated;
    });
  };

  const handleApplyAICode = (code: string) => {
    if (!activeFile) return;
    setActiveFile((prev) => {
      if (!prev) return null;
      return { ...prev, content: code };
    });
  };

  const handleEditorSettingsChange = (newSettings: Partial<EditorSettings>) => {
    const updatedSettings = { ...editorSettings, ...newSettings };
    setEditorSettings(updatedSettings);
    localStorage.setItem("editorSettings", JSON.stringify(updatedSettings));
  };

  const handleSaveFile = async () => {
    if (!activeFile || !currentProject) {
      return;
    }

    const fileIndex = currentProject.files.findIndex(
      (file) => file.id === activeFile.id
    );

    if (fileIndex === -1) {
      return;
    }

    const updatedFiles = currentProject.files.map((file, idx) =>
      idx === fileIndex ? { ...file, content: activeFile.content } : file
    );

    try {
      const result = await dispatch(
        updateProject({
          projectId: currentProject._id,
          projectData: { files: updatedFiles },
        })
      );
      if (!updateProject.fulfilled.match(result)) {
        throw new Error(result.payload as string);
      }
    } catch (error: any) {}
  };

  const getFileLanguage = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return LANGUAGE_MAP[extension] || "plaintext";
  };

  const handleRun = () => {
    if (!isConsoleVisible) {
      setIsConsoleVisible(true);
    }
    setIsRunning(true);
  };

  const handleRunComplete = () => {
    setIsRunning(false);
  };

  const handleCreateSnippet = async () => {
    if (!activeFile) {
      showToast("No active file selected", "error");
    }

    if (!snippetForm.title.trim()) {
      showToast("Please enter a title for the snippet", "error");
      return;
    }

    try {
      const tagsArray = snippetForm.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      const language =
        snippetForm.language || getFileLanguage(activeFile?.name ?? "");

      const result = await dispatch(
        createSnippet({
          title: snippetForm.title,
          description: snippetForm.description,
          code: activeFile?.content || "",
          tags: tagsArray,
          language,
          author: {
            _id: user?._id || "",
            name: user?.name || "",
            email: user?.email || "",
          },
        })
      );

      if (createSnippet.fulfilled.match(result)) {
        setSnippetForm({
          title: "",
          description: "",
          tags: "",
          language: "",
        });
        setIsSnippetModalOpen(false);
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error: any) {
      console.error("Failed to create snippet:", error.message || error);
    }
  };

  const toggleConsole = () => setIsConsoleVisible(!isConsoleVisible);
  const toggleAIAssistant = () =>
    setIsAIAssistantVisible(!isAIAssistantVisible);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (authLoading || (projectLoading && !currentProject)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FiLoader className="size-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4 text-red-600">Error: {projectError}</p>
          <Button onClick={() => navigate("/templates")}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Project not found</p>
          <Button onClick={() => navigate("/templates")}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-2 flex items-center justify-between bg-background">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="p-2 mr-2"
            onClick={() => navigate("/templates")}
          >
            <FiArrowLeft className="size-4" />
          </Button>
          <h1 className="text-lg font-semibold mr-4">{currentProject.name}</h1>
          <TooltipProvider>
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-8"
                    onClick={toggleConsole}
                  >
                    <LuPanelBottom className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isConsoleVisible ? "Hide console" : "Show console"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`size-8 ${isAIAssistantVisible ? "bg-accent" : ""}`}
                    onClick={toggleAIAssistant}
                  >
                    <FiMessageSquare className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAIAssistantVisible
                    ? "Hide AI Assistant"
                    : "Show AI Assistant"}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSaveFile}>
            Save Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!activeFile) {
                showToast("No active file selected", "error");
                return;
              }
              setSnippetForm({
                ...snippetForm,
                title: activeFile.name.replace(/\.[^/.]+$/, ""),
                language: getFileLanguage(activeFile.name),
              });

              setIsSnippetModalOpen(true);
            }}
            disabled={!activeFile}
          >
            Create Snippet
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FiSettings className="size-3 mr-2" /> Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={editorSettings.theme}
                    onValueChange={(value) =>
                      handleEditorSettingsChange({ theme: value })
                    }
                  >
                    {EDITOR_THEMES.map((theme) => (
                      <DropdownMenuRadioItem
                        key={theme.value}
                        value={theme.value}
                      >
                        {theme.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Font Size</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={editorSettings.fontSize.toString()}
                    onValueChange={(value) =>
                      handleEditorSettingsChange({
                        fontSize: Number.parseInt(value),
                      })
                    }
                  >
                    {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                      <DropdownMenuRadioItem key={size} value={size.toString()}>
                        {size}px
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleEditorSettingsChange({
                    wordWrap: editorSettings.wordWrap === "on" ? "off" : "on",
                  })
                }
              >
                Word Wrap: {editorSettings.wordWrap}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleEditorSettingsChange({
                    miniMap: { enabled: !editorSettings.miniMap.enabled },
                  })
                }
              >
                Minimap: {editorSettings.miniMap.enabled ? "visible" : "hidden"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleEditorSettingsChange({
                    autoSave: !editorSettings.autoSave,
                  })
                }
              >
                Auto Save: {editorSettings.autoSave ? "On" : "Off"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Advanced Settings...
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Advanced Editor Settings</DialogTitle>
                    <DialogDescription>
                      Customize your editor experience with advanced settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                    <EditorSettingsPanel
                      settings={editorSettings}
                      onSettingsChange={handleEditorSettingsChange}
                    />
                  </div>
                  <DialogFooter>
                    <Button>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="default"
            size="sm"
            disabled={isRunning}
            onClick={handleRun}
          >
            {isRunning ? (
              <>
                <FiLoader className="size-4 mr-1 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <FiPlay className="size-4 mr-1" />
                Run
              </>
            )}
          </Button>
          <Button size="sm" variant="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <FiMinimize className="size-4" />
            ) : (
              <FiMaximize className="size-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={isAIAssistantVisible ? 70 : 100}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={30} minSize={20} maxSize={80}>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  <div className="border-b px-4">
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="editor" className="flex-1">
                    {activeFile ? (
                      <Editor
                        height="100%"
                        language={getFileLanguage(activeFile.name)}
                        value={activeFile.content}
                        onChange={handleCodeChange}
                        theme={editorSettings.theme}
                        options={{
                          fontSize: editorSettings.fontSize,
                          fontFamily: editorSettings.fontFamily,
                          fontLigatures: editorSettings.fontLigatures,
                          tabSize: editorSettings.tabSize,
                          insertSpaces: true,
                          wordWrap: editorSettings.wordWrap,
                          lineNumbers: editorSettings.lineNumbers,
                          minimap: editorSettings.miniMap,
                          formatOnPaste: editorSettings.formatOnPaste,
                          formatOnType: editorSettings.formatOnType,
                          cursorStyle: editorSettings.cursorStyle,
                          cursorBlinking: editorSettings.cursorBlinking,
                          renderWhitespace: editorSettings.renderWhitespace,
                          bracketPairColorization:
                            editorSettings.bracketPairColorization,
                          lineHeight: editorSettings.lineHeight,
                          letterSpacing: editorSettings.letterSpacing,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          colorDecorators: true,
                          contextmenu: true,
                          copyWithSyntaxHighlighting: true,
                          detectIndentation: editorSettings.detectIndentation,
                          trimAutoWhitespace:
                            editorSettings.trimTrailingWhitespace,
                          smoothScrolling: true,
                          mouseWheelZoom: true,
                          multiCursorModifier: "ctrlCmd",
                          suggestOnTriggerCharacters: true,
                          acceptSuggestionOnEnter: "on",
                          tabCompletion: "on",
                          wordBasedSuggestions: true,
                          parameterHints: { enabled: true },
                          autoIndent: "advanced",
                          formatOnSave: editorSettings.formatOnSave,
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center">
                          <p className="text-gray-500 mb-2">No file selected</p>
                          <p className="text-sm text-gray-400">
                            Start coding in the editor
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
              {isConsoleVisible && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel
                    defaultSize={30}
                    minSize={20}
                    className="min-h-0"
                  >
                    {" "}
                    {/* Added min-h-0 here */}
                    <div className="h-full flex flex-col">
                      <div className="border-b px-4 py-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Output</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={toggleConsole}
                        >
                          <RxCross2 className="size-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <OutputConsole
                          activeFile={activeFile}
                          isRunning={isRunning}
                          onRunComplete={handleRunComplete}
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
          {isAIAssistantVisible && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <AIAssistant
                  activeFile={activeFile}
                  onClose={toggleAIAssistant}
                  onApplyCode={handleApplyAICode}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      <Dialog open={isSnippetModalOpen} onOpenChange={setIsSnippetModalOpen}>
        <form>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Code Snippet</DialogTitle>
              <DialogDescription>
                Create a reusable code snippet from your current file
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="snippet-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="snippet-title"
                  value={snippetForm.title}
                  onChange={(e) =>
                    setSnippetForm({ ...snippetForm, title: e.target.value })
                  }
                  placeholder="Enter snippet title"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="snippet-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="snippet-description"
                  value={snippetForm.description}
                  onChange={(e) => {
                    setSnippetForm({
                      ...snippetForm,
                      description: e.target.value,
                    });
                  }}
                  placeholder="Enter snippet description"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="snippet-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="snippet-tags"
                  value={snippetForm.tags}
                  onChange={(e) => {
                    setSnippetForm({ ...snippetForm, tags: e.target.value });
                  }}
                  placeholder="Enter tags separated by commas"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSnippetModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="outline" onClick={handleCreateSnippet}>
                Create Snippet
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default EditorPage;
