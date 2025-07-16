import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiDownload,
  FiLoader,
  FiMessageSquare,
  FiMoreVertical,
  FiSend,
  FiTrash2,
  FiZap,
} from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

interface AIMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  codeSnippet?: string;
  language?: string;
  hasCode?: boolean;
  extractedCode?: string;
}

interface AIAssistantProps {
  activeFile: any;
  onClose: () => void;
  onApplyCode: (code: string) => void;
}

const AIAssistant = ({
  activeFile,
  onClose,
  onApplyCode,
}: AIAssistantProps) => {
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const getCurrentCode = () => {
    return activeFile?.content || "";
  };

  const getCurrentLanguage = () => {
    const extension = activeFile?.name?.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      cc: "cpp",
      cxx: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
      scala: "scala",
      html: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      json: "json",
      xml: "xml",
      sql: "sql",
      sh: "bash",
      bash: "bash",
      zsh: "bash",
      ps1: "powershell",
      r: "r",
      m: "matlab",
      pl: "perl",
      lua: "lua",
      dart: "dart",
      vim: "vim",
    };
    return languageMap[extension || ""] || "javascript";
  };

  const getCurrentFileName = () => {
    return activeFile?.name || "untitled";
  };

  const getLanguageRequirements = (language: string) => {
    const requirements: { [key: string]: string } = {
      cpp: `C++ REQUIREMENTS:
- Always include necessary headers (#include <iostream>, #include <vector>, etc.)
- Use 'using namespace std;' OR prefix with 'std::' (std::cout, std::endl, std::vector)
- Proper main() function: int main() { ... return 0; }
- Use proper C++ syntax and data types
- Include all necessary standard library components`,
      c: `C REQUIREMENTS:
- Always include necessary headers (#include <stdio.h>, #include <stdlib.h>, etc.)
- Use proper C syntax (printf, scanf, malloc, free)
- Proper main() function: int main() { ... return 0; }
- Use C-style arrays and pointers correctly`,
      java: `JAVA REQUIREMENTS:
- Always include proper class structure
- Use 'public static void main(String[] args)' for main method
- Include necessary imports (import java.util.*, etc.)
- Use proper Java naming conventions (camelCase)
- Include access modifiers (public, private, protected)`,
      python: `PYTHON REQUIREMENTS:
- Use proper Python indentation (4 spaces)
- Include necessary imports at the top
- Use Python naming conventions (snake_case)
- Proper function definitions with def keyword
- Use Python-specific syntax and built-in functions`,
      javascript: `JAVASCRIPT REQUIREMENTS:
- Use modern ES6+ syntax
- Proper variable declarations (const, let)
- Include necessary imports/exports if using modules
- Use proper JavaScript naming conventions (camelCase)
- Handle async operations properly with async/await or promises`,
      typescript: `TYPESCRIPT REQUIREMENTS:
- Include proper type annotations
- Use TypeScript-specific features (interfaces, types, generics)
- Proper import/export syntax
- Use strict typing where appropriate
- Include necessary type definitions`,
    };
    return requirements[language] || "";
  };

  const extractCodeFromResponse = (response: string) => {
    const patterns = [
      /```[\w]*\n([\s\S]*?)\n```/g,
      /```([\s\S]*?)```/g,
      /`([^`]+)`/g,
    ];
    for (const pattern of patterns) {
      const matches = [...response.matchAll(pattern)];
      if (matches.length > 0) {
        const codeBlocks = matches
          .map((match) => match[1].trim())
          .filter((code) => code.length > 10);
        if (codeBlocks.length > 0) {
          return codeBlocks.reduce((longest, current) =>
            current.length > longest.length ? current : longest
          );
        }
      }
    }
    return null;
  };

  const hasCodeInResponse = (response: string) => {
    return (
      /```[\s\S]*?```/.test(response) ||
      response.includes("function") ||
      response.includes("class") ||
      response.includes("def ") ||
      response.includes("const ") ||
      response.includes("let ") ||
      response.includes("var ") ||
      response.includes("#include") ||
      response.includes("import ")
    );
  };

  const callAI = async (
    userMessageContent: string,
    includeCodeContext = false
  ) => {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ API key not found");
      }

      const currentLanguage = getCurrentLanguage();
      const currentFileName = getCurrentFileName();
      const currentCode = getCurrentCode();
      const languageRequirements = getLanguageRequirements(currentLanguage);

      const systemPrompt = `You are an expert ${currentLanguage} programming assistant. Your primary goal is to provide accurate, helpful, and well-formatted responses to programming-related queries.

When providing code, ensure it is:
- Valid, compilable ${currentLanguage} syntax.
- Production-ready and functional.
- Includes ALL necessary imports, headers, and dependencies.
- Follows ${currentLanguage} best practices and conventions.
- Wrapped in triple backticks: \`\`\`${currentLanguage}\n[CODE HERE]\n\`\`\`.
- Does NOT include comments within the code blocks themselves. Explanations should be provided *outside* the code blocks.

When asked to explain, analyze, or describe code, provide a clear, concise, and step-by-step textual explanation. You may include relevant code snippets within triple backticks to illustrate points, but the primary response should be descriptive text.

If the user's query is not related to programming or code, politely state that you are a code assistant and can only help with programming-related tasks.

CONTEXT:
- Current file: ${currentFileName}
- Language: ${currentLanguage}
${languageRequirements}
`;

      let fullUserContent = userMessageContent;
      if (includeCodeContext && currentCode) {
        fullUserContent = `Given the following ${currentLanguage} code from ${currentFileName}:\n\`\`\`${currentLanguage}\n${currentCode}\n\`\`\`\n\nMy request: ${userMessageContent}`;
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: fullUserContent },
            ],
            max_tokens: 2500,
            temperature: 0.1,
            top_p: 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API Error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  };

  const handleAIMessage = async (message: string, includeCode = false) => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      codeSnippet: includeCode ? getCurrentCode() : undefined,
      language: getCurrentLanguage(),
    };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const aiResponse = await callAI(message, includeCode);
      const hasCode = hasCodeInResponse(aiResponse);
      const extractedCode = hasCode
        ? extractCodeFromResponse(aiResponse)
        : null;

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        hasCode,
        extractedCode,
      };
      setAiMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: `Error: ${error.message}\n\nPlease check your API key and internet connection.`,
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyCodeFromMessage = (message: AIMessage) => {
    if (message.extractedCode) {
      onApplyCode(message.extractedCode);
    }
  };

  const quickActions = [
    {
      id: "debug",
      title: "Debug & Fix",
      icon: FiAlertCircle,
      color: "text-red-500",
      action: () =>
        handleAIMessage(
          `Find and fix all compilation errors, bugs, and issues in this ${getCurrentLanguage()} code. Provide the corrected working code.`,
          true
        ),
    },
    {
      id: "explain",
      title: "Explain Code",
      icon: FiBookOpen,
      color: "text-blue-500",
      action: () =>
        handleAIMessage(
          `Explain what this ${getCurrentLanguage()} code does step by step, including its purpose, logic flow, and how it works.`,
          true
        ),
    },
    {
      id: "optimize",
      title: "Optimize",
      icon: FiZap,
      color: "text-yellow-500",
      action: () =>
        handleAIMessage(
          `Analyze and optimize this ${getCurrentLanguage()} code for better performance, efficiency, and best practices. Provide the improved version.`,
          true
        ),
    },
  ];

  return (
    <div className="h-full flex flex-col border-l bg-background">
      <div className="border-b px-4 py-3 flex items-center justify-between bg-muted/30">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FiMessageSquare className="size-4" />
          AI Code Assistant
          {activeFile && (
            <span className="text-xs text-muted-foreground">
              • {getCurrentFileName()} ({getCurrentLanguage()})
            </span>
          )}
        </h3>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <FiMoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAiMessages([])}>
                <FiTrash2 className="size-4 mr-2" />
                Clear Chat History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onClose}
          >
            <RxCross2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Collapsible
          open={isQuickActionsOpen}
          onOpenChange={setIsQuickActionsOpen}
        >
          <CollapsibleTrigger asChild>
            <div className="p-3 border-b bg-muted/10 hover:bg-muted/20 cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">
                  Quick Actions
                </p>
                {isQuickActionsOpen ? (
                  <FiChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <FiChevronDown className="size-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-b">
            <div className="p-4 bg-muted/5">
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center gap-1 bg-transparent"
                    onClick={action.action}
                    disabled={!activeFile || isAiLoading || !getCurrentCode()}
                  >
                    <action.icon className={`size-3 ${action.color}`} />
                    <span className="text-xs">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 w-full">
              {aiMessages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <FiMessageSquare className="size-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium mb-1">
                    AI Code Assistant Ready
                  </p>
                  <p className="text-xs opacity-70 mb-4">
                    {activeFile
                      ? `Generate accurate ${getCurrentLanguage()} code`
                      : "Select a file to get started"}
                  </p>
                  <Card className="max-w-[75%] mx-auto bg-muted/20 border-dashed">
                    <CardContent className="p-4">
                      <div className="text-xs opacity-60 space-y-2">
                        <p className="font-medium">Try asking:</p>
                        <div className="space-y-1 text-left">
                          <p>"Write a binary search algorithm"</p>
                          <p>"Create a sorting function"</p>
                          <p>"Generate a data structure"</p>
                          <p>"Fix compilation errors"</p>
                          <p>"Optimize this algorithm"</p>
                          <p>"Complete this function"</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {aiMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-start" : "justify-start"} `}
                >
                  <div
                    className={`max-w-[60%] rounded-2xl p-4 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted/50 mr-4 border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.codeSnippet && (
                      <div className="mt-3 p-3 bg-background/50 rounded-lg text-xs font-mono border">
                        <p className="text-muted-foreground mb-2 font-sans">
                          Code from {getCurrentFileName()}:
                        </p>
                        <p className="truncate opacity-80">
                          {message.codeSnippet.substring(0, 80)}...
                        </p>
                      </div>
                    )}
                    {message.type === "assistant" &&
                      message.hasCode &&
                      message.extractedCode && (
                        <div className="mt-3 pt-3 border-t border-background/20">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyCodeFromMessage(message)}
                            className="w-full bg-background/50 hover:bg-background/70 text-foreground border-background/30"
                          >
                            <FiDownload className="size-3 mr-2" />
                            Apply Code to {getCurrentFileName()}
                          </Button>
                        </div>
                      )}
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl p-4 border mr-4">
                    <div className="flex items-center gap-3">
                      <FiLoader className="size-4 animate-spin" />
                      <span className="text-sm">
                        Generating accurate code...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
        <div className="p-4 border-t bg-muted/10">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder={
                activeFile
                  ? `Generate ${getCurrentLanguage()} code...`
                  : "Select a file first..."
              }
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAIMessage(aiInput);
                }
              }}
              disabled={isAiLoading || !activeFile}
            />
            <Button
              size="icon"
              onClick={() => handleAIMessage(aiInput)}
              disabled={!aiInput.trim() || isAiLoading || !activeFile}
            >
              <FiSend className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIMessage(aiInput, true)}
              disabled={
                !aiInput.trim() ||
                !activeFile ||
                isAiLoading ||
                !getCurrentCode()
              }
            >
              <FiCode className="size-3 mr-2" />
              Include Current Code
            </Button>
            {aiMessages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAiMessages([])}
              >
                <FiTrash2 className="size-3 mr-2" />
                Clear Chat
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
