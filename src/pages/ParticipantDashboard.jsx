import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import NewRequest from "../components/participants/NewRequest";
import AllRequest from "../components/participants/AllRequest";
import ParticipantList from "../components/participants/ParticipantList";

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState("New Requests");

  const tabs = ["New Requests", "All Requests", "Participants"];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-2.5xl font-bold text-gray-800">
                Participant Management Dashboard
              </h1>
            </div>

            {/* Tabs */}
            <div className="mt-5">
              <div className="overflow-x-auto">
                <div className="inline-flex gap-6 text-gray-600 font-medium pb-2">
                  {tabs.map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap pb-3 px-1 sm:px-2 text-sm sm:text-base rounded-t-md focus:outline-none ${
                          active
                            ? "text-purple-600 border-b-2 border-purple-600"
                            : "text-gray-600 hover:text-purple-600"
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
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
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
