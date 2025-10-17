import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AiPattern from "../assets/gradinet.jpg";
export default function Index() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Login the user with the received data
      login(data, keepLoggedIn);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#191C20]' : 'bg-white'} relative overflow-hidden`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white text-black hover:bg-gray-100' 
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Background Images */}
     

      <div className="flex flex-col lg:flex-row min-h-screen mt-5 ">
        {/* Left Side - Branding */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 relative z-10">
          {/* Logo */}
          <img 
            className="w-[284px] h-[70px] mb-16"
            src="/upto.png" 
            alt="Logo" 
          />


          {/* Main Content */}
          <div className="max-w-[900px]">
            {/* AI Learning Title */}
            <div className="mb-4">
             <h1
                         className="text-[clamp(36px,6vw,80px)] font-extrabold leading-tight bg-clip-text text-transparent"
                         style={{
                           backgroundImage: `url(${AiPattern})`,
                           backgroundSize: "cover",
                           backgroundPosition: "center",
                         }}
                       >
                         AI Learning
                       </h1>
            </div>

            {/* Platform Text */}
            <h1 className={`text-4xl lg:text-6xl font-bold leading-none tracking-[0.96px] mb-6 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Platform
            </h1>

            {/* Description */}
            <p className={`text-xl lg:text-2xl font-medium leading-normal tracking-[0.26px] max-w-[900px] ${
              isDarkMode ? 'text-[#7A7575]' : 'text-[#5E5858]'
            }`}>
              Unlock the future of education with AI-powered courses designed to accelerate your learning journey
            </p>
             <img 
        className=" left-[-46px] w-[507px] h-[517px] object-cover"
        src="/signupimg.png" 
        alt="" 
      />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-[578px] flex  justify-center p-8">
          <div className={`w-full max-w-[578px] rounded-[20px] shadow-[4px_4px_38.7px_-4px_rgba(110,110,110,0.30)] ${
            isDarkMode 
              ? 'bg-[#191C20] border border-[rgba(232,232,232,0.20)]' 
              : 'bg-white border border-[#E8E8E8]'
          }`}>
            {/* Welcome Section */}
            <div className="px-8 pt-8 pb-6 text-center">
              <h2 className={`text-3xl lg:text-4xl font-black tracking-[0.4px] mb-2 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Welcome Back
              </h2>
              <p className={`text-lg lg:text-xl font-medium tracking-[0.2px] ${
                isDarkMode ? 'text-[#7A7575]' : 'text-[#5E5858]'
              }`}>
                Access your AI learning Journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-8">
              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className={`block text-lg font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-[#0D0D0D]'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address here"
                    className={`w-full h-[58px] px-4 rounded-xl border border-[#B3B3B3] text-lg font-medium leading-7 placeholder:font-medium ${
                      isDarkMode 
                        ? 'bg-[#171A21] text-white placeholder:text-[#7A7575]' 
                        : 'bg-white text-[#0D0D0D] placeholder:text-[#5E5858]'
                    } focus:outline-none focus:ring-2 focus:ring-[#4CAF4F] focus:border-transparent transition-all`}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className={`block text-lg font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-[#0D0D0D]'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className={`w-full h-[58px] px-4 pr-12 rounded-xl border border-[#B3B3B3] text-lg font-medium leading-7 ${
                        isDarkMode 
                          ? 'bg-[#171A21] text-white placeholder:text-white' 
                          : 'bg-white text-[#0D0D0D] placeholder:text-[#0D0D0D]'
                      } focus:outline-none focus:ring-2 focus:ring-[#4CAF4F] focus:border-transparent transition-all`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.6875 19.1875C16.9068 20.5448 14.7386 21.2967 12.5 21.3333C5.20829 21.3333 1.04163 13 1.04163 13C2.33734 10.5853 4.13448 8.47562 6.31246 6.81249M10.3125 4.91666C11.0295 4.74882 11.7636 4.66493 12.5 4.66666C19.7916 4.66666 23.9583 13 23.9583 13C23.326 14.1829 22.5719 15.2966 21.7083 16.3229M14.7083 15.2083C14.4222 15.5154 14.0772 15.7616 13.6939 15.9324C13.3105 16.1032 12.8967 16.1951 12.4771 16.2025C12.0575 16.2099 11.6408 16.1327 11.2516 15.9755C10.8625 15.8183 10.509 15.5844 10.2123 15.2877C9.91556 14.9909 9.68162 14.6374 9.52445 14.2483C9.36728 13.8592 9.29009 13.4424 9.29749 13.0228C9.3049 12.6032 9.39674 12.1894 9.56754 11.8061C9.73834 11.4228 9.9846 11.0777 10.2916 10.7917M1.04163 1.54166L23.9583 24.4583" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        keepLoggedIn ? 'bg-[#4CAF4F]' : isDarkMode ? 'border border-[#B3B3B3] bg-transparent' : 'border border-[#B3B3B3] bg-white'
                      }`}
                      onClick={() => setKeepLoggedIn(!keepLoggedIn)}
                    >
                      {keepLoggedIn && (
                        <svg className="w-5 h-4" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.7313 0.613279C17.424 -0.147216 18.6096 -0.208866 19.3793 0.47558C20.149 1.16002 20.2114 2.33138 19.5187 3.09188L8.26867 15.4423C7.55003 16.2312 6.30878 16.2634 5.54917 15.513L0.549174 10.5728C-0.183058 9.84933 -0.183058 8.67634 0.549174 7.95286C1.28141 7.22939 2.46859 7.22939 3.20082 7.95286L6.80338 11.5123L16.7313 0.613279Z" fill="white"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      Keep me logged in
                    </span>
                  </label>
                  <button className={`text-base font-medium hover:underline ${
                    isDarkMode ? 'text-white' : 'text-[#0D0D0D]'
                  }`}>
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button type="submit" className="w-full h-11 bg-gradient-to-r from-[#4CAF4F] to-[#45A049] border border-[#4CAF4F] rounded-xl text-white text-lg font-bold leading-7 hover:from-[#45A049] hover:to-[#3D8B40] transition-all">
                  Log In
                </button>

                {/* Google Sign In */}
                <button className={`w-full h-11 px-4 flex items-center justify-center gap-3 rounded-xl border border-[#B3B3B3] transition-all hover:bg-gray-50 ${
                  isDarkMode ? 'bg-[#FCFCFC]' : 'bg-[#FCFCFC]'
                }`}>
                  <img
                    className="w-6 h-6"
                    src="/AI_Tutor_New_UI/Signup_login_page/google_icon.svg"
                    alt="Google"
                  />
                  <span className="text-black text-lg font-bold leading-7">Sign in with Google</span>
                </button>

                {/* Apple Sign In */}
                <button className={`w-full h-11 px-4 flex items-center justify-center gap-4 rounded-xl border border-[#B3B3B3] transition-all hover:bg-gray-50 ${
                  isDarkMode ? 'bg-[#FCFCFC]' : 'bg-[#FCFCFC]'
                }`}>
                  <img
                    className="w-6 h-6"
                    src="/AI_Tutor_New_UI/Signup_login_page/apple_icon.svg"
                    alt="Apple"
                  />
                  <span className="text-black text-lg font-bold leading-7">Sign in with Apple</span>
                </button>

                {/* Sign Up Link */}
                <div className="text-center text-lg font-medium leading-7">
                  <span className={isDarkMode ? 'text-white' : 'text-[rgba(26,26,26,0.7)]'}>
                    Don't have an account?{' '}
                  </span>
                  <button className="text-[#FF6D34] hover:underline" onClick={() => navigate('/signup')}>
                    Sign Up!
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
