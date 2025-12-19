import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminQuickAccess = () => {
  const [showAccess, setShowAccess] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showAccess ? (
        <div className="flex flex-col gap-2 mb-2">
          <Link to="/bootstrap-super-admin">
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Setup Admin
            </Button>
          </Link>
          <Link to="/sys-admin-login">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full shadow-lg bg-background/90 backdrop-blur"
            >
              Login Admin
            </Button>
          </Link>
        </div>
      ) : null}
      
      <Button
        onClick={() => setShowAccess(!showAccess)}
        size="sm"
        variant="ghost"
        className="bg-background/80 backdrop-blur shadow-lg hover:bg-background/90"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};