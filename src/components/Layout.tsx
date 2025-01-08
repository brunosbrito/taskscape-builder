import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building2, ClipboardList, Activity } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Usuários", path: "/users" },
  { icon: Building2, label: "Obras", path: "/obras" },
  { icon: ClipboardList, label: "Ordens de Serviço", path: "/os" },
  { icon: Activity, label: "Atividades", path: "/atividades" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-construction-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-construction-200">
        <div className="p-4 border-b border-construction-200">
          <h1 className="text-2xl font-bold text-primary">ConstructTask</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === path
                  ? "bg-primary text-white"
                  : "text-construction-600 hover:bg-construction-100"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;