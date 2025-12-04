import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { bookingCreatetionByUser } from "../booking/bookingSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, FileText, CheckCircle, Loader2, User, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const BookingForm = ({ employee }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [formData, setFormData] = useState({
    booking_date: "",
    job: "",
    employee_id: employeeId,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.booking_date || !formData.job) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(bookingCreatetionByUser(formData)).unwrap();
      toast.success("Booking request sent successfully!");

      setTimeout(() => {
        navigate("/userdashboard");
      }, 1500);
    } catch (err) {
      toast.error(err?.error || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-8 mb-16 px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="colored" />

      {/* HEADER SECTION */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div>
          <Link
            to="/employeelists"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Find Professionals
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Book Professionals</h1>
          <p className="text-gray-500 mt-1">Browse highly rated employees nearby for your needs.</p>
        </div>
      </motion.div>

      {/* MAIN CARD */}
      <motion.div
        className="bg-white shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden border border-slate-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* CARD HEADER */}
        <motion.div
          className="bg-slate-900 px-8 py-8 text-white relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Confirm Booking</h1>
              <p className="text-slate-400 mt-2 text-sm">
                Please provide the details for your service request below.
              </p>
            </div>

            <div className="hidden md:block bg-slate-800 p-3 rounded-xl border border-slate-700">
              <ShieldCheck className="text-green-400 w-6 h-6 mb-1" />
              <span className="text-xs text-slate-300 font-medium">Secure<br />Booking</span>
            </div>
          </div>

          {employee && (
            <motion.div
              className="mt-6 flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Booking Professional</p>
                <p className="text-lg font-medium">{employee.full_name || "Selected Employee"}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* FORM BODY */}
        <motion.div
          className="p-8 md:p-10 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          {/* Date Input */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Preferred Date & Time
            </label>
            <input
              type="datetime-local"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-semibold text-slate-700">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Job Description
            </label>
            <textarea
              name="job"
              rows="5"
              value={formData.job}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 resize-none"
              placeholder="Please describe the service..."
            ></textarea>
          </div>

          {/* Note Box */}
          <motion.div
            className="bg-blue-50 rounded-lg p-4 border border-blue-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The professional will review your request and confirm availability.
            </p>
          </motion.div>

          {/* Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full md:w-auto md:float-right px-8 py-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center transition-all ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...
                </>
              ) : (
                <>
                  Confirm Booking <CheckCircle className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BookingForm;
