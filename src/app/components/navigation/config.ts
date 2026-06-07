import { 
  LayoutDashboard, 
  GraduationCap, 
  Trophy, 
  Globe, 
  BarChart3, 
  Bookmark, 
  Settings 
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  view: string; // matches the view in AppContent (e.g., 'home', 'rankings', 'profile', etc.)
  icon: any; // Lucide icon component
  badge?: string; // Optional indicator badge (e.g. "New", "2")
}

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    view: "home",
    icon: LayoutDashboard,
  },
  {
    id: "universities",
    label: "Universities",
    view: "universities",
    icon: GraduationCap,
  },
  {
    id: "rankings",
    label: "Rankings",
    view: "rankings",
    icon: Trophy,
    badge: "Live",
  },
  {
    id: "countries",
    label: "Countries",
    view: "rankings", // redirect to rankings view and apply filter
    icon: Globe,
  },
  {
    id: "analytics",
    label: "Analytics",
    view: "analytics", // a new analytics view we can mock or showcase
    icon: BarChart3,
  },
  {
    id: "saved",
    label: "Shortlisted",
    view: "saved", // a view for saved universities or comparing ones
    icon: Bookmark,
  },
  {
    id: "settings",
    label: "Settings",
    view: "settings", // settings page/view
    icon: Settings,
  },
];

export const TOP_NAV_LINKS = [
  { label: "Discovery Hub", view: "home" },
  { label: "Rankings Engine", view: "rankings" },
  { label: "Institutional Analytics", view: "analytics" },
];
