import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    searchQuery: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.currentTask && state.currentTask.Id === action.payload.Id) {
        state.currentTask = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
      if (state.currentTask && state.currentTask.Id === action.payload) {
        state.currentTask = null;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearTaskState: (state) => {
      return initialState;
    }
  }
});

export const {
  setTasks,
  setCurrentTask,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
  setFilters,
  setPagination,
  clearTaskState
} = taskSlice.actions;

export default taskSlice.reducer;