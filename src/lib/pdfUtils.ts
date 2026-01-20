import React from "react";

/**
 * Generates and downloads a PDF document using @react-pdf/renderer
 * Lazy loads react-pdf only when this function is called to reduce initial bundle size
 * @param document - The React PDF Document component
 * @param filename - The filename for the downloaded PDF
 */
export const generatePDF = async (
  document: React.ReactElement,
  filename: string = "document.pdf"
): Promise<void> => {
  try {
    // Dynamically import react-pdf only when generating PDF (saves ~860KB from initial bundle)
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(document).toBlob();
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

