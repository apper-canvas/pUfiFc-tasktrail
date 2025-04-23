import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { X } from 'lucide-react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    category: 'Work',
    due_date: '',
    completed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      // Format due_date if it exists
      let formattedDueDate = '';
      if (task.due_date) {
        try {
          formattedDueDate = format(new Date(task.due_date), 'yyyy-MM-dd');
        } catch (error) {
          console.error('Invalid date format:', error);
        }
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        category: task.category || 'Work',
        due_date: formattedDueDate,
        completed: task.completed || false
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when it's modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Form submission was successful, cleanup will be handled by parent component
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'An error occurred while saving the task'
      }));
      setIsSubmitting(false);
    }
  };

  const statusOptions = ['To Do', 'In Progress', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const categoryOptions = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Home', 'Other'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-5 w-full max-w-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-lg text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              errors.title 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-surface-300 dark:border-surface-600'
            } bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Task description"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {priorityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm">Mark as completed</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;