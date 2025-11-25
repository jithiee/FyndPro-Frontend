import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaCalendarDay,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeBookings,
  updateBookingStatus,
  optimisticUpdateBookingStatus,
} from "../../booking/bookingSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Fix Leaflet Marker Icons ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const BookingStatic = () => {
  const dispatch = useDispatch();
  const { userBookings: bookingsFromStore = [], loading } = useSelector(
    (state) => state.employeeNearby
  );
  const [localBookings, setLocalBookings] = useState([]);

  // Sync Redux -> Local
  useEffect(() => {
    setLocalBookings(Array.isArray(bookingsFromStore) ? bookingsFromStore : []);
  }, [bookingsFromStore]);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchEmployeeBookings());
  }, [dispatch]);

  // Formatters
  const formatBookingDate = (isoDate) => {
    if (!isoDate) return { date: "—", time: "—" };
    const d = new Date(isoDate);
    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getCoords = (item) => {
    const lat = parseFloat(item?.latitude);
    const lng = parseFloat(item?.longitude);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
    return [9.9312, 76.2673]; // Fallback
  };

  const normalizeStatus = (s) => (typeof s === "string" ? s.toLowerCase() : "");

  // Stats Calculation
  const pendingCount = localBookings.filter(
    (b) => normalizeStatus(b.status) === "pending"
  ).length;
  const confirmedCount = localBookings.filter(
    (b) =>
      ["confirmed", "accepted"].includes(normalizeStatus(b.status))
  ).length;
  const canceledCount = localBookings.filter(
    (b) =>
      ["canceled", "rejected"].includes(normalizeStatus(b.status))
  ).length;

  // Actions
  const handleStatusChange = async (book_id, statusToSet) => {
    const prevLocal = [...localBookings];
    
    // Optimistic Update
    setLocalBookings((prev) =>
      prev.map((b) => (b.book_id === book_id ? { ...b, status: statusToSet } : b))
    );
    dispatch(optimisticUpdateBookingStatus({ book_id, status: statusToSet }));

    try {
      const res = await dispatch(
        updateBookingStatus({ book_id, status: statusToSet })
      ).unwrap();

      toast.success(
        statusToSet === "confirmed" ? "Booking Confirmed" : "Booking Cancelled",
        { theme: "colored" }
      );

      // Sync real response
      setLocalBookings((prev) =>
        prev.map((b) => (b.book_id === res.book_id ? { ...b, ...res } : b))
      );
    } catch (err) {
      setLocalBookings(prevLocal);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 font-sans">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      {/* --- Header Section --- */}
      <header className="bg-white border-b border-slate-200 px-6 py-6 mb-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Booking Dashboard
            </h1>
            <p className="text-slate-500 text-sm ">
              Manage your schedule and client requests
            </p>
          </div>
          
          {/* Quick Stats Row */}
          <div className="flex gap-3">
            <StatBadge label="Pending" count={pendingCount} color="bg-amber-100 text-amber-700 border-amber-200" />
            <StatBadge label="Confirmed" count={confirmedCount} color="bg-emerald-100 text-emerald-700 border-emerald-200" />
            <StatBadge label="Canceled" count={canceledCount} color="bg-rose-100 text-rose-700 border-rose-200" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto px-4">
        
        {loading && (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
             <p>Loading your schedule...</p>
           </div>
        )}

        {!loading && localBookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
              <FaCalendarDay />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No Bookings Found</h3>
            <p className="text-slate-500">You don't have any requests at the moment.</p>
          </div>
        )}

        <div className="space-y-6">
          {localBookings.map((item) => {
            const coords = getCoords(item.client_user);
            const status = normalizeStatus(item.status);
            const { date, time } = formatBookingDate(item.booking_date);

            return (
              <div
                key={item.book_id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Left Column: Details */}
                  <div className="p-6 lg:w-3/5 flex flex-col justify-between relative">
                    {/* Status Pill */}
                    <div className="absolute top-6 right-6">
                      <StatusPill status={status} />
                    </div>

                    <div>
                      {/* Client Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shrink-0">
                          <FaUserCircle />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {item.client_user?.full_name || item.client_name || "Unknown Client"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                             <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">ID: #{item.book_id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Grid Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2 mb-6">
                        <InfoRow icon={FaEnvelope} label="Email" value={item.client_user?.email} />
                        <InfoRow icon={FaPhoneAlt} label="Phone" value={item.client_user?.phone} />
                        <InfoRow icon={FaCalendarDay} label="Date" value={date} />
                        <InfoRow icon={FaClock} label="Time" value={time} />
                      </div>
                    </div>

                    {/* Action Footer */}
                    {status === "pending" ? (
                      <div className="pt-6 border-t border-slate-100 flex gap-3">
                        <button
                          onClick={() => handleStatusChange(item.book_id, "confirmed")}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                          <FaCheck /> Accept Request
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.book_id, "canceled")}
                          className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FaTimes /> Decline
                        </button>
                      </div>
                    ) : (
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-sm text-slate-400 italic">
                          This booking has been processed.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Map */}
                  <div className="h-64 lg:h-auto lg:w-2/5 bg-slate-100 relative border-t lg:border-t-0 lg:border-l border-slate-200">
                     <MapContainer
                        center={coords}
                        zoom={14}
                        scrollWheelZoom={false} // Prevent accidental scrolling
                        style={{ height: "100%", width: "100%", minHeight: "250px", zIndex: 10 }}
                      >
                        <TileLayer 
                          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <Marker position={coords}>
                          <Popup>Client Location</Popup>
                        </Marker>
                      </MapContainer>
                      
                      {/* Location Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-slate-200 text-xs z-[400] flex items-center justify-between">
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-rose-500"/> Location
                        </span>
                        <span className="text-slate-500 font-mono">
                          {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
                        </span>
                      </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components for Clean Code ---

const StatBadge = ({ label, count, color }) => (
  <div className={`flex flex-col md:flex-row items-baseline md:items-center gap-1 md:gap-2 px-3 py-1.5 rounded-lg border ${color}`}>
    <span className="font-bold text-lg">{count}</span>
    <span className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</span>
  </div>
);

const StatusPill = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
    canceled: "bg-slate-100 text-slate-500 border-slate-200 line-through decoration-slate-400",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
  };

  const defaultStyle = "bg-slate-100 text-slate-600";
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="text-slate-400 mt-0.5 text-sm" />
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      <p className="text-sm text-slate-800 font-medium break-all">{value || "—"}</p>
    </div>
  </div>
);

export default BookingStatic;












// import React, { useEffect, useState, useMemo } from "react";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaCalendarAlt,
//   FaUser,
//   FaBriefcase,
//   FaMapMarkerAlt,
//   FaPhoneAlt,
//   FaEnvelope,
// } from "react-icons/fa";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchEmployeeBookings,
//   updateBookingStatus,
//   optimisticUpdateBookingStatus,
// } from "../../booking/bookingSlice";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // --- Leaflet Icon Fix ---
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // --- Helper Component to Update Map View ---
// const MapUpdater = ({ center }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     if (Array.isArray(center) && center.length === 2) {
//       // Slightly higher zoom and smoother animation
//       map.flyTo(center, 15, { duration: 1.2, easeLinearity: 0.25 });
//     }
//   }, [center, map]);

//   return null;
// };

// const BookingStatic = () => {
//   const dispatch = useDispatch();
//   const { userBookings: bookingsFromStore = [], loading } = useSelector((state) => state.employeeNearby);

//   // Local state for optimistic UI
//   const [localBookings, setLocalBookings] = useState([]);
//   const [selectedId, setSelectedId] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Sync Redux to Local
//   useEffect(() => {
//     const validBookings = Array.isArray(bookingsFromStore) ? bookingsFromStore : [];
//     setLocalBookings(validBookings);
    
//     // Auto-select first booking if available and nothing currently selected
//     if (!selectedId && validBookings.length > 0) {
//       setSelectedId(validBookings[0].book_id);
//     }
//   }, [bookingsFromStore]);

//   useEffect(() => {
//     dispatch(fetchEmployeeBookings());
//   }, [dispatch]);

//   // --- Derived Data ---
//   const normalizeStatus = (s) => (typeof s === "string" ? s.toLowerCase() : "pending");

//   const filteredBookings = useMemo(() => {
//     if (filterStatus === "all") return localBookings;
//     return localBookings.filter((b) => normalizeStatus(b.status) === filterStatus);
//   }, [localBookings, filterStatus]);

//   const selectedBooking = localBookings.find((b) => b.book_id === selectedId) || localBookings[0];

//   const stats = {
//     pending: localBookings.filter((b) => normalizeStatus(b.status) === "pending").length,
//     confirmed: localBookings.filter((b) => ["confirmed", "accepted"].includes(normalizeStatus(b.status))).length,
//     canceled: localBookings.filter((b) => ["canceled", "rejected"].includes(normalizeStatus(b.status))).length,
//   };

//   // --- FIXED: Robust Coordinate Parser ---
//   const getCoords = (item) => {
//     // Default Fallback (Kochi, India)
//     const DEFAULT_LAT = 9.9312;
//     const DEFAULT_LNG = 76.2673;

//     if (!item) return [DEFAULT_LAT, DEFAULT_LNG];

//     // 1. Extract data (Handle string "9.94..." from JSON)
//     let latStr = item.latitude || item.lat;
//     let lngStr = item.longitude || item.lng;

//     // 2. Parse to Float
//     const lat = parseFloat(latStr);
//     const lng = parseFloat(lngStr);

//     // 3. Validate: Must be a number, not NaN, and not 0 (unless strictly intended)
//     const isValid = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

//     return isValid ? [lat, lng] : [DEFAULT_LAT, DEFAULT_LNG];
//   };

//   const handleStatusChange = async (book_id, statusToSet) => {
//     const prevLocal = [...localBookings];
    
//     setLocalBookings((prev) =>
//       prev.map((b) => (b.book_id === book_id ? { ...b, status: statusToSet } : b))
//     );

//     dispatch(optimisticUpdateBookingStatus({ book_id, status: statusToSet }));

//     try {
//       const res = await dispatch(updateBookingStatus({ book_id, status: statusToSet })).unwrap();
//       toast.success(statusToSet === "confirmed" ? "Booking Accepted" : "Booking Canceled");
//       setLocalBookings((prev) => prev.map((b) => (b.book_id === res.book_id ? { ...b, ...res } : b)));
//     } catch (err) {
//       setLocalBookings(prevLocal);
//       toast.error("Action failed. Please try again.");
//     }
//   };

//   const formatBookingDate = (isoDate) => {
//     if (!isoDate) return { date: "—", time: "—" };
//     const d = new Date(isoDate);
//     if (isNaN(d.getTime())) return { date: "Invalid Date", time: "" }; 
//     return {
//       date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
//       time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
//     };
//   };

//   // --- UI Components ---
//   const StatusBadge = ({ status, size = "sm" }) => {
//     const s = normalizeStatus(status);
//     const config = {
//       pending: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
//       confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
//       accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
//       canceled: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
//       rejected: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
//     };
    
//     const activeClass = config[s] || "bg-gray-50 text-gray-600 border-gray-200";
//     const sizeClass = size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

//     return (
//       <span className={`inline-flex items-center rounded-full font-medium border ring-1 ring-inset ${activeClass} ${sizeClass} capitalize`}>
//         {s}
//       </span>
//     );
//   };

//   const currentCoords = getCoords(selectedBooking);

//   return (
//     <div className="h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden font-sans">
//       <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="colored" />

//       {/* --- Top Navigation / Stats Bar --- */}
//       <header className="bg-white border-b border-slate-200 px-6 py-4 flex-none z-10 shadow-sm">
//         <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workstation</h1>
//             <p className="text-slate-500 text-sm">Manage your appointments</p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {[{ label: "Pending", count: stats.pending, color: "bg-blue-500" },
//               { label: "Confirmed", count: stats.confirmed, color: "bg-emerald-500" },
//               { label: "Canceled", count: stats.canceled, color: "bg-rose-500" }]
//             .map((stat) => (
//               <div key={stat.label} className="flex items-center bg-slate-100 rounded-lg px-4 py-2 border border-slate-200">
//                 <div className={`w-2 h-2 rounded-full ${stat.color} mr-2`}></div>
//                 <div className="flex flex-col leading-none">
//                   <span className="text-xs text-slate-500 uppercase font-bold">{stat.label}</span>
//                   <span className="text-lg font-bold text-slate-800">{stat.count}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </header>

//       {/* --- Main Content Area --- */}
//       <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        
//         {/* --- Left Sidebar --- */}
//         <aside className="w-full md:w-1/3 lg:w-[400px] bg-white border-r border-slate-200 flex flex-col">
//           <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
//             {['all', 'pending', 'confirmed', 'canceled'].map(f => (
//               <button
//                 key={f}
//                 onClick={() => setFilterStatus(f)}
//                 className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
//                   filterStatus === f 
//                     ? "bg-slate-800 text-white shadow-md" 
//                     : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
//                 }`}
//               >
//                 {f.charAt(0).toUpperCase() + f.slice(1)}
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
//             {loading && <div className="p-8 text-center text-slate-400">Syncing data...</div>}
//             {!loading && filteredBookings.length === 0 && (
//               <div className="p-8 text-center flex flex-col items-center text-slate-400">
//                 <FaBriefcase className="text-4xl mb-2 opacity-20" />
//                 <p>No bookings found</p>
//               </div>
//             )}

//             {filteredBookings.map((booking) => {
//               const isSelected = selectedId === booking.book_id;
//               const { date } = formatBookingDate(booking.booking_date);
              
//               return (
//                 <div
//                   key={booking.book_id}
//                   onClick={() => setSelectedId(booking.book_id)}
//                   className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border relative overflow-hidden ${
//                     isSelected 
//                       ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20 z-10" 
//                       : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
//                   }`}
//                 >
//                   {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
//                   <div className="flex justify-between items-start mb-2 pl-2">
//                     <div>
//                       <h3 className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
//                         {booking.client_user?.full_name || booking.client || "Client Name"}
//                       </h3>
//                       <p className="text-xs text-slate-500 truncate max-w-[180px]">{booking.job || "General Service"}</p>
//                     </div>
//                     <StatusBadge status={booking.status} />
//                   </div>
//                   <div className="flex items-center gap-2 pl-2 mt-3 text-xs text-slate-400">
//                     <FaCalendarAlt /> {date}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </aside>

//         {/* --- Right Panel --- */}
//         <main className="hidden md:flex flex-1 flex-col bg-slate-50 h-full overflow-y-auto relative">
//           {selectedBooking ? (
//             <div className="flex flex-col h-full">
              
//               {/* Header */}
//               <div className="bg-white p-6 border-b border-slate-200 shadow-sm flex justify-between items-start z-20">
//                 <div>
//                    <div className="flex items-center gap-3 mb-1">
//                       <h2 className="text-2xl font-bold text-slate-800">
//                         {selectedBooking.client_user?.full_name || "Client Name"}
//                       </h2>
//                       <StatusBadge status={selectedBooking.status} size="lg" />
//                    </div>
//                    <p className="text-slate-500 flex items-center gap-2 text-sm">
//                       <FaBriefcase className="text-indigo-500" /> {selectedBooking.job}
//                    </p>
//                 </div>
                
//                 {/* Actions */}
//                 {normalizeStatus(selectedBooking.status) === "pending" && (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleStatusChange(selectedBooking.book_id, "canceled")}
//                       className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-medium text-sm transition-colors flex items-center gap-2"
//                     >
//                       <FaTimesCircle /> Decline
//                     </button>
//                     <button
//                       onClick={() => handleStatusChange(selectedBooking.book_id, "confirmed")}
//                       className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-200 font-medium text-sm transition-all flex items-center gap-2"
//                     >
//                       <FaCheckCircle /> Accept Job
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto">
                
//                 <div className="xl:col-span-1 space-y-4">
//                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
//                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Schedule</h4>
//                       <div className="flex items-center gap-3 text-slate-700">
//                         <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
//                           <FaCalendarAlt />
//                         </div>
//                         <div>
//                           <p className="font-medium">{formatBookingDate(selectedBooking.booking_date).date}</p>
//                           <p className="text-sm text-slate-500">{formatBookingDate(selectedBooking.booking_date).time}</p>
//                         </div>
//                       </div>
//                    </div>

//                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
//                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact</h4>
//                       <div className="space-y-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                             <FaEnvelope size={12} />
//                           </div>
//                           <p className="text-sm text-slate-600 break-all">{selectedBooking.client_user?.email || "No Email"}</p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
//                             <FaPhoneAlt size={12} />
//                           </div>
//                           <p className="text-sm text-slate-600">{selectedBooking.client_user?.phone || "No Phone"}</p>
//                         </div>
//                       </div>
//                    </div>
//                 </div>

//                 {/* Map Section */}
//                 <div className="xl:col-span-2 h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
//                   <MapContainer 
//                     /* Key is crucial: It forces the map to re-render when booking changes */
//                     key={selectedBooking.book_id}
//                     center={currentCoords} 
//                     zoom={15} 
//                     style={{ height: "100%", width: "100%" }}
//                     scrollWheelZoom={false}
//                   >
//                     <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    
//                     {/* Helper to animate pan/zoom */}
//                     <MapUpdater center={currentCoords} />
                    
//                     <Marker position={currentCoords}>
//                       <Popup className="font-sans text-center">
//                         <div className="p-1">
//                             <strong className="block mb-1 text-indigo-700">{selectedBooking.job}</strong>
//                             <span className="text-slate-500">{selectedBooking.location}</span>
//                         </div>
//                       </Popup>
//                     </Marker>
//                   </MapContainer>
                  
//                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-white/50 text-xs text-slate-600 z-[500]">
//                     <strong className="block text-slate-900 mb-0.5">Location Data</strong>
//                     Lat: {currentCoords[0].toFixed(4)}, Lng: {currentCoords[1].toFixed(4)}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//                <FaMapMarkerAlt className="text-6xl text-slate-200 mb-4" />
//                <p className="text-lg font-medium text-slate-500">Select a booking to view details</p>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default BookingStatic;

