import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Students", path: "/students", icon: "Users" },
    { name: "Grades", path: "/grades", icon: "BookOpen" },
    { name: "Attendance", path: "/attendance", icon: "Calendar" },
    { name: "Assignments", path: "/assignments", icon: "FileText" },
    { name: "Reports", path: "/reports", icon: "BarChart3" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                      <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        ClassTracker
                      </h1>
                      <p className="text-xs text-gray-500">Student Management</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 px-4 py-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            className={cn(
                              "mr-3 h-5 w-5 transition-colors duration-200",
                              isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                            )} 
                          />
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;