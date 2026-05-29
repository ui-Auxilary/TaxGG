import { NavLink } from "react-router-dom";
import type { ToolDefinition } from "./toolRegistry";

interface SidebarProps {
  tools: ToolDefinition[];
}

export function Sidebar({ tools }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="brand">
        Tax<span>GG</span>
      </div>
      {tools.map((tool) => (
        <NavLink
          key={tool.id}
          to={tool.path}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          {tool.label}
        </NavLink>
      ))}
    </nav>
  );
}
