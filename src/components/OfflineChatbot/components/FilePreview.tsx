import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { File, Image, X } from "lucide-react";
import { useState } from "react";
import type { UploadedFile } from "../types/file.types";
import { checkFileType } from "../utils/fileValidation";

interface FilePreviewProps {
  file: UploadedFile;
  index: number;
  onRemove: (index: number) => void;
}

export const FilePreview = ({ file, index, onRemove }: FilePreviewProps) => {
  const fileType = checkFileType(file);
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer">
        {fileType === "image" ? (
          <Image className="h-4 w-4" />
        ) : (
          <File className="h-4 w-4" />
        )}
        <span className="max-w-[150px] truncate text-sm">{file.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={() => onRemove(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {fileType === "image" && (
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
                  src={file.url}
                  alt={file.name}
                  className="rounded-lg w-full h-auto object-cover"
                />
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};
