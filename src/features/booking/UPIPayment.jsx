import React, { useState } from "react";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";
import { FiChevronRight, FiCreditCard, FiSmartphone, FiDollarSign } from "react-icons/fi";

const PaymentOptions = ({ booking }) => {
  const [method, setMethod] = useState(null);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border space-y-6 mt-8">

      {/* --- TITLE --- */}
      <h2 className="text-2xl font-bold text-gray-800">
        Complete Payment
      </h2>
      <p className="text-gray-500 -mt-3">
        Pay securely to confirm your booking.
      </p>

      {/* --- AMOUNT BOX --- */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-gray-700 text-sm">Service Amount</p>
        <h3 className="text-3xl font-bold text-blue-600">₹{booking?.amount}</h3>
      </div>

      {/* --- PAYMENT OPTIONS --- */}

      {/* UPI OPTION */}
      <div
        onClick={() => setMethod("upi")}
        className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer 
          ${method === "upi" ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <div className="flex items-center gap-3">
          <FiSmartphone size={22} className="text-blue-600" />
          <span className="font-medium text-gray-800">UPI Payment</span>
        </div>
        <FiChevronRight />
      </div>

      {method === "upi" && (
        <div className="p-4 border rounded-xl mt-2 bg-gray-50 space-y-4">
          <p className="text-gray-700 font-medium">Pay Using</p>

          {/* UPI Apps */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <SiGooglepay size={48} className="text-blue-500" />
              <span className="text-sm">GPay</span>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <SiPhonepe size={48} className="text-purple-600" />
              <span className="text-sm">PhonePe</span>
            </div>

            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <SiPaytm size={48} className="text-blue-700" />
              <span className="text-sm">Paytm</span>
            </div>
          </div>

          {/* Enter UPI */}
          <div>
            <label className="text-gray-700 font-medium">Enter UPI ID</label>
            <input
              type="text"
              placeholder="example@upi"
              className="w-full border rounded-lg px-4 py-2 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-1">
            Pay ₹{booking?.amount}
          </button>
        </div>
      )}

      {/* CARD PAYMENT OPTION */}
      <div
        onClick={() => setMethod("card")}
        className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer 
          ${method === "card" ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <div className="flex items-center gap-3">
          <FiCreditCard size={22} className="text-green-600" />
          <span className="font-medium text-gray-800">Debit / Credit Card</span>
        </div>
        <FiChevronRight />
      </div>

      {method === "card" && (
        <div className="p-4 border rounded-xl mt-2 bg-gray-50 space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="password"
              placeholder="CVV"
              className="border rounded-lg px-4 py-2"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-1">
            Pay ₹{booking?.amount}
          </button>
        </div>
      )}

      {/* CASH PAYMENT OPTION */}
      <div
        onClick={() => setMethod("cash")}
        className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer 
          ${method === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <div className="flex items-center gap-3">
          <FiDollarSign size={22} className="text-orange-600" />
          <span className="font-medium text-gray-800">Cash on Service</span>
        </div>
        <FiChevronRight />
      </div>

      {method === "cash" && (
        <div className="p-4 border rounded-xl bg-gray-50 mt-2">
          <p className="text-gray-700">
            You can pay the employee directly after the job is completed.
          </p>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold mt-4">
            Confirm Booking
          </button>
        </div>
      )}

    </div>
  );
};

export default PaymentOptions;
