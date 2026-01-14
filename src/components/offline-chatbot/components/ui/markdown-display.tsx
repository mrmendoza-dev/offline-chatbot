"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy, ImageIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface Token {
  type: string;
  content: string;
}

function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];

  // Language-specific patterns
  const patterns: Record<string, Array<{ type: string; pattern: RegExp }>> = {
    javascript: [
      { type: "comment", pattern: /\/\/.*$|\/\*[\s\S]*?\*\//gm },
      {
        type: "string",
        pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
      },
      {
        type: "keyword",
        pattern:
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|new|this|super|extends|default|case|break|continue|switch|typeof|instanceof)\b/g,
      },
      { type: "number", pattern: /\b\d+\.?\d*\b/g },
      { type: "function", pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\()/g },
    ],
    typescript: [
      { type: "comment", pattern: /\/\/.*$|\/\*[\s\S]*?\*\//gm },
      {
        type: "string",
        pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
      },
      {
        type: "keyword",
        pattern:
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|new|this|super|extends|interface|type|enum|namespace|public|private|protected|readonly|static|abstract|implements|default|case|break|continue|switch|typeof|instanceof)\b/g,
      },
      { type: "number", pattern: /\b\d+\.?\d*\b/g },
      { type: "function", pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\()/g },
    ],
    python: [
      { type: "comment", pattern: /#.*$/gm },
      {
        type: "string",
        pattern:
          /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g,
      },
      {
        type: "keyword",
        pattern:
          /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|yield|async|await|pass|break|continue|raise|assert|del|global|nonlocal|True|False|None|and|or|not|in|is)\b/g,
      },
      { type: "number", pattern: /\b\d+\.?\d*\b/g },
      { type: "function", pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g },
    ],
    json: [
      { type: "string", pattern: /"(?:[^"\\]|\\.)*"/g },
      { type: "number", pattern: /\b\d+\.?\d*\b/g },
      { type: "keyword", pattern: /\b(true|false|null)\b/g },
    ],
    html: [
      { type: "comment", pattern: /<!--[\s\S]*?-->/g },
      { type: "tag", pattern: /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^>]*)?\/?>/g },
      { type: "string", pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g },
    ],
    css: [
      { type: "comment", pattern: /\/\*[\s\S]*?\*\//g },
      { type: "selector", pattern: /[.#]?[a-zA-Z][a-zA-Z0-9-]*(?=\s*\{)/g },
      { type: "property", pattern: /[a-zA-Z-]+(?=\s*:)/g },
      { type: "string", pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g },
      { type: "number", pattern: /\b\d+\.?\d*(?:px|em|rem|%|vh|vw)?\b/g },
    ],
  };

  const langPatterns = patterns[language] || patterns.javascript;

  // Simple tokenization - mark positions of special tokens
  const matches: Array<{ start: number; end: number; type: string }> = [];

  langPatterns.forEach(({ type, pattern }) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(code)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        type,
      });
    }
  });

  // Sort by position
  matches.sort((a, b) => a.start - b.start);

  // Build tokens, avoiding overlaps
  let lastEnd = 0;
  matches.forEach((match) => {
    if (match.start >= lastEnd) {
      if (match.start > lastEnd) {
        tokens.push({
          type: "plain",
          content: code.slice(lastEnd, match.start),
        });
      }
      tokens.push({
        type: match.type,
        content: code.slice(match.start, match.end),
      });
      lastEnd = match.end;
    }
  });

  if (lastEnd < code.length) {
    tokens.push({ type: "plain", content: code.slice(lastEnd) });
  }

  return tokens;
}

function SyntaxHighlighter({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const tokens = tokenize(code, language);

  const colorMap: Record<string, string> = {
    keyword: "text-purple-600 dark:text-purple-300",
    string: "text-green-600 dark:text-green-400",
    comment: "text-muted-foreground/70 italic",
    number: "text-orange-600 dark:text-orange-400",
    function: "text-blue-600 dark:text-blue-300",
    tag: "text-red-600 dark:text-red-300",
    selector: "text-yellow-600 dark:text-yellow-400",
    property: "text-cyan-600 dark:text-cyan-300",
    plain: "text-foreground",
  };

  return (
    <pre className="overflow-x-auto rounded-b-lg p-4 pt-0 m-0 font-mono text-sm">
      <code>
        {tokens.map((token, i) => (
          <span key={i} className={colorMap[token.type] || colorMap.plain}>
            {token.content}
          </span>
        ))}
      </code>
    </pre>
  );
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code - simple styling, can be inside paragraphs
  if (inline) {
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  // Block code - must not be inside paragraphs
  return (
    <div className="bg-muted group relative my-4 not-prose rounded-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <div className="flex items-center gap-2 text-foreground">
              <Check className="size-3" />
              <span className="text-xs font-medium">Copied</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-foreground">
              <Copy className="size-3" />
              <span className="text-xs font-medium">Copy</span>
            </div>
          )}
        </Button>
      </div>
      <SyntaxHighlighter code={code} language={language} />
    </div>
  );
}

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

function ImagePlaceholder({ alt }: { alt?: string }) {
  return (
    <div className="my-4 flex items-center justify-center rounded-lg border-2 border-border bg-muted p-8">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon className="h-12 w-12" />
        <p className="text-sm">{alt || "Image"}</p>
      </div>
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  title,
}: {
  src?: string;
  alt?: string;
  title?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <ImagePlaceholder alt={alt} />;
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt || ""}
      title={title}
      loading="lazy"
      className="my-4 h-auto max-w-full rounded-lg border border-border"
      onError={() => setError(true)}
    />
  );
}

export function MarkdownDisplay({
  content,
  className = "",
}: MarkdownDisplayProps) {
  const processedContent = content.replace(
    /(?<!\(|\[|"|'|`)(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
    (url) => `[${url}](${url})`
  );

  return (
    <div
      className={`prose prose-sm prose-neutral dark:prose-invert max-w-none text-foreground [&>*:last-child]:mb-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code: CodeBlock,
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 text-2xl font-bold leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-semibold leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold leading-snug">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-3 text-base font-semibold leading-snug">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mb-1 mt-2 text-sm font-semibold leading-snug">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mb-1 mt-2 text-xs font-semibold leading-snug">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-sm leading-relaxed text-foreground">
              {children}
            </p>
          ),
          hr: () => <hr className="my-6 border-t border-border" />,
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          del: ({ children }) => (
            <del className="line-through text-muted-foreground">{children}</del>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-sm text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-sm text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-border pl-4 text-sm italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-sm text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt, title }) => (
            <ImageWithFallback
              src={src || "/placeholder.svg"}
              alt={alt}
              title={title}
            />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-border text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-foreground">
              {children}
            </td>
          ),
          br: () => <br className="my-1" />,
          input: ({ type, checked, disabled }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 align-middle accent-primary"
                  readOnly
                />
              );
            }
            return null;
          },
          sup: ({ children }) => (
            <sup className="text-xs text-primary">
              <a
                href={`#fn-${children}`}
                className="no-underline hover:underline"
              >
                {children}
              </a>
            </sup>
          ),
          section: (props: React.ComponentProps<"section">) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((props as any)["data-footnotes"]) {
              return (
                <section className="mt-8 border-t border-border pt-4">
                  <h2 className="mb-3 text-base font-semibold">Footnotes</h2>
                  {props.children}
                </section>
              );
            }
            return <section {...props}>{props.children}</section>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
