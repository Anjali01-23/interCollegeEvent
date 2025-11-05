import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import NewRequest from "../components/participants/NewRequest";
import AllRequest from "../components/participants/AllRequest";
import ParticipantList from "../components/participants/ParticipantList";
import { useLocation } from "react-router-dom";

const ParticipantDashboard = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultTab = params.get("tab") || "New Requests";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = ["New Requests", "All Requests", "Participants"];

  return (
    <>
      <div className="min-h-screen bg-[#0b1020] text-gray-100">
        <Navbar />
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-2.5xl font-bold text-gray-100">
                Participant Management Dashboard
              </h1>
            </div>

            {/* Tabs */}
            <div className="mt-5">
              <div className="overflow-x-auto">
                <div className="inline-flex gap-6 text-gray-300 font-medium pb-2">
                  {tabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap pb-3 px-1 sm:px-2 text-sm sm:text-base rounded-t-md focus:outline-none ${
                          active
                            ? "text-purple-400 border-b-2 border-purple-400"
                            : "text-gray-300 hover:text-purple-300"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800 rounded-xl shadow p-4 sm:p-6 border border-gray-700">
              {activeTab === "New Requests" && <NewRequest />}
              {activeTab === "All Requests" && <AllRequest />}
              {activeTab === "Participants" && <ParticipantList />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ParticipantDashboard;
