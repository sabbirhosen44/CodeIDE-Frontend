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
