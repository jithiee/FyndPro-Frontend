import React from 'react';
import { Link } from 'react-router-dom';

const HeaderText = () => {

    const user = localStorage.getItem('accessToken')
    
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
            
        
    
    return (
        <>

            <div className="flex flex-col items-center mt-14 text-center px-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-gray-800">
                    Discover real-world
                </h1>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-uniqueBlue">
                    service booking experiences
                </h1>

                <div className="mt-4 space-y-1">
                    <p className="text-md sm:text-base text-gray-600">
                        Featuring thousands of verified professionals across plumbing,
                    </p>
                    <p className="text-md sm:text-base text-gray-600">
                        electrical, carpentry, and more — New bookings and reviews daily.
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10 ">
                {/* Primary Button */}

           {
                    !user ? ( <Link to='login' >
                <button className="flex items-center justify-center cursor-pointer bg-black text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-gray-800 focus:outline-none">
                    Join for free
                </button>
                </Link> ) : (
                <Link to={userData.role == "client" ? 'userdashboard' : 'employeedashboard' } >
                <button className="flex items-center justify-center cursor-pointer bg-black text-white font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-gray-800 focus:outline-none">
                   Go to Account
                </button>
                </Link>
                )

                } 
  


                {/* Secondary Button with Icon */}
                {
                    userData.role === "client" ? (     <Link to='/employeelists' >
                <button className="flex items-center cursor-pointer gap-2 border border-gray-300 text-black font-semibold py-3 px-6 rounded-full transition duration-300 hover:bg-gray-100 focus:outline-none">
                    Booking Here
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </button>
                </Link>):(
                    ""
                )
                }

           



            </div>
          

        </>
    );
};

export default HeaderText;
