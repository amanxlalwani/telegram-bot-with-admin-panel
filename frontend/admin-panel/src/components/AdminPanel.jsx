import React, { useState } from "react";
import Settings from "./Settings";
import Users from "./Users";
import { useNavigate } from "react-router-dom";

function AdminPanel({ onSignOut }) {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigagte = useNavigate();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="w-full h-10 bg-blue-600 md:hidden"></div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed w-12  z-50 bg-blue-600 text-white p-2 rounded-lg md:hidden"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-600 text-white transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-1/4 py-6`}
      >
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
        <div className="flex flex-col items-center gap-4 ">
          <button
            onClick={() => {
              setActiveTab("users");
              setIsSidebarOpen(false);
            }}
            className={`w-3/4 mx-auto text-left px-4 py-2 rounded-lg ${
              activeTab === "users" ? "bg-blue-800" : "hover:bg-blue-700"
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
            className={`w-3/4 mx-auto text-left px-4 py-2 mb-4 rounded-lg ${
              activeTab === "settings" ? "bg-blue-800" : "hover:bg-blue-700"
            }`}
          >
            Update Settings
          </button>
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              localStorage.removeItem("token");
              onSignOut();
              navigagte("/");
            }}
            className="w-3/4 mx-auto text-left px-4 py-2 mb-4 rounded-lg hover:bg-blue-700"
          >
            Log Out
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "settings" && <Settings />}
        {activeTab === "users" && <Users />}
      </main>
    </div>
  );
}

export default AdminPanel;
