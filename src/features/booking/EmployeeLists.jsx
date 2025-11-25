import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaBriefcase,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";
import { MdVerified, MdOutlineLocationOn } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeNearbyLists } from "./bookingSlice";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EmployeeLists = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const dispatch = useDispatch();
  const { employeeList, loading } = useSelector(
    (state) => state.employeeNearby
  );

  // 🔍 Search & Filter States
  const [searchText, setSearchText] = useState("");
  const [availability, setAvailability] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    dispatch(fetchEmployeeNearbyLists());
  }, [dispatch]);

  // 🔎 Apply Search & Filters
  const filteredEmployees = (employeeList || []).filter((emp) => {
    const nameMatch = emp.full_name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const availabilityMatch =
      availability === "all"
        ? true
        : availability === "available"
        ? emp.employee_profile?.available
        : !emp.employee_profile?.available;

    const ratingMatch =
      (emp.employee_profile?.average_rating || 0) >= minRating;

    const locationMatch = (emp.location || "")
      .toLowerCase()
      .includes(locationFilter.toLowerCase());

    return nameMatch && availabilityMatch && ratingMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ====== HEADER SECTION ====== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Find Professionals
            </h1>
            <p className="text-gray-500 mt-1">
              Browse highly rated employees nearby for your needs.
            </p>
          </div>
        </div>

        {/* ====== CONTROL PANEL (SEARCH + FILTERS) ====== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Location Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlineLocationOn className="text-gray-400 group-focus-within:text-blue-500 transition-colors text-lg" />
              </div>
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Availability Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">Any Status</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable</option>
              </select>
              {/* Custom Arrow */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>

            {/* Rating Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSortAmountDown className="text-gray-400" />
              </div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
              >
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* ====== LOADING STATE ====== */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* ====== EMPTY STATE ====== */}
        {!loading && filteredEmployees.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No professionals found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* ====== GRID LAYOUT ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEmployees.map((emp, index) => {
            const isAvailable = emp.employee_profile?.available;
            const rating = emp.employee_profile?.average_rating || 0;
            
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                
                {/* Card Header / Profile Image */}
                <div className="pt-8 pb-4 px-6 flex flex-col items-center relative">
                  {/* Status Badge (Top Right) */}
                  <div
                    className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      isAvailable
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    {isAvailable ? "Available" : "Busy"}
                  </div>

                  <div className="relative">
                    <Link to={`/employeedashboard/${emp.id}`}>
                      <div className={`p-1 rounded-full border-2 ${isAvailable ? 'border-emerald-400' : 'border-gray-200'}`}>
                        <img
                          src={
                           `${BASE_URL}${emp.profile_image}`
                              
                          }
                          alt={emp.full_name}
                          className="w-24 h-24 rounded-full object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                    </Link>
                    <MdVerified className="absolute bottom-1 right-1 text-blue-500 bg-white rounded-full text-xl ring-2 ring-white" />
                  </div>

                  <div className="text-center mt-3">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {emp.full_name}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      {emp.employee_profile?.title || "Professional"}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center items-center gap-1 mt-1">
                      <FaStar className="text-amber-400 text-sm" />
                      <span className="text-sm font-bold text-gray-700">{rating}</span>
                      <span className="text-xs text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="w-full border-t border-gray-100"></div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 py-4 bg-gray-50/50">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Exp</span>
                        <span className="text-sm font-bold text-gray-800">{emp.employee_profile?.experience || 0} yrs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Rate</span>
                        <span className="text-sm font-bold text-emerald-600">₹{emp.employee_profile?.hourly_rate || 0}/hr</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-2 text-center">
                         <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Loc</span>
                        <span className="text-sm font-bold text-gray-800 truncate w-full">{emp.location || 'N/A'}</span>
                    </div>
                </div>

                <div className="w-full border-t border-gray-100"></div>

                {/* Details Body */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  
                  {/* Skills */}
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(Array.isArray(emp.employee_profile?.skills)
                        ? emp.employee_profile.skills
                        : emp.employee_profile?.skills?.split(",") || []
                      )
                        .slice(0, 3) // Limit to 3 tags to keep card size consistent
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {/* Show +more if many skills */}
                        {(Array.isArray(emp.employee_profile?.skills) || emp.employee_profile?.skills?.split(",").length > 3) && (
                           <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">...</span>
                        )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/bookingview/${emp.employee_profile?.id}`} className="block mt-auto">
                    <button
                      disabled={!isAvailable}
                      className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-semibold text-sm shadow-sm
                      ${
                        isAvailable
                          ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          Book Now <BiTimeFive />
                        </>
                      ) : (
                        "Currently Unavailable"
                      )}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLists;


// import React, { useEffect } from 'react';
// import {
//   FaStar,
//   FaDollarSign,
//   FaClock,
//   FaBriefcase,
//   FaMapMarkerAlt,
// } from 'react-icons/fa';
// import { MdVerified } from 'react-icons/md';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchEmployeeNearbyLists } from './bookingSlice';
// import { Link } from "react-router-dom";
// import { ArrowLeft, Home } from 'lucide-react';

// const EmployeeLists = () => {

//   const BASE_URL = "http://127.0.0.1:8000";

//   const dispatch = useDispatch();
//   const { employeeList, loading } = useSelector((state) => state.employeeNearby);


//   useEffect(() => {

//     dispatch(fetchEmployeeNearbyLists());
//   }, [dispatch]);

//   if (loading) return <p className="p-10">Loading nearby employees...</p>;
//   if (!employeeList || employeeList.length === 0)
//     return <p className="p-10">No nearby employees found.</p>;

//   return (
//     <div className="p-10">
//       <Link to='/'>
//                  <button className="mb-10 cursor-pointer  group relative inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-lg overflow-hidden transition-all hover:pr-10">
//         {/* Background Gradient Hover */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>

//         {/* Content */}
//         <span className="relative z-10 flex items-center gap-2 font-medium">
//           <ArrowLeft size={18} />
//           Back to home
//         </span>

//         {/* Hidden Decorator appearing on hover */}
//         <span className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
//           •
//         </span>
//       </button>

//       </Link>



//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">

//         {employeeList.map((emp, index) => (
//           <div
//             key={index}
//             className="relative max-w-xs bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300"
//           >

//             <div
//               className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full flex items-center 
//               ${emp.employee_profile?.available
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//                 }`}
//             >
//               <span
//                 className={`w-2 h-2 rounded-full mr-2 
//                 ${emp.employee_profile?.available ? "bg-green-500" : "bg-red-500"}
//               `}
//               ></span>

//               {emp.employee_profile?.available ? "Available" : "Unavailable"}
//             </div>


//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center">
//               <div className="relative inline-block">
//                 <Link to={`/employeedashboard/${emp.id}`}>
//                   <img
//                     src={
//                       emp.profile_image
//                         ? `${BASE_URL}${emp.profile_image}`
//                         : "https://randomuser.me/api/portraits/men/75.jpg"
//                     }
//                     alt={emp.full_name}
//                     className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto cursor-pointer"
//                   />
//                 </Link>


//                 <MdVerified className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full p-1 text-lg" />
//               </div>

//               {/* Rating */}
//               <div className="mt-3 flex justify-center items-center">
//                 <div className="flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       className={`text-sm ${i < emp.employee_profile?.average_rating
//                         ? 'text-yellow-400'
//                         : 'text-gray-300'
//                         }`}
//                     />
//                   ))}
//                   <span className="ml-1 text-xs font-semibold text-gray-700">
//                     {emp.employee_profile?.average_rating || 0}
//                   </span>
//                 </div>
//               </div>

//               {/* Name */}
//               <div className="mt-4">
//                 <h2 className="text-xl font-bold text-gray-900">{emp.full_name}</h2>
//                 <p className="text-sm text-gray-600">{emp.employee_profile?.title || "Worker"}</p>
//               </div>
//             </div>

//             {/* Body */}
//             <div className="p-6">
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <FaBriefcase className="text-blue-500 mr-2" />
//                   <span>{emp.employee_profile?.experience || 0} yrs</span>
//                 </div>
//                 {/* <div className="flex items-center text-sm text-gray-600">
//                   <FaDollarSign className="text-green-500 mr-2" />
//                   <span>₹{emp.employee_profile?.hourly_rate || 0}/hr</span>
//                 </div> */}
//                 <div className="flex items-center text-sm text-gray-600">
//                   <span className="text-green-500 mr-2 text-lg">₹</span>
//                   <span>{emp.employee_profile?.hourly_rate || 0}/hr</span>
//                 </div>

//                 <div className="flex items-center text-sm text-gray-600">
//                   <FaClock className="text-purple-500 mr-2" />
//                   <span>Flexible Hours</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" />
//                   <span>{emp.location}</span>
//                 </div>
//               </div>

//               {/* Skills */}
//               <div className="mb-6">
//                 <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</h3>
//                 {/* <div className="flex flex-wrap gap-2">
//                   {(emp.employee_profile?.skills || []).map((skill, i) => (
//                     <span
//                       key={i}
//                       className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div> */}

//                 <div className="flex flex-wrap gap-2">
//                   {(Array.isArray(emp.employee_profile?.skills)
//                     ? emp.employee_profile.skills
//                     : emp.employee_profile?.skills?.split(",") || []
//                   ).map((skill, i) => (
//                     <span
//                       key={i}
//                       className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>

//               </div>

//               {/* Button */}
//               {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center justify-center gap-2"
//               disabled={!emp.employee_profile?.available}
//               >
//                 Book Now
//               </button> */}
//               <Link to={`/bookingview/${emp.employee_profile?.id}`}>


//                 <button
//                   className={`w-full px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center justify-center gap-2 text-white 
//                    ${emp.employee_profile?.available
//                       ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
//                       : "bg-gray-400 cursor-not-allowed opacity-50"
//                     }`}
//                   disabled={!emp.employee_profile?.available}
//                 >
//                   Book Now
//                 </button>
//               </Link>

//             </div>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default EmployeeLists;







