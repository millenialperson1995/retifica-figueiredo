import { toast } from "@/hooks/use-toast";

// Define toast utility functions that can be used throughout the application
export const toastUtils = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default", // We can customize this if needed
    });
  }
};