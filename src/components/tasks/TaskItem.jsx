import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

const TaskItem = ({ task, onClick }) => {
  // Get priority icon and color
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'Urgent':
        return { icon: <AlertCircle size={16} />, color: 'text-red-500 dark:text-red-400' };
      case 'High':
        return { icon: <AlertCircle size={16} />, color: 'text-orange-500 dark:text-orange-400' };
      case 'Medium':
        return { icon: null, color: 'text-yellow-500 dark:text-yellow-400' };
      case 'Low':
        return { icon: null, color: 'text-green-500 dark:text-green-400' };
      default:
        return { icon: null, color: 'text-surface-500 dark:text-surface-400' };
    }
  };

  const { icon: priorityIcon, color: priorityColor } = getPriorityInfo(task.priority);

  // Format due date if it exists
  const formattedDueDate = task.due_date
    ? format(new Date(task.due_date), 'MMM d, yyyy')
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="p-3 bg-white dark:bg-surface-700 rounded-lg shadow-sm border border-surface-200 dark:border-surface-600 cursor-pointer transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {task.completed ? (
            <CheckCircle className="text-green-500 dark:text-green-400" size={20} />
          ) : (
            <Circle className="text-surface-400 dark:text-surface-500" size={20} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''}`}>
              {task.title}
            </h3>
            {priorityIcon && (
              <span className={`inline-flex items-center text-xs ${priorityColor}`}>
                {priorityIcon}
                <span className="ml-1">{task.priority}</span>
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
            <span className="inline-flex items-center px-2 py-1 bg-surface-100 dark:bg-surface-600 rounded">
              {task.status}
            </span>
            
            {task.category && (
              <span className="inline-flex items-center px-2 py-1 bg-surface-100 dark:bg-surface-600 rounded">
                {task.category}
              </span>
            )}
            
            {formattedDueDate && (
              <span className="inline-flex items-center">
                <Clock size={14} className="mr-1" />
                {formattedDueDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;