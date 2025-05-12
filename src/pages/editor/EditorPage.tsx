import EditorSettingsPanel from "@/components/editor/EditorSettingsPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EDITOR_THEMES } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegSave } from "react-icons/fa";
import {
  FiArrowLeft,
  FiLoader,
  FiMaximize,
  FiMinimize,
  FiPlay,
  FiPlus,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import {
  LuPanelBottom,
  LuPanelLeft,
  LuPanelRight,
  LuSquareTerminal,
} from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileExplorer from "./FileExplorer";
import { MOCK_TEMPLATES } from "@/mockdata";
import { EditorSettings } from "@/types";
import OutputConsole from "./OutputConsole";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const EditorPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFileExplorerVisible, setIsFileExplorerVisible] = useState(true);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    theme: "vs-dark",
    fontSize: 14,
    tabSize: 2,
    wordWrap: "on",
    lineNumbers: "on",
    miniMap: {
      enabled: true,
    },
    autoIndent: "advanced",
    formatOnPaste: true,
    formatOnType: true,
    snippetSuggestions: "inline",
    codeLens: true,
    cursorBlinking: "blink",
    cursorStyle: "line",
    cursorWidth: 2,
    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
    fontLigatures: false,
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: "normal",
    smoothScrolling: true,
    renderWhiteSpace: "none",
    bracketPairColorization: { enabled: true },
  });
  const showToast = useToast();
  const navigate = useNavigate();

  // Mock collaborators with more detailed status
  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      role: "editor",
      cursor: { line: 10, column: 15 },
      lastActive: "Just now",
    },
    {
      id: 2,
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "idle",
      role: "viewer",
      cursor: { line: 5, column: 8 },
      lastActive: "5 minutes ago",
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast(
        "Authentication required. Please log in to use the editor.",
        "error"
      );

      navigate("/login");
    }

    const templateId = searchParams.get("template");
    if (templateId) {
      const template = MOCK_TEMPLATES.find((t) => t._id === templateId);

      if (template) {
        setCurrentTemplate(template);
        setActiveFile(template.files[0]);
      }
    }
  }, [searchParams]);

  const toggleFileExplorer = () => {
    setIsFileExplorerVisible(!isFileExplorerVisible);
  };

  const toggleConsole = () => {
    setIsConsoleVisible(!isConsoleVisible);
  };

  const toggleTerminal = () => {
    setIsTerminalVisible(!isTerminalVisible);
  };

  const removeCollaborator = (id: number) => {
    setCollaborators(collaborators.filter((item) => item.id !== id));
    showToast("Collaborator removed", "success");
  };

  const addCollaborator = (name: string, role: string) => {
    const newCollaborator = {
      id: collaborators.length + 1,
      name,
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      role,
      cursor: { line: 1, column: 1 },
      lastActive: "Just now",
    };

    setCollaborators([...collaborators, newCollaborator]);
    showToast(`${name} added as a collaborator`, "success");
  };

  const handleRun = () => {
    setIsRunning(true);
  };

  const handlePreview = () => {
    setActiveTab("preview");

    showToast("Preview generated successfully", "success");
  };

  const handleSave = () => {
    showToast("Project saved successfully", "success");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        showToast(
          `Error attempting to enable fullscreen : ${err.message}`,
          "error"
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="px-4 flex flex-col">
      <div className="border-b p-2 flex items-center justify-between bg-background">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="p-2 mr-2"
            onClick={() => navigate("/templates")}
          >
            <FiArrowLeft className=" size-4" />
          </Button>
          <h1 className="text-lg font-semibold mr-4">
            {currentTemplate ? currentTemplate.name : "New Project"}
          </h1>
          <TooltipProvider>
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-8"
                    onClick={toggleFileExplorer}
                  >
                    {isFileExplorerVisible ? (
                      <LuPanelLeft className="size-4" />
                    ) : (
                      <LuPanelRight className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFileExplorerVisible ? "Hide explorer" : "Show explorer"}
                </TooltipContent>
              </Tooltip>

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
                    size="icon"
                    onClick={toggleTerminal}
                    className="size-8"
                  >
                    <LuSquareTerminal className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isTerminalVisible ? "Hide terminal" : "Show terminal"}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" className="gap-2">
                <FiUsers className="size-4" />
                <span>Collaborators</span>
                <Badge variant="secondary" className="ml-1">
                  {collaborators.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Collaborators</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {collaborators.map((collaborator) => (
                <DropdownMenuItem
                  key={collaborator.id}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={collaborator.avatar}
                        alt={collaborator.name}
                      />
                      <AvatarFallback>
                        {collaborator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-background ${
                        collaborator.status === "active"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{collaborator.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-1 px-1 py-0  h-4">
                        {collaborator.role}
                      </Badge>
                      <span>{collaborator.lastActive}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="size-6 ml-auto"
                    onClick={() => removeCollaborator(collaborator.id)}
                  >
                    <RxCross2 className="size-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start p-2 h-auto font-normal text-sm"
                  >
                    <FiPlus className="size-3 mr-2" />
                    Invite Collaborator
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invite Collaborator</DialogTitle>
                    <DialogDescription>
                      Add a new collaborator to your project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="Enter email"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Editor</SelectLabel>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="commenter">Commenter</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        addCollaborator("Alex", "editor");
                      }}
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Editor Settings */}
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
                <DropdownMenuSubTrigger>
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup>
                    {EDITOR_THEMES.map((theme) => (
                      <DropdownMenuRadioItem
                        key={theme.value}
                        value={theme.value}
                      >
                        {theme.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Font Size</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup>
                    {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                      <DropdownMenuRadioItem key={size} value={size.toString()}>
                        {size}px
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Tab Size</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem value="2">
                      2 spaces
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="4">
                      4 spaces
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="8">
                      8 spaces
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Font Family</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem value="Menlo, Monaco, 'Courier New', monospace">
                      Monospace
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="'Fira Code', monospace">
                      Fira Code
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="'Source Code Pro', monospace">
                      Source Code Pro
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="'JetBrains Mono', monospace">
                      JetBrains Mono
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="'Cascadia Code', monospace">
                      Cascadia Code
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem>word wrap : 1</DropdownMenuItem>

              <DropdownMenuItem>Minimap: visible</DropdownMenuItem>

              <DropdownMenuItem>Line Numbers: off</DropdownMenuItem>

              <DropdownMenuItem>
                Bracket Pair Colorization: off
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
                    <EditorSettingsPanel />
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

          <Button size="sm" variant="outline" onClick={handlePreview}>
            <FaRegEye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button size="sm" variant="outline" onClick={handleSave}>
            <FaRegSave className="h-4 w-4 mr-2" />
            Save
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

      {/* Editor Layout */}
      <div className="flex h-screen overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {isFileExplorerVisible && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full border-r">
                  <FileExplorer />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={isFileExplorerVisible ? 60 : 80}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={isConsoleVisible || isTerminalVisible ? 70 : 100}
              >
                <Tabs defaultValue="editor" className="h-full flex flex-col">
                  <div className="border-b px-4">
                    <TabsList>
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="editor" className="flex-1">
                    {activeFile && (
                      <Editor
                        height="100%"
                        language={
                          activeFile.name.split(".").pop() || "javascript"
                        }
                        value={activeFile.content}
                        theme={editorSettings.theme}
                        options={{
                          fontSize: editorSettings.fontSize,
                          fontFamily: editorSettings.fontFamily,
                          lineHeight: editorSettings.lineHeight,
                          letterSpacing: editorSettings.letterSpacing,
                          tabSize: editorSettings.tabSize,
                          wordWrap: editorSettings.wordWrap,
                          minimap: editorSettings.miniMap,
                          lineNumbers: editorSettings.lineNumbers,
                          formatOnPaste: editorSettings.formatOnPaste,
                          formatOnType: editorSettings.formatOnType,
                          autoIndent: editorSettings.autoIndent
                            ? "advanced"
                            : "none",
                          codeLens: editorSettings.codeLens,
                          cursorBlinking: editorSettings.cursorBlinking,
                          cursorStyle: editorSettings.cursorStyle,
                          cursorWidth: editorSettings.cursorWidth,
                          fontLigatures: editorSettings.fontLigatures,
                          fontWeight: editorSettings.fontWeight,
                          renderWhitespace: editorSettings.renderWhiteSpace,
                          smoothScrolling: editorSettings.smoothScrolling,
                          bracketPairColorization:
                            editorSettings.bracketPairColorization,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="flex-1">
                    <iframe
                      src="https//:localhost:8000"
                      className="w-full h-full border-0"
                      title="preview"
                    />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
              {(isConsoleVisible || isTerminalVisible) && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={30}>
                    <Tabs
                      defaultValue="console"
                      className="h-full flex flex-col"
                    >
                      <div className="border-b px-4 flex items-center">
                        <TabsList>
                          {isConsoleVisible && (
                            <TabsTrigger value="console">Output</TabsTrigger>
                          )}
                          {isTerminalVisible && (
                            <TabsTrigger value="terminal">Terminal</TabsTrigger>
                          )}
                        </TabsList>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => {
                            if (isConsoleVisible && isTerminalVisible) {
                              setIsConsoleVisible(false);
                              setIsTerminalVisible(false);
                            }
                          }}
                        >
                          <RxCross2 className="size-4" />
                        </Button>
                      </div>
                      <TabsContent value="console" className="flex-1">
                        <OutputConsole />
                      </TabsContent>
                      {isTerminalVisible && (
                        <TabsContent value="terminal" className="flex-1 p-0">
                          <div className="h-full bg-[#1e1e1e] text-white font-mono text-sm">
                            <div className="h-full w-full" />
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EditorPage;
