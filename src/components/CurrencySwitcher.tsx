import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCIES, type CurrencyCode } from "@/lib/constant";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "$",
};

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 bg-gray-100">
          <span className="">
            {symbol} {currency}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[80px]">
        {CURRENCIES.map((code) => (
          <DropdownMenuItem
            className={cn(
              "cursor-pointer",
              currency === code && "bg-primary/10 text-primary"
            )}
            key={code}
            onClick={() => setCurrency(code as CurrencyCode)}
          >
            {CURRENCY_SYMBOLS[code] ?? ""} {code}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
