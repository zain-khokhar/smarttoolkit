"use client"
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <div
            className="min-h-screen bg-[black] text-white flex items-center justify-center p-4 sm:p-8 font-sans relative"
            style={{
                backgroundImage: "radial-gradient(#101010 1px, transparent 1px)",
                backgroundSize: "40px 40px",
            }}
        >
            {/* Optional dark overlay for subtle effect */}
            {/* <div className="absolute inset-0 bg-black/40 pointer-events-none"></div> */}
            <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content Section */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left py-12">
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Transforming Data <br />
                        into{' '}
                        <motion.span
                            className="px-4 py-2 bg-[#F25725] rounded-lg inline-block mt-2 sm:mt-0"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Decisions
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-gray-300 max-w-lg mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Leverage the power of machine learning and AI to unlock insights and drive business growth
                    </motion.p>

                    <div className="flex space-x-4">
                        {/* Our Services Button */}
                        <motion.button
                            className="px-8 py-3 font-semibold rounded bg-[#F25725] hover:bg-transparent hover:border-[#F25725] hover:border transition-colors duration-300 shadow-lg text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            Our Services
                        </motion.button>

                        {/* Contact Us Button */}
                        <motion.button
                            className="px-8 py-3 font-semibold rounded border border-[#F25725] text-[#F25725] hover:bg-[#F25725] hover:text-white transition-colors duration-300 shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            Contact Us
                        </motion.button>
                    </div>

                    {/* Your existing motion.div */}
                    <motion.div
                        className="mt-8 flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        {/* other content here */}
                    </motion.div>


                    <motion.div
                        className="mt-8 flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                    >
                        <div className="flex -space-x-2 overflow-hidden">
                            {/* Dummy avatar images */}
                            <img
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://via.placeholder.com/32"
                                alt="Client avatar 1"
                            />
                            <img
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://via.placeholder.com/32"
                                alt="Client avatar 2"
                            />
                            <img
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src="https://via.placeholder.com/32"
                                alt="Client avatar 3"
                            />
                        </div>
                        <span className="text-gray-400 font-medium">Over 100+ clients have worked with us</span>
                    </motion.div>
                </div>

                {/* Right Robot Illustration Section */}
                <div className="flex items-center justify-center p-6 relative bg-black"> {/* Added 'relative' here */}
                    <motion.div
                        className="w-full max-w-sm sm:max-w-md lg:max-w-lg z-10" // Added z-10 to keep robot above gradient
                        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 1.2 }}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src="/robot.png"
                                alt="A futuristic robot holding a glowing shield"
                                className="object-contain w-full h-auto"
                            />
                        </div>
                    </motion.div>

                    {/* Gradient background for floating effect */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center" // Position absolute to layer behind robot
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                    >
                        <div
                            className="w-3/4 h-3/4 rounded-full filter blur-3xl opacity-60" // Adjusted blur and opacity
                            style={{
                                background: 'radial-gradient(circle, rgba(45,115,255,0.7) 0%, rgba(10,12,22,0) 70%)', // Blue to transparent
                            }}
                        ></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;