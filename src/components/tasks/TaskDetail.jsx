import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { X, Edit, Trash2, CheckCircle, Circle, Calendar, Tag } from 'lucide-react';
import { fetchTaskTags } from '../../services/taskService';

const TaskDetail = ({ task, onClose, onEdit, onDelete, onToggleComplete }) => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task?.Id) {
      loadTags(task.Id);
    }
  }, [task]);

  const loadTags = async (taskId) => {
    try {
      setIsLoading(true);
      const taskTags = await fetchTaskTags(taskId);
      setTags(taskTags);
      setError(null);
    } catch (err) {
      setError('Failed to load task tags');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) return null;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      console.error('Invalid date:', e);
      return 'Invalid date';
    }
  };

  const dueDate = task.due_date ? formatDate(task.due_date) : 'No due date';
  const createdDate = task.created_at ? formatDate(task.created_at) : 'Unknown';
  const updatedDate = task.updated_at ? formatDate(task.updated_at) : 'Unknown';

  // Priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-500 dark:text-red-400';
      case 'High': return 'text-orange-500 dark:text-orange-400';
      case 'Medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'Low': return 'text-green-500 dark:text-green-400';
      default: return 'text-surface-500 dark:text-surface-400';
    }
  };

  const priorityColor = getPriorityColor(task.priority);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'To Do': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-surface-800 rounded-lg shadow-lg p-5 w-full max-w-lg"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center text-xs ${priorityColor}`}>
              {task.priority}
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 flex-shrink-0"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onToggleComplete(task)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            {task.completed ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>Mark Complete</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onDelete(task.Id)}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>

        {task.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">Description</h3>
            <p className="text-surface-800 dark:text-surface-200 whitespace-pre-line">
              {task.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-300">Category</h3>
            <p className="text-surface-800 dark:text-surface-200">{task.category || 'None'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-300">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                Due Date
              </div>
            </h3>
            <p className="text-surface-800 dark:text-surface-200">{dueDate}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <div className="animate-pulse h-4 bg-surface-200 dark:bg-surface-600 rounded w-20"></div>
          </div>
        ) : tags.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">
              <div className="flex items-center">
                <Tag size={14} className="mr-1" />
                Tags
              </div>
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag.Id}
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    tag.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    tag.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    tag.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    tag.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    tag.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    tag.color === 'pink' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {tag.tag_name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 text-xs text-surface-500 dark:text-surface-400">
          <p>Created: {createdDate}</p>
          <p>Last modified: {updatedDate}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetail;