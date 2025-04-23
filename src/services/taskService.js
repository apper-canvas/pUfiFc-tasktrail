import { getApperClient, tableInfo } from './apperService';

// Helper function to construct filter conditions
const buildFilterConditions = (filters) => {
  const conditions = [];
  
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      conditions.push({ field: 'status', operator: 'eq', value: filters.status });
    }
    
    if (filters.priority && filters.priority !== 'all') {
      conditions.push({ field: 'priority', operator: 'eq', value: filters.priority });
    }
    
    if (filters.category && filters.category !== 'all') {
      conditions.push({ field: 'category', operator: 'eq', value: filters.category });
    }
    
    if (filters.searchQuery) {
      conditions.push({
        or: [
          { field: 'title', operator: 'contains', value: filters.searchQuery },
          { field: 'description', operator: 'contains', value: filters.searchQuery }
        ]
      });
    }
  }
  
  return conditions.length > 0 ? conditions : null;
};

export const fetchTasks = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  const filterConditions = buildFilterConditions(filters);
  
  const params = {
    fields: tableInfo.task.fields,
    pagingInfo: {
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit
    },
    orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
  };
  
  if (filterConditions) {
    params.filter = { and: filterConditions };
  }
  
  try {
    const response = await client.fetchRecords(tableInfo.task.name, params);
    return {
      data: response.data,
      pagination: {
        total: response.totalRecordCount,
        page: pagination.page,
        limit: pagination.limit
      }
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTaskById = async (taskId) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  try {
    const response = await client.fetchRecord(tableInfo.task.name, taskId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const fetchTaskTags = async (taskId) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  const params = {
    fields: tableInfo.taskTag.fields,
    filter: {
      field: 'task_id',
      operator: 'eq',
      value: taskId
    }
  };
  
  try {
    const response = await client.fetchRecords(tableInfo.taskTag.name, params);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tags for task ID ${taskId}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  // Ensure all required fields are present
  const newTask = {
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'To Do',
    priority: taskData.priority || 'Medium',
    category: taskData.category || 'Work',
    due_date: taskData.due_date || null,
    completed: taskData.completed || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  try {
    const response = await client.createRecord(tableInfo.task.name, { record: newTask });
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  // Only include fields that need to be updated
  const updatedTask = {
    ...taskData,
    updated_at: new Date().toISOString()
  };
  
  try {
    const response = await client.updateRecord(tableInfo.task.name, taskId, { record: updatedTask });
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  try {
    const response = await client.deleteRecord(tableInfo.task.name, taskId);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

export const createTaskTag = async (tagData) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  try {
    const response = await client.createRecord(tableInfo.taskTag.name, { record: tagData });
    return response.data;
  } catch (error) {
    console.error('Error creating task tag:', error);
    throw error;
  }
};

export const deleteTaskTag = async (tagId) => {
  const client = getApperClient();
  if (!client) {
    throw new Error('ApperClient not initialized');
  }
  
  try {
    const response = await client.deleteRecord(tableInfo.taskTag.name, tagId);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task tag with ID ${tagId}:`, error);
    throw error;
  }
};

export default {
  fetchTasks,
  fetchTaskById,
  fetchTaskTags,
  createTask,
  updateTask,
  deleteTask,
  createTaskTag,
  deleteTaskTag
};