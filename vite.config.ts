import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ].filter(Boolean),
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            // React core (separate from router)
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "react-core";
            }
            // React Router (separate chunk due to size)
            if (id.includes("react-router") || id.includes("@remix-run/router")) {
              return "react-router";
            }
            // Redux
            if (id.includes("redux") || id.includes("@reduxjs")) {
              return "redux-vendor";
            }
            // Large UI libraries - split individually
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("react-hook-form") || id.includes("@hookform")) {
              return "form-vendor";
            }
            if (id.includes("zod")) {
              return "zod";
            }
            if (id.includes("sonner")) {
              return "sonner";
            }
            // i18n
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "i18n-vendor";
            }
            // Other dependencies
            if (id.includes("date-fns")) {
              return "date-fns";
            }
            if (id.includes("lucide-react")) {
              return "lucide";
            }
            if (id.includes("clsx") || id.includes("tailwind-merge")) {
              return "utils-vendor";
            }
            // Large scoped packages - split individually
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            if (id.includes("@tanstack")) {
              return "tanstack";
            }
            if (id.includes("@tiptap")) {
              return "tiptap";
            }
            // Don't manually chunk react-pdf - let it be code-split naturally when lazy-loaded
            // if (id.includes("@react-pdf")) {
            //   return "react-pdf";
            // }
            if (id.includes("@types")) {
              return "types";
            }
            // Large individual packages
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            if (id.includes("moment")) {
              return "moment";
            }
            if (id.includes("embla-carousel")) {
              return "embla";
            }
            if (id.includes("cmdk") || id.includes("vaul") || id.includes("input-otp")) {
              return "ui-components";
            }
            // Group remaining scoped packages by namespace
            const scopedMatch = id.match(/node_modules\/(@[^/]+)/);
            if (scopedMatch) {
              const namespace = scopedMatch[1];
              // Split large namespaces
              if (namespace === "@radix-ui" || namespace === "@tiptap" || namespace === "@tanstack") {
                return namespace.replace("@", "").replace("-", "");
              }
              // react-pdf should be in its own chunk (will be lazy loaded)
              if (id.includes("@react-pdf")) {
                return "react-pdf";
              }
              return "vendor-scoped";
            }
            // Group remaining packages by size/type
            if (
              id.includes("class-variance") ||
              id.includes("next-themes") ||
              id.includes("react-resizable")
            ) {
              return "ui-utils";
            }
            // Split remaining vendor by package name to create smaller chunks
            const packageMatch = id.match(/node_modules\/([^/]+)/);
            if (packageMatch) {
              const pkgName = packageMatch[1];
              // Split vendor into smaller chunks by first letter to distribute load
              const firstChar = pkgName.charAt(0).toLowerCase();
              // More granular splitting for better distribution
              if (firstChar >= "a" && firstChar <= "c") {
                return "vendor-a-c";
              } else if (firstChar >= "d" && firstChar <= "f") {
                return "vendor-d-f";
              } else if (firstChar >= "g" && firstChar <= "i") {
                return "vendor-g-i";
              } else if (firstChar >= "j" && firstChar <= "l") {
                return "vendor-j-l";
              } else if (firstChar >= "m" && firstChar <= "o") {
                return "vendor-m-o";
              } else if (firstChar >= "p" && firstChar <= "r") {
                return "vendor-p-r";
              } else if (firstChar >= "s" && firstChar <= "u") {
                return "vendor-s-u";
              } else {
                return "vendor-v-z";
              }
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
}));
