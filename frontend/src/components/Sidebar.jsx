import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ChevronRight, Home, BookOpen, MessageCircle, BarChart3, Settings, PlayCircle } from 'lucide-react'

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  activePage = 'dashboard'
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/sidebar/navigation', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setNavigationItems(data);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    }
    fetchNavigationItems();
  }, []);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
         fixed lg:fixed top-16 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'}
        w-80 h-[calc(100vh-4rem)]
      `}>
        {/* Desktop Sidebar Toggle Button */}
        <button
          className={`hidden lg:block absolute -right-5 top-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 z-10 ${
            sidebarCollapsed ? 'transform' : ''
          }`}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            sidebarCollapsed ? 'rotate-180' : ''
          }`} />
        </button>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`cursor-pointer flex items-center px-3 py-3 rounded-xl group relative ${
                    sidebarCollapsed ? 'justify-center' : ''
                  } ${isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(item.path) }}
                >
                  <img src={item.icon} alt={item.label} className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center">
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${user ? user.firstName : 'Eliza'}%20${user ? user.lastName : 'Chris'}`}
                  alt={user ? user.name : 'Eliza Chris'}
                  className="w-8 h-8 rounded-full"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">{user ? user.name : 'Eliza Chris'}</div>
                  <div className="text-xs text-gray-500">{user ? user.email : 'elizachris@gmail.com'}</div>
                </div>
                <button onClick={handleLogout} className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Profile */}
        {sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-center">
              <img
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${user ? user.firstName : 'Eliza'}%20${user ? user.lastName : 'Chris'}`}
                alt={user ? user.name : 'Eliza Chris'}
                className="w-10 h-10 rounded-full border-2 border-purple-200"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
