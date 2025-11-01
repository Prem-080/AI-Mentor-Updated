import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Camera
} from "lucide-react";
import axios from "axios";

const settingsNavItems = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Password & Security" },
  { icon: Palette, label: "Appearance" },
  { icon: Globe, label: "Language" },
];

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSetting, setActiveSetting] = useState("Profile");
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          bio: formData.bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || "Passionate about AI and machine learning. Currently pursuing advanced courses in data science."
      });
    }
  }, [user]);


  return (
    <div className="min-h-screen bg-[#F6F8FA] flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="settings"
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 mt-3 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      }`}>
        <div className="flex flex-1 mt-15">

        {/* Settings Sidebar */}
        <aside className="w-[280px] bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] m-6 mr-0">
          <nav className="p-6">
            <div className="space-y-2">
              {settingsNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    onClick={() => setActiveSetting(item.label)}
                    key={item.label}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-colors ${
                      activeSetting === item.label
                        ? 'bg-[#E8F9F7] text-[#374151]' 
                        : 'text-[#374151] hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent 
                      className={`w-4 h-4 ${
                        activeSetting === item.label ? 'text-[#00BEA5]' : 'text-[#00BEA5]'
                      }`}
                    />
                    <span className="font-medium text-[16px] font-[Inter]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 mt-5">
          {activeSetting === "Profile" && (
            <div className="max-w-[896px]">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">Profile Settings</h1>
                <p className="text-[16px] text-[#4B5563] font-[Inter]">Manage your account information and preferences</p>
              </div>

              {/* Settings Card */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                <div className="flex gap-8 mb-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <img 
                        src={`https://api.dicebear.com/8.x/initials/svg?seed=${formData.firstName}%20${formData.lastName}`}
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-4 border-[rgba(255,135,89,0.65)] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)]"
                      />
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#475569] rounded-full flex items-center justify-center shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)]">
                        <Camera className="w-[14px] h-[14px] text-white" />
                      </button>
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#1F2937] font-[Inter] mb-1">{formData.firstName} {formData.lastName}</h2>
                    <p className="text-[16px] text-[#6B7280] font-[Inter]">Premium Member</p>
                  </div>

                  {/* Form Section */}
                  <div className="flex-1 space-y-6">
                    {/* First and Last Name */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
                        />
                      </div>
                      <div className="relative">
                        <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full h-[50px] px-4 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white"
                      />
                    </div>

                    {/* Bio */}
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-[#475569] font-medium font-[Inter]">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full min-h-[122px] px-4 py-3 rounded-xl border border-[#D1D5DB] text-[16px] font-[Inter] resize-none focus:ring-2 focus:ring-[#00BEA5] focus:border-[#00BEA5] bg-white text-[#ADAEBC]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    className="h-[50px] px-6 rounded-xl border border-[#D1D5DB] bg-white text-[#374151] text-[16px] font-medium font-[Inter] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="h-[50px] px-6 rounded-xl bg-gradient-to-r from-[#00BEA5] to-[#00BEA5] text-white text-[16px] font-medium font-[Inter] hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSetting !== "Profile" && (
            <div className="max-w-[896px]">
              <div className="mb-8">
                <h1 className="text-[30px] font-bold text-[#1F2937] font-[Inter] mb-2">{activeSetting} Settings</h1>
                <p className="text-[16px] text-[#4B5563] font-[Inter]">Manage your {activeSetting.toLowerCase()} preferences</p>
              </div>
              <div className="bg-white rounded-[24px] shadow-[0_4px_6px_0_rgba(0,0,0,0.10),0_10px_15px_0_rgba(0,0,0,0.10)] p-8">
                <p className="text-center text-gray-500">
                  {activeSetting} settings will be available soon.
                </p>
              </div>
            </div>
          )}
        </main>
        </div>
      </div>
    </div>
  );
}
