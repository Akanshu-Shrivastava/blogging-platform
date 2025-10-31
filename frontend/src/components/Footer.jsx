import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Twitter, 
  Github, 
  Mail, 
  BookOpen,
  ArrowUp
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Check scroll position for back to top button
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsVisible(window.pageYOffset > 300);
    });
  }

  const socialLinks = [
    {
      icon: <Twitter size={20} />,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-blue-400"
    },
    {
      icon: <Github size={20} />,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:text-gray-400"
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:contact@blogsphere.com",
      label: "Email",
      color: "hover:text-red-400"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-gray-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-indigo-500 rounded-full blur-lg"></div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border border-white/20"
      >
        <ArrowUp size={20} />
      </motion.button>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Link to="/" className="flex items-center gap-3 justify-center">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
              >
                <BookOpen size={24} className="text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                BlogSphere
              </span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Where stories come alive. Join our community of writers and readers 
              to share, discover, and connect through the power of words.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 border-t border-white/10 w-full max-w-2xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <span>&copy; {currentYear} BlogSphere. All rights reserved.</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="text-red-400"
                >
                  <Heart size={16} fill="currentColor" />
                </motion.span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <div className="text-gray-500">
                  Made with passion by Akanshu Shrivastava
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;