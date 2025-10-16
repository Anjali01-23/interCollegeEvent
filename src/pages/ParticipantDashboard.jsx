import React from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react';
import NewRequest from '../components/participants/NewRequest';
import AllRequest from '../components/participants/AllRequest';
import ParticipantList from '../components/participants/ParticipantList'

const ParticipantDashboard = () => {
 const [activeTab, setActiveTab] = useState("New Requests");    
  return (
    <>
    <Navbar/>
    {/* Header */}
      <header className="px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Participant Management Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b text-gray-600 font-medium mt-5">
          {["New Requests", "All Requests", "Participants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "hover:text-purple-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === "New Requests" && <NewRequest />}
          {activeTab === "All Requests" && <AllRequest />}
          {activeTab === "Participants" && <ParticipantList />}
        </div>
      </header>
    </>
  )
}

export default ParticipantDashboard
