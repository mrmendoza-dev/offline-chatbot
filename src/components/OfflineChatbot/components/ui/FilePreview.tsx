import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Code, File, FileText, Image, X } from "lucide-react";
import { useState } from "react";
import type { UploadedFile } from "../../types/attachment.types";

interface FilePreviewProps {
  file: UploadedFile;
  index: number;
  onRemove: (index: number) => void;
}

export const FilePreview = ({ file, index, onRemove }: FilePreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getIcon = () => {
    switch (file.category) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "code":
        return <Code className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const isParseable = file.category !== "unsupported" && !file.parseError;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => isParseable && setIsDialogOpen(true)}
        title={
          isParseable
            ? `Click to view ${file.name}`
            : file.parseError || "Cannot preview this file"
        }
      >
        {getIcon()}
        <span className="max-w-[150px] truncate text-sm">{file.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click
            onRemove(index);
          }}
          title="Remove attachment"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {file.category === "image" && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-80 z-50 bg-popover border rounded-lg shadow-lg p-3"
            >
              <div className="space-y-2">
                <img
                  src={
                    file.base64
                      ? `data:${file.type};base64,${file.base64}`
                      : file.url
                  }
                  alt={file.name}
                  className="rounded-lg w-full h-auto object-cover"
                />
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Dialog for viewing file content */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[calc(80vh-100px)]">
            {file.category === "image" ? (
              <img
                src={
                  file.base64
                    ? `data:${file.type};base64,${file.base64}`
                    : file.url
                }
                alt={file.name}
                className="rounded-lg w-full h-auto object-contain max-h-[60vh]"
              />
            ) : file.parseError ? (
              <div className="bg-destructive/10 rounded-lg p-4 text-sm text-destructive">
                Error: {file.parseError}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words">
                {file.content || "No content available"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
