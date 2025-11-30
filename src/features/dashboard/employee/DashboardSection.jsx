import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiCalendar, FiDollarSign, FiClock, FiCheckCircle, 
  FiAlertTriangle, FiX, FiActivity 
} from 'react-icons/fi';
import { FaRegClock, FaUserCircle } from 'react-icons/fa';

// Import your Redux actions
import { 
  fetchEmployeeBookings, 
  updateBookingStatus 
} from '../../booking/bookingSlice'; 

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { userBookings, loading } = useSelector((state) => state.employeeNearby);

  // --- Local State for "Completed" Logic ---
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [hoursInput, setHoursInput] = useState('');

  // Fetch bookings on load
  useEffect(() => {
    dispatch(fetchEmployeeBookings());
  }, [dispatch]);

  // --- 1. Handle Status Change from Dropdown ---
  const handleStatusChange = (book_id, newStatus) => {
    // If user selects "Completed", we must ask for working hours first
    if (newStatus === 'completed') {
      setSelectedBookingId(book_id);
      setHoursInput(''); // reset input
      setShowHoursModal(true);
    } else {
      // For all other statuses (Pending, In Progress, Incomplete, Canceled), update immediately
      dispatch(updateBookingStatus({ 
        book_id, 
        status: newStatus, 
        working_hours: 0 // Default to 0 if not completed
      }));
    }
  };

  // --- 2. Submit "Completed" Status with Hours ---
  const submitCompletion = () => {
    if (selectedBookingId && hoursInput) {
      dispatch(updateBookingStatus({ 
        book_id: selectedBookingId, 
        status: 'completed', 
        working_hours: hoursInput 
      }));
      closeModal();
    }
  };

  const closeModal = () => {
    setShowHoursModal(false);
    setSelectedBookingId(null);
    setHoursInput('');
  };

  // --- Stats Calculation ---
  const stats = [
    { label: 'Total Jobs', value: userBookings.length, icon: <FiCalendar />, color: 'bg-blue-100 text-blue-600' },
    { 
      label: 'Earnings', 
      value: `$${userBookings.filter(b => b.status === 'completed' && b.amount).reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(0)}`, 
      icon: <FiDollarSign />, 
      color: 'bg-green-100 text-green-600' 
    },
    { label: 'Pending', value: userBookings.filter(b => b.status === 'pending').length, icon: <FiClock />, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Active', value: userBookings.filter(b => b.status === 'in_Progress').length, icon: <FiActivity />, color: 'bg-purple-100 text-purple-600' },
  ];

  // Helper for Status Colors in Dropdown
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-blue-600 font-semibold';
      case 'in_Progress': return 'text-purple-600 font-semibold';
      case 'completed': return 'text-green-600 font-bold';
      case 'canceled': return 'text-red-500';
      case 'incompleted': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Job Management</h2>
        <p className="text-gray-500">Update status manually for your appointments</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mr-4`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
             {userBookings.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Job Detail</th>
                <th className="p-4">Date</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Update Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
              ) : (
                userBookings.map((booking) => (
                  <tr key={booking.book_id} className="hover:bg-gray-50 transition">
                    
                    {/* Client */}
                    <td className="p-4">
                      <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border">
                        <img
                          src={booking.client_user.profile_image}
                          alt={booking.client_name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = "/default-profile.png"}
                        />
                      </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking?.client_name}</p>
                          <p className="text-xs text-gray-500">Email : {booking.client_user.email}</p>
                          <p className="text-xs text-gray-500">Phone : {booking.client_user.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Job */}
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{booking.job}</p>
              
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaRegClock className="mr-2 text-gray-400" />
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 pl-6">
                        {new Date(booking.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>

                    {/* Status Display */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                         booking.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                         booking.status === 'in_Progress' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                         booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                         'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Manual Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.book_id, e.target.value)}
                        className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full cursor-pointer ${getStatusColor(booking.status)}`}
                        disabled={loading} // Prevent changes while loading
                      >
                        {/* <option value="pending" className="text-gray-600">Pending</option>
                        <option value="confirmed" className="text-blue-600">Confirmed</option> */}
                        <option value="in_Progress" className="text-purple-600">In Progress</option>
                        <option value="incompleted" className="text-orange-500">Incomplete</option>
                        <option value="canceled" className="text-red-600">Canceled</option>
                        <option value="completed" className="text-green-600 font-bold">Completed</option>
                      </select>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal: Working Hours Input (Only for 'Completed') --- */}
      {showHoursModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" />
                Complete Job
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              To mark this job as completed, please enter the total working hours.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours Worked</label>
              <input
                type="number"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                placeholder="e.g. 2.5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={submitCompletion}
                disabled={!hoursInput}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                   hoursInput ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;