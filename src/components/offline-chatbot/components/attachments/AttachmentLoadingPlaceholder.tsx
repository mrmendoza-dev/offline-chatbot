import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

export const AttachmentLoadingPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-muted/50"
    >
      <Spinner className="h-4 w-4" />
      <span className="text-muted-foreground">Processing...</span>
    </motion.div>
  );
};
