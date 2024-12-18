import React, { useState, useEffect } from "react";
import sortIcon from "./dashboardAssets/sort.png";
import searchIcon from "./dashboardAssets/glass.png";
import HeaderSection from "../header/HeaderSection";

function HistoryBody() {
  const [historyData, setHistoryData] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          name: "Ace Bernard Malasaga",
          date: "December 23, 2025",
          healthSensors: "Average",
          envSensors: "Good",
          remarks: "Average",
        },
        {
          name: "Neil Sims",
          date: "November 11, 2024",
          healthSensors: "Good",
          envSensors: "Excellent",
          remarks: "Great",
        },
      ];
      setHistoryData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 min-h-screen flex flex-col ">
      {/* Header Section */}
      <HeaderSection
      title="HISTORY"
      />
      

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Table Section in Card */}
      <div className="bg-cardHolderColor rounded-lg shadow-md p-6">
        <div className="relative overflow-x-auto">
          {/* Search and Action Buttons */}
          <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className={`inline-flex items-center text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none border ${
                isDropdownOpen ? "bg-searchTable" : "bg-tableColor"
              }`}
            >
              Action
              <svg
                className="w-2.5 h-2.5 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 bg-searchTable rounded-lg shadow-lg w-44">
                <ul className="py-1 text-sm text-white">
                  <li className="px-4 py-2 hover:bg-primeColor">Reward</li>
                  <li className="px-4 py-2 hover:bg-primeColor">Promote</li>
                  <li className="px-4 py-2 hover:bg-primeColor">Activate Account</li>
                  <li className="px-4 py-2 hover:bg-primeColor text-red">Delete User</li>
                </ul>
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                placeholder="Search for users"
                className="block p-2 pl-10 text-sm text-white bg-searchTable border border-white rounded-lg w-80 focus:ring-solidGreen focus:border-solidGreen"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={searchIcon} alt="Search" className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm text-left text-white bg-tableColor">
            <thead className="text-xs uppercase bg-searchTable text-white">
              <tr>
                <th className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded text-green" />
                </th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Health Sensors</th>
                <th className="px-6 py-3">Environmental Sensors</th>
                <th className="px-6 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((data, index) => (
                <tr
                  key={index}
                  className="border-b bg-cardHolderColor hover:bg-searchTable"
                >
                  <td className="p-4">
                    <input type="checkbox" className="w-4 h-4 rounded text-green" />
                  </td>
                  <td className="px-6 py-3">{data.name}</td>
                  <td className="px-6 py-3">{data.date}</td>
                  <td className="px-6 py-3 flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green mr-2"></div>
                    Online
                  </td>
                  <td className="px-6 py-3">{data.healthSensors}</td>
                  <td className="px-6 py-3">{data.envSensors}</td>
                  <td className="px-6 py-3">{data.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryBody;
