import { 
  LayoutDashboard, 
  GraduationCap, 
  Trophy, 
  Globe, 
  BarChart3, 
  Bookmark, 
  Settings,
  BookOpen,
  Calendar,
  Award,
  BadgeCheck,
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
    label: "Global Overview",
    view: "home",
    icon: LayoutDashboard,
  },
  {
    id: "universities",
    label: "Institution Directory",
    view: "universities",
    icon: GraduationCap,
  },
  {
    id: "rankings",
    label: "Prestige Rankings",
    view: "rankings",
    icon: Trophy,
    badge: "Live",
  },
  {
    id: "analytics",
    label: "Analytics",
    view: "analytics", // a new analytics view we can mock or showcase
    icon: BarChart3,
  },
  {
    id: "saved",
    label: "Comparison Matrix",
    view: "saved", // a view for saved universities or comparing ones
    icon: Bookmark,
  },
  {
    id: "methodology",
    label: "Methodology",
    view: "methodology",
    icon: BookOpen,
  },
  {
    id: "events",
    label: "Events & Awards",
    view: "events",
    icon: Calendar,
  },
  {
    id: "faculty-awards",
    label: "Faculty & Student Awards",
    view: "faculty-awards",
    icon: Award,
  },
  {
    id: "settings",
    label: "Settings",
    view: "settings",
    icon: Settings,
  },
];

export const TOP_NAV_LINKS = [
  { label: "Home", view: "home" },
  { label: "Institution Directory", view: "universities" },
  { label: "Rankings Engine", view: "rankings" },
  // { label: "Methodology", view: "methodology" },
  { label: "Comparison Matrix", view: "saved" },
  { label: "Events & Awards", view: "events" },
  { label: "News", view: "news" },
];
