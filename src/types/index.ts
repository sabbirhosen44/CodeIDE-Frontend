export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface authState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface EditorSettings {
  theme: string;
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off" | "wordWrapColumn" | "bounded";
  lineNumbers: "on" | "off" | "relative" | "interval";
  miniMap: { enabled: boolean };
  autoIndent: "none" | "keep" | "brackets" | "advanced" | "full";
  formatOnPaste: boolean;
  formatOnType: boolean;
  snippetSuggestions: "top" | "bottom" | "inline" | "none";
  codeLens: boolean;
  cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
  cursorStyle:
    | "line"
    | "block"
    | "underline"
    | "line-thin"
    | "block-outline"
    | "underline-thin";
  cursorWidth: number;
  fontFamily: string;
  fontLigatures: boolean;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: string;
  smoothScrolling: boolean;
  renderWhiteSpace: "none" | "boundary" | "selection" | "all";
  bracketPairColorization: { enabled: boolean };
}

export interface TemplateFile {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId?: string;
  content?: string;
  isExpanded?: boolean;
  children?: TemplateFile[];
}

export interface Template {
  _id: string;
  name: string;
  description: string;
  category:
    | "Frontend"
    | "Backend"
    | "Full Stack"
    | "Mobile"
    | "Desktop"
    | "Standalone"
    | "Library"
    | "Framework";
  language:
    | "JavaScript"
    | "TypeScript"
    | "Python"
    | "Java"
    | "C"
    | "C++"
    | "C#"
    | "PHP"
    | "Ruby"
    | "Go"
    | "Rust"
    | "Swift"
    | "Kotlin";
  framework?: string | null;
  tags: string[];
  files: TemplateFile[];
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateState {
  templates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalTemplates: number;
  totalSnippets: number;
  userGrowth: Array<{ name: string; users: number }>;
  projectGrowth: Array<{ name: string; projects: number }>;
}
