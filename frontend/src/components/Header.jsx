import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Plus, 
  Settings, 
  Home,
  BookOpen
} from "lucide-react";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              BlogSphere
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <Home size={18} />
              Home
            </Link>
          </motion.div>

          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="px-6 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/create" 
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <Plus size={18} />
                  Create
                </Link>
              </motion.div>

              {/* Admin Link */}
              {user.role === "admin" && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-xl hover:bg-amber-500/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Settings size={18} />
                    Admin
                  </Link>
                </motion.div>
              )}

              {/* Profile with Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsProfileHovered(true)}
                onHoverEnd={() => setIsProfileHovered(false)}
                className="relative"
              >
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  {user.avatar ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-white/30"
                    />
                  ) : (
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"
                    >
                      <User size={16} />
                    </motion.div>
                  )}
                  <span className="font-medium">{user.name || "Profile"}</span>
                </Link>
                
                {/* Hover effect line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isProfileHovered ? "100%" : 0 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-white rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-xl hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 bg-white/20 rounded-xl backdrop-blur-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-gradient-to-b from-blue-700 to-purple-700 backdrop-blur-lg border-t border-white/20"
          >
            <div className="container mx-auto p-4 space-y-3">
              <motion.div variants={itemVariants}>
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Home size={20} />
                  Home
                </Link>
              </motion.div>

              {!user ? (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={20} />
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/register"
                      className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus size={20} />
                      Get Started
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/create"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus size={20} />
                      Create Blog
                    </Link>
                  </motion.div>

                  {user.role === "admin" && (
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/20 transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings size={20} />
                        Admin Panel
                      </Link>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-6 h-6 rounded-full border border-white/30"
                        />
                      ) : (
                        <User size={20} />
                      )}
                      Profile
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 transition-all duration-300 w-full text-left"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;