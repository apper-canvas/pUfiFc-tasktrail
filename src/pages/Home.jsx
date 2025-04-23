import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, List, Grid, SlidersHorizontal } from 'lucide-react';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
  });
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
  };
  
  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter.status === 'all' || task.status === filter.status;
    const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;
    return statusMatch && priorityMatch;
  });
  
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Organize Your Tasks Effortlessly
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Track, prioritize, and complete your tasks with TaskTrail's intuitive interface.
        </p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterOpen(!filterOpen)}
                className="btn btn-outline flex items-center gap-1"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </motion.button>
              
              <div className="flex rounded-lg overflow-hidden border border-surface-300 dark:border-surface-700">
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-800'}`}
                >
                  <List size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-surface-800'}`}
                >
                  <Grid size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="card p-4 flex flex-wrap gap-4">
                  <div className="space-y-1 flex-1 min-w-[150px]">
                    <label className="text-sm font-medium">Status</label>
                    <select 
                      value={filter.status}
                      onChange={(e) => setFilter({...filter, status: e.target.value})}
                      className="input"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1 flex-1 min-w-[150px]">
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      value={filter.priority}
                      onChange={(e) => setFilter({...filter, priority: e.target.value})}
                      className="input"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
            <AnimatePresence>
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`card task-item ${task.status === 'completed' ? 'opacity-70' : ''}`}
                  >
                    <div className={`priority-indicator priority-${task.priority}`}></div>
                    <div className="p-4 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          task.status === 'in_progress' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-surface-500">
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTask(task.id, { 
                              status: task.status === 'completed' ? 'pending' : 'completed',
                              completedDate: task.status !== 'completed' ? new Date().toISOString() : null
                            })}
                            className="text-xs btn btn-outline py-1"
                          >
                            {task.status === 'completed' ? 'Undo' : 'Complete'}
                          </button>
                          
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-xs btn btn-outline py-1 text-secondary-dark"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-8 text-center"
                >
                  <p className="text-surface-500 dark:text-surface-400">
                    {tasks.length === 0 
                      ? "You don't have any tasks yet. Add your first task to get started!"
                      : "No tasks match your current filters."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <MainFeature 
            addTask={addTask} 
            taskCount={tasks.length}
            completedCount={tasks.filter(t => t.status === 'completed').length}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;