import React from 'react';
import { FaUserPlus, FaEdit, FaChartLine, FaBell, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
const EmployeeSection = () => {
  const features = [
    {
      icon: <FaUserPlus className="text-3xl mb-4 text-uniqueBlue" />,
      title: "Easy Registration",
      description: "Join our platform in minutes and start your professional journey"
    },
    {
      icon: <FaEdit className="text-3xl mb-4 text-green-500" />,
      title: "Post Management",
      description: "Create, edit, and manage your professional posts effortlessly"
    },
    {
      icon: <FaChartLine className="text-3xl mb-4 text-purple-500" />,
      title: "Performance Tracking",
      description: "Monitor your engagement and growth with detailed analytics"
    },
    {
      icon: <FaBell className="text-3xl mb-4 text-yellow-500" />,
      title: "Real-time Notifications",
      description: "Stay updated with instant alerts about your activities"
    },
    {
      icon: <FaUsers className="text-3xl mb-4 text-red-500" />,
      title: "Community Network",
      description: "Connect and collaborate with other professionals"
    },
    {
      icon: <FaShieldAlt className="text-3xl mb-4 text-indigo-500" />,
      title: "Privacy Control",
      description: "Manage what you share with comprehensive privacy settings"
    }
  ];

  const journeySteps = [
    {
      step: 1,
      title: "Register Your Profile",
      description: "Create your professional account with just basic information"
    },
    {
      step: 2,
      title: "Complete Your Portfolio",
      description: "Showcase your skills, experience, and achievements"
    },
    {
      step: 3,
      title: "Start Engaging",
      description: "Post content, interact with others, and build your network"
    },
    {
      step: 4,
      title: "Grow Your Presence",
      description: "Gain visibility and opportunities through our platform"
    }
  ];

  return (
    <section className=" px-4 md:px-8 lg:px-16 bg-gradient-to-b ">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Empower Your Professional Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            A platform designed to help you showcase your skills, connect with opportunities,
            and grow your professional network like never before.
          </motion.p>
        </div>

      
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">

               
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#E6F0FF"
                        d="M50 0C77.6 0 100 22.4 100 50s-22.4 50-50 50S0 77.6 0 50 22.4 0 50 0z"
                      />
                    </svg>

                   
                    <span className="absolute -top-1 -left-1 text-blue-400 text-sm">✦</span>
                    <span className="absolute -bottom-1 -right-1 text-blue-400 text-sm">✦</span>

                   
                    <span className="relative z-10 text-blue-600 w-8 h-8 flex items-center justify-center">
                      {feature.icon}
                    </span>
                  </div>

                
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 leading-snug">
                    {feature.title}
                  </h3>

              
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


     
        <div className="py-20 ">
          
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-20 text-center "
          >
            Your Professional Evolution
          </motion.h1>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
            <div className="hidden md:block absolute left-1/2 h-full w-1.5 bg-gradient-to-b from-teal-400 to-purple-500 transform -translate-x-1/2 rounded-full"></div>

            <div className="space-y-16 md:space-y-24">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >

               
                  <div className="md:hidden absolute left-3 top-0 h-full w-0.5 bg-teal-300"></div>


       
                  <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 
                        rounded-full bg-white border-4 border-purple-500 
                        shadow-xl z-20 
                        mx-auto md:mx-0 
                        transition duration-300 hover:scale-105 hover:shadow-2xl">
         
                    <div className="w-16 h-16 md:w-18 md:h-18 
                          rounded-full 
                          bg-gradient-to-r from-blue-400 to-purple-500 
                          text-white 
                          flex items-center justify-center 
                          text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>

                  <div className={`md:w-5/12 
                          ${index % 2 === 0 ? 'md:ml-20' : 'md:mr-20'} 
                          bg-white 
                          p-8 
                          rounded-xl 
                          shadow-2xl 
                          border-t-4 border-blue-500 
                          transition duration-500 hover:shadow-3xl hover:border-t-4 hover:border-purple-500
                          mt-6 md:mt-0`}>
                    <h3 className="text-2xl font-bold mb-3 text-teal-700">{step.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default EmployeeSection;