import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Filter, PlusCircle, RefreshCw } from 'lucide-react';
import { setTasks, setLoading, setError, setPagination } from '../../store/taskSlice';
import { fetchTasks } from '../../services/taskService';
import TaskItem from './TaskItem';

const TaskList = ({ onAddTask, onSelectTask }) => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error, filters, pagination } = useSelector((state) => state.tasks);
  const [showFilters, setShowFilters] = useState(false);

  const loadTasks = async () => {
    try {
      dispatch(setLoading(true));
      const result = await fetchTasks(filters, pagination);
      dispatch(setTasks(result.data));
      dispatch(setPagination(result.pagination));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to load tasks'));
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters, pagination.page, pagination.limit]);

  const handleRefresh = () => {
    loadTasks();
  };

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  return (
    <div className="bg-surface-100 dark:bg-surface-800 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full text-surface-600 hover:text-primary hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label="Filter tasks"
          >
            <Filter size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-2 rounded-full text-surface-600 hover:text-primary hover:bg-surface-200 dark:hover:bg-surface-700 ${isLoading ? 'animate-spin' : ''}`}
            aria-label="Refresh tasks"
            disabled={isLoading}
          >
            <RefreshCw size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAddTask}
            className="p-2 rounded-full text-primary hover:bg-surface-200 dark:hover:bg-surface-700"
            aria-label="Add new task"
          >
            <PlusCircle size={20} />
          </motion.button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
          {/* Filter UI will be implemented here */}
          <p className="text-sm text-surface-500 dark:text-surface-400">Filters coming soon</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-surface-300 dark:bg-surface-600 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-surface-300 dark:bg-surface-600 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-300 dark:bg-surface-600 rounded"></div>
                  <div className="h-4 bg-surface-300 dark:bg-surface-600 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.Id}
              task={task}
              onClick={() => onSelectTask(task)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-surface-500 dark:text-surface-400">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        )}
      </div>

      {pagination.total > pagination.limit && (
        <div className="mt-4 flex justify-center">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TaskList;