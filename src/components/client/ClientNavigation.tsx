import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, User, Settings, FileText, 
  MessageCircle, CreditCard, Globe, Server 
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Mi Perfil",
    href: "/client/profile", 
    icon: User,
  },
  {
    name: "Servicios",
    href: "/client/services",
    icon: Server,
  },
  {
    name: "Facturas",
    href: "/client/invoices",
    icon: FileText,
  },
  {
    name: "Dominio & Hosting",
    href: "/client/hosting",
    icon: Globe,
  },
  {
    name: "Soporte",
    href: "/client/support",
    icon: MessageCircle,
  },
];

export default function ClientNavigation() {
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}