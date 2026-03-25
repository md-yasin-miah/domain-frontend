import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import {
  clearAllTutorialStorageKeys,
  markClientOffersTutorialPending,
  markSellerListingTutorialPending,
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
import {
  Eraser,
  Handshake,
  PlayCircle,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TutorialSettingsFab() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const replayCreateListingTutorial = () => {
    markSellerListingTutorialPending();
    navigate(ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS);
  };

  const replayOffersListTutorial = () => {
    markClientOffersTutorialPending();
    navigate(`${ROUTES.CLIENT.OFFERS.INDEX}?tutorial=offer`);
  };

  const replayOfferDetailTutorial = () => {
    const match = /^\/client\/offers\/(\d+)$/.exec(location.pathname);
    if (!match) {
      toast({
        title: "Open an offer first",
        description:
          "Go to Offers, open any offer from the table, then use this menu again to replay the detail-page tour.",
      });
      return;
    }
    navigate({
      pathname: location.pathname,
      search: "?tutorial=offer-detail",
    });
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
          <DropdownMenuItem onClick={replayOffersListTutorial}>
            <Handshake className="mr-2 h-4 w-4" />
            Replay Offers List Tutorial
          </DropdownMenuItem>
          <DropdownMenuItem onClick={replayOfferDetailTutorial}>
            <Handshake className="mr-2 h-4 w-4" />
            Replay Offer Detail Tutorial
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem onClick={clearAllTutorialKeys}>
            <Eraser className="mr-2 h-4 w-4" />
            Clear all tutorial keys
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
