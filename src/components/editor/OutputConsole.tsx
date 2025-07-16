import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FiPlay,
  FiSquare,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiCopy,
  FiTerminal,
  FiEdit3,
  FiSend,
} from "react-icons/fi";

interface OutputConsoleProps {
  activeFile: any;
  isRunning: boolean;
  onRunComplete: () => void;
}

interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
  language: string;
  version: string;
}

interface OutputEntry {
  id: string;
  timestamp: Date;
  input: string;
  stdin: string;
  result: ExecutionResult | null;
  status: "running" | "completed" | "error";
  language: string;
  filename: string;
}

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "javascript",
    tsx: "javascript",
    py: "python3",
    java: "java",
    c: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    cs: "csharp",
  };
  return languageMap[extension] || null;
};

const INPUT_REQUIRING_LANGUAGES = [
  "c",
  "cpp",
  "cc",
  "cxx",
  "java",
  "py",
  "cs",
  "go",
  "rs",
];

const OutputConsole: React.FC<OutputConsoleProps> = ({
  activeFile,
  isRunning,
  onRunComplete,
}) => {
  const [outputs, setOutputs] = useState<OutputEntry[]>([]);
  const [currentExecution, setCurrentExecution] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const needsInput = activeFile
    ? (() => {
        const extension = activeFile.name.split(".").pop()?.toLowerCase() || "";
        return (
          INPUT_REQUIRING_LANGUAGES.includes(extension) ||
          activeFile.content?.includes("input(") ||
          activeFile.content?.includes("scanf") ||
          activeFile.content?.includes("cin >>") ||
          activeFile.content?.includes("Scanner") ||
          activeFile.content?.includes("Console.ReadLine") ||
          activeFile.content?.includes("stdin")
        );
      })()
    : false;

  useEffect(() => {
    if (scrollAreaRef.current && activeTab === "output") {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [outputs, activeTab]);

  useEffect(() => {
    if (!needsInput) {
      setActiveTab("output");
    }
  }, [needsInput]);

  const executeCode = async (code: string, filename: string, stdin = "") => {
    const executionId = Date.now().toString();
    setCurrentExecution(executionId);
    setActiveTab("output");
    setOutputs([]);

    const language = getLanguageFromExtension(filename);

    if (!language) {
      console.log("Unsupported language for:", filename);
      const errorResult: ExecutionResult = {
        output: "",
        error:
          "Language not supported. Only C, C++, Java, Python3, JavaScript, Go, Rust, PHP, Ruby, and C# are supported.",
        exitCode: 1,
        executionTime: 0,
        language: "unsupported",
        version: "Piston",
      };

      const errorEntry: OutputEntry = {
        id: executionId,
        timestamp: new Date(),
        input: code,
        stdin,
        result: errorResult,
        status: "error",
        language: "unsupported",
        filename,
      };

      setOutputs([errorEntry]);
      setCurrentExecution(null);
      onRunComplete();
      return;
    }

    console.log("Starting code execution:", filename, language);

    const runningEntry: OutputEntry = {
      id: executionId,
      timestamp: new Date(),
      input: code,
      stdin,
      result: null,
      status: "running",
      language,
      filename,
    };

    setOutputs([runningEntry]);

    try {
      const startTime = Date.now();
      console.log("Submitting to Piston API");

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          version: "*",
          files: [
            {
              name: `main.${language === "python3" ? "py" : language === "javascript" ? "js" : language === "csharp" ? "cs" : language}`,
              content: code,
            },
          ],
          stdin: stdin,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pistonResult = await response.json();
      console.log("Piston execution completed");
      const executionTime = Date.now() - startTime;

      let output = "";
      let error = "";

      if (pistonResult.compile) {
        if (pistonResult.compile.stdout) {
          output += pistonResult.compile.stdout;
        }
        if (pistonResult.compile.stderr) {
          error += "Compilation Error:\n" + pistonResult.compile.stderr + "\n";
        }
        if (pistonResult.compile.code !== 0) {
          error += `Compilation failed with exit code ${pistonResult.compile.code}\n`;
        }
      }

      if (pistonResult.run) {
        if (pistonResult.run.stdout) {
          output += pistonResult.run.stdout;
        }
        if (pistonResult.run.stderr) {
          error += pistonResult.run.stderr;
        }
      }

      const result: ExecutionResult = {
        output: output.trim(),
        error: error.trim(),
        exitCode: pistonResult.run?.code || 0,
        executionTime,
        language,
        version: "Piston",
      };

      setOutputs((prev) =>
        prev.map((entry) =>
          entry.id === executionId
            ? {
                ...entry,
                result,
                status:
                  result.exitCode === 0 && !result.error
                    ? "completed"
                    : "error",
              }
            : entry
        )
      );
    } catch (error) {
      console.error("Piston execution failed:", error);
      const errorResult: ExecutionResult = {
        output: "",
        error:
          error instanceof Error ? error.message : "Unknown execution error",
        exitCode: 1,
        executionTime: 0,
        language,
        version: "Piston",
      };
      setOutputs((prev) =>
        prev.map((entry) =>
          entry.id === executionId
            ? { ...entry, result: errorResult, status: "error" }
            : entry
        )
      );
    } finally {
      setCurrentExecution(null);
      onRunComplete();
    }
  };

  useEffect(() => {
    if (isRunning && activeFile && activeFile.content) {
      executeCode(activeFile.content, activeFile.name, userInput);
    }
  }, [isRunning, activeFile, userInput]);

  const clearOutput = () => {
    setOutputs([]);
  };

  const copyOutput = (output: string) => {
    navigator.clipboard.writeText(output);
  };

  const stopExecution = () => {
    if (currentExecution) {
      setOutputs((prev) =>
        prev.map((entry) =>
          entry.id === currentExecution
            ? {
                ...entry,
                result: {
                  output: "",
                  error: "Execution stopped by user",
                  exitCode: 1,
                  executionTime: 0,
                  language: entry.language,
                  version: "Piston",
                },
                status: "error",
              }
            : entry
        )
      );
      setCurrentExecution(null);
      onRunComplete();
    }
  };

  const handleRun = () => {
    if (activeFile && activeFile.content) {
      executeCode(activeFile.content, activeFile.name, userInput);
    }
  };

  const getStatusIcon = (status: OutputEntry["status"]) => {
    switch (status) {
      case "running":
        return <FiLoader className="w-4 h-4 animate-spin text-blue-500" />;
      case "completed":
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: OutputEntry["status"]) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="secondary" className="text-blue-600 bg-blue-50">
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="text-green-600 bg-green-50">
            Success
          </Badge>
        );
      case "error":
        return (
          <Badge variant="secondary" className="text-red-600 bg-red-50">
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flexShrink: 0,
            padding: "12px",
            backgroundColor: "hsl(var(--muted))",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TabsList className="grid w-64 grid-cols-2 bg-background">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <FiEdit3 className="w-4 h-4" />
                Input
                {userInput && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {userInput.split("\n").filter((line) => line.trim()).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <FiTerminal className="w-4 h-4" />
                Output
                {outputs.length > 0 && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {outputs.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              {currentExecution && (
                <Button variant="outline" size="sm" onClick={stopExecution}>
                  <FiSquare className="w-3 h-3 mr-1" />
                  Stop
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearOutput}
                disabled={outputs.length === 0}
              >
                <FiTrash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleRun}
                disabled={currentExecution !== null || !activeFile?.content}
              >
                <FiSend className="w-3 h-3 mr-1" />
                Run
              </Button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <TabsContent
            value="input"
            style={{ height: "100%", margin: 0, padding: "16px" }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flexShrink: 0, marginBottom: "12px" }}>
                <h3 className="text-sm font-medium mb-1">Test Case Input</h3>
                <p className="text-xs text-muted-foreground">
                  Enter input data for your program. Each line will be sent as
                  separate input.
                </p>
              </div>
              <div style={{ flex: 1, marginBottom: "12px" }}>
                <Textarea
                  placeholder="Enter your test case input here..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    resize: "none",
                  }}
                  className="bg-muted/20"
                  disabled={currentExecution !== null}
                />
              </div>
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  borderTop: "1px solid hsl(var(--border))",
                  fontSize: "12px",
                }}
                className="text-muted-foreground"
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <span>Lines: {userInput.split("\n").length}</span>
                  <span>Characters: {userInput.length}</span>
                  <span>
                    Non-empty:{" "}
                    {userInput.split("\n").filter((line) => line.trim()).length}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUserInput("")}
                  disabled={!userInput || currentExecution !== null}
                >
                  <FiTrash2 className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="output"
            style={{ height: "100%", margin: 0, padding: "16px" }}
          >
            {outputs.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
                className="text-muted-foreground"
              >
                <FiPlay className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm font-medium">No output yet</p>
                <p className="text-xs">
                  Click the Run button to execute your code
                </p>
              </div>
            ) : (
              <div
                ref={scrollAreaRef}
                style={{
                  height: "100%",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  paddingRight: "8px",
                  paddingBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {outputs.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(entry.status)}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {entry.filename}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {entry.language}
                            </Badge>
                            {getStatusBadge(entry.status)}
                            {entry.stdin && (
                              <Badge variant="secondary" className="text-xs">
                                With Input
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FiClock className="w-3 h-3" />
                          {entry.timestamp.toLocaleTimeString()}
                          {entry.result && entry.result.executionTime > 0 && (
                            <span>({entry.result.executionTime}ms)</span>
                          )}
                        </div>
                      </div>

                      {entry.stdin && (
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xs text-blue-700">
                                Input
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyOutput(entry.stdin)}
                              >
                                <FiCopy className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div
                              style={{ maxHeight: "128px", overflowY: "auto" }}
                            >
                              <pre className="text-sm font-mono bg-gray-100 text-gray-900 p-3 rounded border whitespace-pre-wrap">
                                {entry.stdin}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        {entry.status === "running" ? (
                          <CardContent className="p-6">
                            <div className="flex items-center justify-center gap-3 text-muted-foreground">
                              <FiLoader className="w-5 h-5 animate-spin" />
                              <span className="text-sm">Executing code...</span>
                            </div>
                          </CardContent>
                        ) : entry.result ? (
                          <div>
                            {entry.result.output && (
                              <div>
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs text-green-700">
                                      Output
                                    </CardTitle>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyOutput(entry.result!.output)
                                      }
                                    >
                                      <FiCopy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div
                                    style={{
                                      maxHeight: "192px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <pre className="text-sm font-mono bg-gray-100 text-gray-900 p-3 rounded border border-gray-300 whitespace-pre-wrap">
                                      {entry.result.output}
                                    </pre>
                                  </div>
                                </CardContent>
                              </div>
                            )}
                            {/* Error Output */}
                            {entry.result.error && (
                              <div>
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs text-red-700">
                                      Error
                                    </CardTitle>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyOutput(entry.result!.error)
                                      }
                                    >
                                      <FiCopy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div
                                    style={{
                                      maxHeight: "192px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <pre className="text-sm font-mono bg-red-50 p-3 rounded border text-red-600 whitespace-pre-wrap">
                                      {entry.result.error}
                                    </pre>
                                  </div>
                                </CardContent>
                              </div>
                            )}
                            {/* No Output */}
                            {!entry.result.output && !entry.result.error && (
                              <CardContent className="p-6">
                                <div className="text-center text-muted-foreground">
                                  <p className="text-sm">No output produced</p>
                                  <p className="text-xs mt-1">
                                    Your program ran successfully but didn't
                                    print anything
                                  </p>
                                </div>
                              </CardContent>
                            )}
                            {/* Execution Info */}
                            <div className="px-4 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
                              <div className="flex items-center justify-between">
                                <span>
                                  Exit code: {entry.result.exitCode} |{" "}
                                  {entry.result.language} {entry.result.version}
                                </span>
                                <span>
                                  Execution time: {entry.result.executionTime}ms
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default OutputConsole;
