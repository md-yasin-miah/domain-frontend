import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import {
  clearAllTutorialStorageKeys,
  markSellerListingTutorialPending,
  resetSellerListingTutorialProgress,
} from "@/lib/tutorialStorage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eraser, PlayCircle, RotateCcw, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TutorialSettingsFab() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const replayCreateListingTutorial = () => {
    markSellerListingTutorialPending();
    navigate(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS);
  };

  const clearAllTutorialKeys = () => {
    const removedKeys = clearAllTutorialStorageKeys();
    toast({
      title: "Tutorial storage cleaned",
      description:
        removedKeys.length > 0
          ? `${removedKeys.length} tutorial key(s) removed from local storage.`
          : "No tutorial keys were found in local storage.",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="rounded-full shadow-lg"
            aria-label="Tutorial settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Tutorial Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={replayCreateListingTutorial}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Replay Create Listing Tutorial
          </DropdownMenuItem>
          <DropdownMenuSeparator  className="bg-border"/>
          <DropdownMenuItem onClick={clearAllTutorialKeys}>
            <Eraser className="mr-2 h-4 w-4" />
            Clear all tutorial keys
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
