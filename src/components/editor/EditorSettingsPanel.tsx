import type React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { EDITOR_THEMES } from "@/constants";

interface EditorSettingsPanelProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

const EditorSettingsPanel: React.FC<EditorSettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleThemeChange = (value: string) => {
    onSettingsChange({ theme: value });
  };

  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({ fontSize: value[0] });
  };

  const handleTabSizeChange = (value: number[]) => {
    onSettingsChange({ tabSize: value[0] });
  };

  const handleToggleWordWrap = (checked: boolean) => {
    onSettingsChange({ wordWrap: checked ? "on" : "off" });
  };

  const handleToggleMinimap = (checked: boolean) => {
    onSettingsChange({ minimap: { enabled: checked } });
  };

  const handleToggleLineNumbers = (checked: boolean) => {
    onSettingsChange({ lineNumbers: checked ? "on" : "off" });
  };

  const handleToggleAutoSave = (checked: boolean) => {
    onSettingsChange({ autoSave: checked });
  };

  const handleFontFamilyChange = (value: string) => {
    onSettingsChange({ fontFamily: value });
  };

  const handleLineHeightChange = (value: number[]) => {
    onSettingsChange({ lineHeight: value[0] });
  };

  const handleLetterSpacingChange = (value: number[]) => {
    onSettingsChange({ letterSpacing: value[0] });
  };

  const handleCursorStyleChange = (value: string) => {
    onSettingsChange({ cursorStyle: value });
  };

  const handleCursorBlinkingChange = (value: string) => {
    onSettingsChange({ cursorBlinking: value });
  };

  const handleToggleBracketPairColorization = (checked: boolean) => {
    onSettingsChange({ bracketPairColorization: { enabled: checked } });
  };

  const handleToggleFontLigatures = (checked: boolean) => {
    onSettingsChange({ fontLigatures: checked });
  };

  const handleRenderWhitespaceChange = (value: string) => {
    onSettingsChange({ renderWhitespace: value });
  };

  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={settings.theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={settings.fontFamily}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="'Consolas', 'Courier New', monospace">
                Consolas
              </SelectItem>
              <SelectItem value="'Monaco', 'Menlo', monospace">
                Monaco
              </SelectItem>
              <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
              <SelectItem value="'Source Code Pro', monospace">
                Source Code Pro
              </SelectItem>
              <SelectItem value="'JetBrains Mono', monospace">
                JetBrains Mono
              </SelectItem>
              <SelectItem value="'Cascadia Code', monospace">
                Cascadia Code
              </SelectItem>
              <SelectItem value="'Roboto Mono', monospace">
                Roboto Mono
              </SelectItem>
              <SelectItem value="'Ubuntu Mono', monospace">
                Ubuntu Mono
              </SelectItem>
              <SelectItem value="'SF Mono', monospace">SF Mono</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size: {settings.fontSize}px</Label>
          <Slider
            value={[settings.fontSize]}
            min={10}
            max={30}
            step={1}
            onValueChange={handleFontSizeChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Line Height: {settings.lineHeight}</Label>
          <Slider
            value={[settings.lineHeight]}
            min={1.0}
            max={3.0}
            step={0.1}
            onValueChange={handleLineHeightChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Letter Spacing: {settings.letterSpacing}px</Label>
          <Slider
            value={[settings.letterSpacing]}
            min={-2}
            max={5}
            step={0.1}
            onValueChange={handleLetterSpacingChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="font-ligatures">Font Ligatures</Label>
          <Switch
            id="font-ligatures"
            checked={settings.fontLigatures}
            onCheckedChange={handleToggleFontLigatures}
          />
        </div>
      </TabsContent>

      <TabsContent value="editor" className="space-y-6">
        <div className="space-y-2">
          <Label>Tab Size: {settings.tabSize}</Label>
          <Slider
            value={[settings.tabSize]}
            min={1}
            max={8}
            step={1}
            onValueChange={handleTabSizeChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="word-wrap">Word Wrap</Label>
          <Switch
            id="word-wrap"
            checked={settings.wordWrap === "on"}
            onCheckedChange={handleToggleWordWrap}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="minimap">Minimap</Label>
          <Switch
            id="minimap"
            checked={settings.minimap?.enabled}
            onCheckedChange={handleToggleMinimap}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="line-numbers">Line Numbers</Label>
          <Switch
            id="line-numbers"
            checked={settings.lineNumbers === "on"}
            onCheckedChange={handleToggleLineNumbers}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bracket-pair-colorization">
            Bracket Pair Colorization
          </Label>
          <Switch
            id="bracket-pair-colorization"
            checked={settings.bracketPairColorization?.enabled}
            onCheckedChange={handleToggleBracketPairColorization}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Cursor Style</Label>
          <Select
            value={settings.cursorStyle}
            onValueChange={handleCursorStyleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cursor style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
              <SelectItem value="line-thin">Thin Line</SelectItem>
              <SelectItem value="block-outline">Block Outline</SelectItem>
              <SelectItem value="underline-thin">Thin Underline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cursor Blinking</Label>
          <Select
            value={settings.cursorBlinking}
            onValueChange={handleCursorBlinkingChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cursor blinking" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blink">Blink</SelectItem>
              <SelectItem value="smooth">Smooth</SelectItem>
              <SelectItem value="phase">Phase</SelectItem>
              <SelectItem value="expand">Expand</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Render Whitespace</Label>
          <Select
            value={settings.renderWhitespace}
            onValueChange={handleRenderWhitespaceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select whitespace rendering" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="boundary">Boundary</SelectItem>
              <SelectItem value="selection">Selection</SelectItem>
              <SelectItem value="trailing">Trailing</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="files" className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-save">Auto Save</Label>
          <Switch
            id="auto-save"
            checked={settings.autoSave}
            onCheckedChange={handleToggleAutoSave}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="format-on-save">Format On Save</Label>
          <Switch
            id="format-on-save"
            checked={settings.formatOnSave}
            onCheckedChange={(checked) =>
              onSettingsChange({ formatOnSave: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="format-on-paste">Format On Paste</Label>
          <Switch
            id="format-on-paste"
            checked={settings.formatOnPaste}
            onCheckedChange={(checked) =>
              onSettingsChange({ formatOnPaste: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="format-on-type">Format On Type</Label>
          <Switch
            id="format-on-type"
            checked={settings.formatOnType}
            onCheckedChange={(checked) =>
              onSettingsChange({ formatOnType: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="detect-indentation">Auto Detect Indentation</Label>
          <Switch
            id="detect-indentation"
            checked={settings.detectIndentation}
            onCheckedChange={(checked) =>
              onSettingsChange({ detectIndentation: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="trim-trailing-whitespace">
            Trim Trailing Whitespace
          </Label>
          <Switch
            id="trim-trailing-whitespace"
            checked={settings.trimTrailingWhitespace}
            onCheckedChange={(checked) =>
              onSettingsChange({ trimTrailingWhitespace: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="insert-final-newline">Insert Final Newline</Label>
          <Switch
            id="insert-final-newline"
            checked={settings.insertFinalNewline}
            onCheckedChange={(checked) =>
              onSettingsChange({ insertFinalNewline: checked })
            }
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EditorSettingsPanel;
