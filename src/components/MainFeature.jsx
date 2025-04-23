import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const MainFeature = ({ addTask, taskCount, completedCount }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Calculate completion percentage
  const completionPercentage = taskCount > 0 
    ? Math.round((completedCount / taskCount) * 100) 
    : 0;
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newTask = {
        ...formData,
        id: crypto.randomUUID(),
        creationDate: new Date().toISOString()
      };
      
      addTask(newTask);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
      });
      
      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Task Progress</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          
          <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="card p-4 bg-primary/10 dark:bg-primary/5 border-none">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {taskCount - completedCount}
              </p>
            </div>
            
            <div className="card p-4 bg-green-500/10 dark:bg-green-500/5 border-none">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {completedCount}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFormOpen(!formOpen)}
            className="btn btn-primary flex items-center gap-1"
          >
            <PlusCircle size={18} />
            <span>New Task</span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Task Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What needs to be done?"
                    className={`input ${errors.title ? 'border-secondary' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-secondary mt-1">{errors.title}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about this task..."
                    rows="3"
                    className="input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Calendar size={14} />
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className={`input ${errors.dueDate ? 'border-secondary' : ''}`}
                    />
                    {errors.dueDate && (
                      <p className="text-xs text-secondary mt-1">{errors.dueDate}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <AlertCircle size={14} />
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn btn-primary py-3"
                  >
                    Add Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              <span>Task added successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;