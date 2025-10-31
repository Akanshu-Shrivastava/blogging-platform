import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PenTool, Globe2, Users, BookOpen, ChevronRight } from "lucide-react"; // Added ChevronRight
import { BlogAPI } from "../api/axios";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonHover = {
  scale: 1.05,
  boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4), 0 4px 6px -2px rgba(37, 99, 235, 0.2)", // Custom shadow for elevation
};

const LandingPage = () => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // ===== Fetch recent 3 blogs (Existing Functionality) =====
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await BlogAPI.getBlogs({ limit: 3, sort: "-createdAt" });
        // NOTE: Assuming res.data is the array of blogs
        setRecentBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch recent blogs:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchRecentBlogs();
  }, []);

  // --- Helper component for Feature Card (New Small Feature: Hover effect) ---
  const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} // Smooth lift on hover
      className="p-8 bg-white rounded-3xl shadow-xl border border-blue-100/50 text-left transition duration-300 cursor-default h-full"
    >
      {icon}
      <h3 className="text-xl font-bold text-blue-800 mt-4 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white"> {/* Set base background to white */}
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-28 bg-gradient-to-br from-blue-50/70 via-white to-blue-100/70">
        {/* Decorative background element (Aesthetic touch) */}
        <div className="absolute inset-0 z-0 opacity-10">
          

[Image of abstract modern geometric pattern]

        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight text-gray-900"
            >
              Unleash Your Voice on <span className="text-blue-600">BlogSphere</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-10"
            >
              A place where **creativity meets technology**. Read, write, and share
              amazing stories with the world 🌍
            </motion.p>

            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.4 }}
              className="flex gap-4 flex-wrap justify-center"
            >
              <motion.div whileHover={buttonHover} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  to="/blogs"
                  className="px-8 py-4 text-lg bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                >
                  Explore Blogs <BookOpen size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={buttonHover} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  to="/login"
                  className="px-8 py-4 text-lg bg-white text-blue-600 font-semibold rounded-full border-2 border-blue-600 hover:bg-blue-50 transition duration-300 flex items-center gap-2"
                >
                  Start Writing <PenTool size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      ---

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            A Platform Built for You
          </h2>
          <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto">
            Experience the future of blogging with our powerful features.
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <FeatureCard
              icon={<BookOpen size={40} className="text-blue-600" />}
              title="Discover Diverse Topics"
              desc="Dive into curated content across tech, lifestyle, finance, and every niche imaginable."
              delay={0}
            />
            <FeatureCard
              icon={<PenTool size={40} className="text-blue-600" />}
              title="Seamless Writing Experience"
              desc="Our advanced editor lets you write and format your articles with unparalleled ease and speed."
              delay={0.1}
            />
            <FeatureCard
              icon={<Users size={40} className="text-blue-600" />}
              title="Grow Your Audience"
              desc="Connect with fellow readers and writers, build your following, and foster genuine engagement."
              delay={0.2}
            />
            <FeatureCard
              icon={<Globe2 size={40} className="text-blue-600" />}
              title="Maximize Your Reach"
              desc="Publish your content instantly to a global audience with powerful built-in SEO tools."
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      ---

      {/* ===== RECENT BLOGS ===== */}
      <section className="py-24 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Latest from the Community
            </h2>
            <Link
              to="/blogs"
              className="text-blue-600 font-semibold hover:text-blue-700 transition flex items-center"
            >
              View All Blogs <ChevronRight size={18} />
            </Link>
          </div>

          {loadingBlogs ? (
            // Small Feature: Skeleton Loader for a smooth feel
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse h-80">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length === 0 ? (
            <p className="text-lg text-center py-10 text-gray-600 border-2 border-dashed border-gray-300 rounded-xl">
              No blogs available yet. Be the first to publish a great story!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 overflow-hidden group cursor-pointer"
                >
                  <Link to={`/blogs/${blog._id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={blog.coverImage || "/placeholder.png"}
                        alt={blog.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6 text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 transition-colors group-hover:text-blue-600 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 mb-4 line-clamp-3 text-sm">
                        {blog.excerpt || blog.content.substring(0, 100) + "..."}
                      </p>
                      <span className="text-blue-600 font-semibold flex items-center">
                        Read More <ChevronRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      ---

      {/* ===== CALL TO ACTION (CTA) ===== */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
          >
            Ready to Share Your Stories? ✍️
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl mb-10 opacity-90"
          >
            Join thousands of passionate writers and readers on BlogSphere and make your mark.
          </motion.p>
          <motion.div whileHover={buttonHover} transition={{ type: "spring", stiffness: 300 }}>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-blue-50 transition duration-300 transform hover:scale-[1.02]"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </div>
      </section>

      ---

      {/* ===== FOOTER (Aesthetic touch: Darker, modern footer) ===== */}
      <footer className="bg-gray-900 text-gray-300 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-2xl font-bold text-white mb-6">BlogSphere</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 text-sm">
            <Link to="/about" className="hover:text-blue-400 transition">
              About Us
            </Link>
            <Link to="/blogs" className="hover:text-blue-400 transition">
              All Blogs
            </Link>
            <Link to="/privacy" className="hover:text-blue-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-400 transition">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </div>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto my-6"></div>
          <p className="text-xs">
            © {new Date().getFullYear()} BlogSphere. All rights reserved. Built with 💙.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;