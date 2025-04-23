import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { clearUser } from '../store/userSlice';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetail from '../components/tasks/TaskDetail';
import { 
  createTask, 
  updateTask, 
  deleteTask 
} from '../services/taskService';
import { 
  addTask, 
  updateTask as updateTaskState, 
  removeTask,
  setCurrentTask
} from '../store/taskSlice';
import { logout } from '../services/apperService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { currentTask } = useSelector((state) => state.tasks);
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    dispatch(setCurrentTask(null));
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = async (formData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await updateTask(editingTask.Id, formData);
        dispatch(updateTaskState(updatedTask));
      } else {
        // Create new task
        const newTask = await createTask(formData);
        dispatch(addTask(newTask));
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      dispatch(removeTask(taskId));
      dispatch(setCurrentTask(null));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await updateTask(task.Id, {
        completed: !task.completed
      });
      dispatch(updateTaskState(updatedTask));
      if (currentTask && currentTask.Id === task.Id) {
        dispatch(setCurrentTask(updatedTask));
      }
    } catch (error) {
      console.error('Error updating task completion status:', error);
    }
  };

  const handleSelectTask = (task) => {
    dispatch(setCurrentTask(task));
  };

  const handleCloseTaskDetail = () => {
    dispatch(setCurrentTask(null));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="ml-2">
              <p className="font-medium">
                {user?.FirstName} {user?.LastName}
              </p>
              <p className="text-xs text-surface-500">{user?.Email}</p>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TaskList 
            onAddTask={handleAddTask}
            onSelectTask={handleSelectTask}
          />
        </div>
        
        <div>
          <AnimatePresence mode="wait">
            {showTaskForm && (
              <motion.div
                key="task-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="sticky top-20"
              >
                <TaskForm
                  task={editingTask}
                  onSubmit={handleTaskSubmit}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                />
              </motion.div>
            )}
            
            {currentTask && !showTaskForm && (
              <motion.div
                key="task-detail"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="sticky top-20"
              >
                <TaskDetail
                  task={currentTask}
                  onClose={handleCloseTaskDetail}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              </motion.div>
            )}

            {!currentTask && !showTaskForm && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-100 dark:bg-surface-800 rounded-lg p-6 text-center"
              >
                <h3 className="text-lg font-medium mb-2">No task selected</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Select a task from the list to view details, or create a new task to get started.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="mt-4 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
                >
                  Create New Task
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;