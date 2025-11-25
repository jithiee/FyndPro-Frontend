import React, { useEffect, useMemo } from 'react';
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiMoreVertical,
  FiClock,
  FiHash
} from 'react-icons/fi';
import { HiBriefcase } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../../booking/bookingSlice';
import { PlusCircle } from "lucide-react";
import { Link } from 'react-router-dom';

const DashboardSectionUser = () => {
  const dispatch = useDispatch();
  const { userBookings, loading } = useSelector((state) => state.employeeNearby);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const getDateParts = (isoDate) => {
    if (!isoDate) return { day: '--', month: '---', time: '--:--' };
    const date = new Date(isoDate);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      time: date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      weekday: date.toLocaleString('default', { weekday: 'long' })
    };
  };

  const stats = useMemo(() => {
    const total = userBookings.length;
    const active = userBookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status?.toLowerCase())).length;
    const completed = userBookings.filter(b => b.status?.toLowerCase() === 'completed').length;

    return [
      { label: 'Total Bookings', value: total, icon: FiCalendar },
      { label: 'Active/Upcoming', value: active, icon: FiClock },
      { label: 'Completed', value: completed, icon: HiBriefcase },
    ];
  }, [userBookings]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    const config = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-sky-100 text-sky-700 border-sky-200",
      in_progress: "bg-violet-100 text-violet-700 border-violet-200",
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      canceled: "bg-slate-100 text-slate-600 border-slate-200",
      incompleted: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return config[s] || config.pending;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-slate-800">
      <Link to='/employeelists'>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl
             font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 
             active:scale-95 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Booking
        </button>

      </Link>

      {/* 1. Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Filter/Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking History</h2>
          <p className="text-slate-500 text-sm">Manage your upcoming and past services.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      {/* 3. The "Ticket" List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading bookings...</div>
        ) : userBookings.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p>No bookings found.</p>
          </div>
        ) : (
          userBookings.map((item) => {
            const { day, month, time, weekday } = getDateParts(item.booking_date);

            return (
              <div
                key={item.book_id || Math.random()}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">

                  {/* A. Date Column */}
                  <div className="md:w-32 bg-slate-50 border-r border-slate-100 p-6 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{month}</span>
                    <span className="text-3xl font-bold text-slate-800 my-1">{day}</span>
                    <span className="text-xs text-slate-500">{weekday}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      <FiClock size={10} /> {time}
                    </span>
                  </div>

                  {/* B. Main Content Area */}
                  <div className="flex-1 p-6 flex flex-col justify-between">

                    {/* Top Row: User Info & Job */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.employee_user?.profile_image || "https://via.placeholder.com/150"}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover bg-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-600">
                              Provider  : <span className="font-medium text-slate-900">{item.employee_user?.full_name}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-md">
                            {item.employee_user?.employee_profile?.title}
                          </p>
                          Work  :
                          <span className="text-sm  text-slate-900 leading-tight m-2">
                            {item.job || "Service Request"}
                          </span>

                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`self-start px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusBadge(item.status)}`}>
                        {item.status?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Bottom Row: Logistics & ACTUAL Contact Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100">

                      {/* ID & Price */}
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-400">
                            <FiHash size={14} />
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">ID</span>
                            <span className="font-mono text-sm text-slate-600">#{item.book_id}</span>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 rounded text-emerald-500">
                            <span className="font-bold text-sm">₹</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Rate</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {item.employee_user?.employee_profile?.hourly_rate}/hr
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Details Chips */}
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">

                        {item.employee_user?.phone && (
                          <a
                            href={`tel:${item.employee_user.phone}`}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 group/phone"
                          >
                            <FiPhone size={14} className="text-slate-400 group-hover/phone:text-blue-500" />
                            <span className="text-sm font-medium font-mono">{item.employee_user.phone}</span>
                          </a>
                        )}

                        {item.employee_user?.email && (
                          <a
                            href={`mailto:${item.employee_user.email}`}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 group/mail max-w-[200px]"
                          >
                            <FiMail size={14} className="text-slate-400 group-hover/mail:text-blue-500 shrink-0" />
                            <span className="text-sm font-medium truncate">{item.employee_user.email}</span>
                          </a>
                        )}

                        {/* <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <FiMoreVertical size={18} />
                        </button> */}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardSectionUser;






















// import React, { useEffect } from 'react';
// import { FiCalendar, FiDollarSign, FiStar, FiMessageSquare } from 'react-icons/fi';
// import { FaRegClock } from 'react-icons/fa';
// import { fetchUserBookings } from '../../booking/bookingSlice';

// import { useDispatch, useSelector } from 'react-redux';
// const DashboardSectionUser = () => {
//   const stats = [
//     { label: 'Total Bookings', value: '24', icon: <FiCalendar />, color: 'bg-blue-100 text-blue-600' },
//     { label: 'Total Payed', value: '$2,450', icon: <FiDollarSign />, color: 'bg-green-100 text-green-600' },

//   ];


//   const dispatch = useDispatch()
//   const { userBookings, loading } = useSelector((state) => state.employeeNearby);


//   const formatBookingDate = (isoDate) => {
//     const date = new Date(isoDate);

//     const optionsDate = { month: "long", day: "numeric" };
//     const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };

//     const formattedDate = date.toLocaleDateString("en-US", optionsDate);
//     const formattedTime = date.toLocaleTimeString("en-US", optionsTime);

//     return `${formattedDate} • ${formattedTime}`;
//   };


//   useEffect(() => {
//     dispatch(fetchUserBookings());

//   }, [dispatch]);

//   const statusStyles = {
//     pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
//     confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
//     in_progress: "bg-purple-100 text-purple-700 border border-purple-200",
//     completed: "bg-green-100 text-green-700 border border-green-200",
//     incompleted: "bg-red-100 text-red-700 border border-red-200",
//     canceled: "bg-gray-200 text-gray-700 border border-gray-300",
//   };


//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
//               {stat.icon}
//             </div>
//             <h3 className="text-gray-500 text-sm">{stat.label}</h3>
//             <p className="text-2xl font-bold">{stat.value}</p>
//           </div>
//         ))}
//       </div>
//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold"> Bookings Details</h3>
//           <button className=" text-sm font-medium">View Status</button>
//         </div>

//         <div className="space-y-4">
//           {userBookings.map((item) => (
//             <div
//               key={item}
//               className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white"
//             >
//               {/* Left Section */}
//               <div className="flex items-center gap-5">
//                 <img
//                   src={item.employee_user?.profile_image}
//                   alt=""
//                   className="w-16 h-16 rounded-full object-cover shadow-md"
//                 />

//                 <div className="space-y-1">
//                   <h4 className="font-semibold text-gray-900 text-lg">{item?.employee_user?.full_name}</h4>
//                   <p className="text-sm text-gray-500">{item?.employee_user?.employee_profile?.title}</p>

//                   <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
//                     <FaRegClock className="text-gray-400" />
//                     <span>Booking Date : {formatBookingDate(item.booking_date)}</span>
//                   </div>

//                   {/* Booking ID */}
//                   <p className="text-xs text-gray-400 mt-1">
//                     Booking ID: <span className="font-medium text-gray-500">{item.book_id}</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Email : <span className="font-medium text-gray-500">{item?.employee_user?.email}</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Phone Number : <span className="font-medium text-gray-500">{item?.employee_user?.phone}</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Hourly Rate : <span className="font-medium text-gray-500">{item?.employee_user?.employee_profile?.hourly_rate}/hr</span>
//                   </p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Job : <span className="font-medium text-gray-500">{item?.job}</span>
//                   </p>



//                 </div>
//               </div>

//               {/* Divider (Mobile Only) */}
//               <div className="my-4 md:hidden border-t border-gray-200"></div>

//               {/* Right Section */}
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-600 font-medium">Status:</span>

//                 <span
//                     className={`px-4 py-1.5 font-medium rounded-full text-sm shadow-sm
//                     ${statusStyles[item.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}
//                   `}
//                 >
//                   {item.status?.replace("_", " ")}
//                 </span>
//               </div>




//             </div>
//           ))}
//         </div>


//       </div>
//     </div>
//   );
// };

// export default DashboardSectionUser;

