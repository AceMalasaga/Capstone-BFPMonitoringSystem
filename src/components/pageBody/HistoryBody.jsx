import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
import sortIcon from "./dashboardAssets/sort.png";
import searchIcon from "./dashboardAssets/glass.png";
import HeaderSection from "../header/HeaderSection";
import BodyCard from "../parentCard/BodyCard";
import HistoryTable from "../historyTable/HistoryTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function HistoryBody() {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedPersonnel, setExpandedPersonnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows for deletion
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
  const [sortOption, setSortOption] = useState(""); // Track sorting option
  const [selectedRealTimeData, setSelectedRealTimeData] = useState(null); // Store selected real-time data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelSnapshot = await getDocs(collection(db, "personnelRecords"));
        const data = [];
    
        for (const docSnapshot of personnelSnapshot.docs) {
          const personnel = docSnapshot.data();
          const documentId = docSnapshot.id; // Firestore auto-generated ID
    
          const notificationsRef = collection(docSnapshot.ref, "notifications");
          const notifSnapshot = await getDocs(notificationsRef);
          const notifications = [];
    
          notifSnapshot.forEach((notifDoc) => {
            const notifData = notifDoc.data();
            const date = new Date(notifData.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
    
            const gearId = notifData.gearId || "Unknown"; // Default if no gearId
    
            notifications.push({
              gearId: gearId,
              event: notifData.event || "Critical",
              date: formattedDate,
              time: formattedTime,
              sensor: notifData.sensor || "Unknown",
              value: notifData.value || "N/A",
              status: notifData.status || "Unknown",
            });
          });
    
          data.push({
            documentId: documentId, // Use documentId here
            gearId: personnel.gearId || "No gearId",
            name: personnel.personnelName,
            date: personnel.date || "No date",
            time: personnel.time || "No time",
            totalNotifications: notifications.length,
            notifications: notifications,
          });
        }
    
        setHistoryData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };    
    
    fetchData();
  }, []);
  
  

  useEffect(() => {
  const filtered = historyData.filter((data) => {
    const name = data.name || ""; // Fallback to an empty string if undefined
    const gearId = data.gearId || ""; // Fallback to an empty string if undefined
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gearId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  setFilteredData(filtered);
}, [searchTerm, historyData]);


  const handleRowClick = (personnel) => {
    setExpandedPersonnel(expandedPersonnel === personnel ? null : personnel);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectRow = (documentId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(documentId)
        ? prevSelectedRows.filter((id) => id !== documentId)
        : [...prevSelectedRows, documentId]
    );
  };

  // New handler to select/deselect all rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // When checked, select all documentIds from the filteredData
      const allDocumentIds = filteredData.map((data) => data.documentId);
      setSelectedRows(allDocumentIds);
    } else {
      // When unchecked, clear selection
      setSelectedRows([]);
    }
  };

  const handleSort = (option) => {
    let sortedData = [...filteredData];
    switch (option) {
      case "latest":
        sortedData.sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time));
        break;
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "gearId":
        sortedData.sort((a, b) => a.gearId.localeCompare(b.gearId));
        break;
      default:
        break;
    }
    setFilteredData(sortedData);
    setSortOption(option);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Utility function to delete all documents in a subcollection
  const deleteSubcollection = async (parentDocRef, subcollectionName) => {
    const subcollectionRef = collection(parentDocRef, subcollectionName);
    const subSnapshot = await getDocs(subcollectionRef);
    const deletePromises = subSnapshot.docs.map((subDoc) =>
      deleteDoc(subDoc.ref)
    );
    return Promise.all(deletePromises);
  };

  const handleDeleteSelected = async () => {
    try {
      for (const documentId of selectedRows) {
        const docRef = doc(db, "personnelRecords", documentId);
        // Delete subcollections first
        await deleteSubcollection(docRef, "notifications");
        await deleteSubcollection(docRef, "realTimeData");

        // Then delete the parent document
        await deleteDoc(docRef);
      }
      // After deletion, refresh the UI data
      setFilteredData(
        filteredData.filter((data) => !selectedRows.includes(data.documentId))
      );
      setSelectedRows([]); // Clear selected rows
      setIsDropdownOpen(false); // Close dropdown after action
      toast.success("Selected Personnel deleted successfully");
    } catch (error) {
      console.error("Error deleting personnel: ", error);
      toast.error("Error deleting personnel");
    }
  };

  // Handle "View" button click and send data to analytics page
  const handleViewClick = async (documentId, name, date, time) => {  // Using documentId instead of personnelId
    try {
      // Adjust the path to match your Firestore structure
      const realTimeDataRef = collection(db, 'personnelRecords', documentId, 'realTimeData'); // Use documentId here
      const realTimeDataSnapshot = await getDocs(realTimeDataRef);
      const realTimeData = [];
  
      realTimeDataSnapshot.forEach((doc) => {
        realTimeData.push({ id: doc.id, ...doc.data() });
      });
  
      // Navigate to analytics and pass data
      navigate('/analytics', { state: { realTimeData, name: name, date: date, time: time } });
    } catch (error) {
      toast.error("Error fetching real-time data:", error);
    }
  };
  

  return (
    <div className="p-4 min-h-screen flex flex-col font-montserrat">
      <HeaderSection title="HISTORY" />

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <BodyCard>
        <div className="bg-bfpNavy rounded-lg shadow-md p-6">
          <div className="relative overflow-x-auto">
            <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center text-white font-medium rounded-lg text-sm px-3 py-1.5 focus:outline-none border bg-bfpNavy"
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

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-50 mt-2 bg-bfpNavy rounded-lg shadow-lg w-48 z-10">
                    <button
                      onClick={() => handleSort("latest")}
                      className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                    >
                      Latest Date
                    </button>
                    <button
                      onClick={() => handleSort("name")}
                      className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                    >
                      Sort by Name
                    </button>
                    <button
                      onClick={() => handleSort("gearId")}
                      className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                    >
                      Sort by Gear ID 
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="w-full text-left text-white px-4 py-2 hover:bg-searchTable"
                    >
                      Delete Selected data
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for users"
                  className="block p-2 pl-10 text-sm text-white bg-bfpNavy border border-white rounded-lg w-80"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <img src={searchIcon} alt="Search" className="w-4 h-4" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-white text-center py-6">Loading...</div>
            ) : filteredData.length === 0 ? (
              <div className="text-white text-center py-6">No personnel data found</div>
            ) : (
              <table className="w-full text-sm text-left text-white bg-bfpNavy">
                <thead className="text-xs uppercase bg-searchTable text-white">
                  <tr>
                    <th className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-green"
                        onChange={handleSelectAll}
                        checked={
                          filteredData.length > 0 &&
                          selectedRows.length === filteredData.length
                        }
                      />
                    </th>
                    <th className="px-6 py-3">Gear ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Total Notifications</th>
                    <th className="px-6 py-3">Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <React.Fragment key={index}>
                      <tr
                        onDoubleClick={() => handleRowClick(data)}
                        className="border-b bg-bfpNavy hover:bg-searchTable cursor-pointer"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-green"
                            checked={selectedRows.includes(data.documentId)}
                            onChange={() => handleSelectRow(data.documentId)}
                          />
                        </td>
                        <td className="px-6 py-3">{data.gearId}</td>
                        <td className="px-6 py-3">{data.name}</td>
                        <td className="px-6 py-3">{data.date}</td>
                        <td className="px-6 py-3">{data.time}</td>
                        <td className="px-6 py-3">{data.totalNotifications}</td>
                        <td className="px-6 py-3 flex justify-start">
                          <button onClick={() => handleViewClick(data.documentId, data.name, data.date, data.time)}
                          className="bg-bfpOrange px-4 py-2 rounded-lg transform transition duration-300 hover:scale-105">View</button>
                        </td>
                      </tr>

                      {expandedPersonnel === data && (
                        <tr className="bg-bfpNavy">
                          <td colSpan="7">
                            <HistoryTable selectedPersonnel={data} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </BodyCard>
    </div>
  );
}

export default HistoryBody;