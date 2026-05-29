import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { tools } from "./toolRegistry";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar tools={tools} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to={tools[0].path} replace />} />
            {tools.map((tool) => (
              <Route key={tool.id} path={tool.path} element={<tool.component />} />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
