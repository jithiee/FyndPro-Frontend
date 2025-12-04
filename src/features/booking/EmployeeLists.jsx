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

  //Search & Filter States
  const [searchText, setSearchText] = useState("");
  const [availability, setAvailability] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    dispatch(fetchEmployeeNearbyLists());
  }, [dispatch]);

  //Apply Search & Filters
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
                        .slice(0, 3) 
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                   
                        {(Array.isArray(emp.employee_profile?.skills) || emp.employee_profile?.skills?.split(",").length > 3) && (
                           <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">...</span>
                        )}
                    </div>
                  </div>

       
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

