import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Tag, List } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    document.title = 'TaskTrail - Organize Your Tasks Effortlessly';
  }, []);

  const features = [
    {
      icon: <CheckCircle size={24} />,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Due Dates',
      description: 'Set deadlines and never miss an important task again.'
    },
    {
      icon: <Tag size={24} />,
      title: 'Categories & Tags',
      description: 'Organize tasks by category and add custom tags.'
    },
    {
      icon: <List size={24} />,
      title: 'Priority Levels',
      description: 'Assign priority levels to focus on what matters most.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Organize Your Tasks <span className="text-primary">Effortlessly</span>
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto">
          TaskTrail helps you keep track of all your tasks in one place, so you can stay organized and productive.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-surface-300 dark:border-surface-600 font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              Create Account
            </motion.button>
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-12"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              className="p-6 rounded-lg bg-white dark:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-700"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Join thousands of users who use TaskTrail to stay organized and productive.
        </p>
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Start Organizing Now
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;