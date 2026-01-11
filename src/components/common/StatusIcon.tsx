import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AlertTriangle } from "lucide-react";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    case "expired":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return null;
  }
};

export default StatusIcon;
