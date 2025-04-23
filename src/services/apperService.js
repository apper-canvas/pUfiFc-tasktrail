// Canvas ID for Apper client
const CANVAS_ID = 'f7440dabecb34c6ebb315308220cfc5c';

// Table and field information from the provided JSON
export const tableInfo = {
  task: {
    name: 'task4',
    fields: [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 
      'ModifiedBy', 'DeletedOn', 'DeletedBy', 'IsDeleted', 'InSandbox',
      'title', 'description', 'status', 'priority', 'due_date', 'category', 
      'completed', 'created_at', 'updated_at'
    ]
  },
  taskTag: {
    name: 'task_tag',
    fields: [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn',
      'ModifiedBy', 'DeletedOn', 'DeletedBy', 'IsDeleted', 'InSandbox',
      'task_id', 'tag_name', 'color', 'IsParentDeleted'
    ]
  },
  user: {
    name: 'User',
    fields: [
      'Id', 'Name', 'FirstName', 'LastName', 'Email', 'AvatarUrl'
    ]
  }
};

let apperClient = null;

export const initializeApperClient = () => {
  if (window.ApperSDK && !apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient(CANVAS_ID);
    return apperClient;
  }
  return apperClient;
};

export const getApperClient = () => {
  if (!apperClient) {
    return initializeApperClient();
  }
  return apperClient;
};

export const setupAuthUI = (target, onSuccess, onError) => {
  const client = getApperClient();
  if (!client || !window.ApperSDK) {
    console.error('Apper SDK not loaded or ApperClient not initialized');
    return;
  }
  
  const { ApperUI } = window.ApperSDK;
  ApperUI.setup(client, {
    target,
    clientId: CANVAS_ID,
    view: 'both',
    onSuccess: (user, account) => {
      if (onSuccess) onSuccess(user, account);
    },
    onError: (error) => {
      console.error('Authentication error:', error);
      if (onError) onError(error);
    }
  });
  
  return ApperUI;
};

export const showLogin = (target) => {
  if (!window.ApperSDK) {
    console.error('Apper SDK not loaded');
    return;
  }
  
  const { ApperUI } = window.ApperSDK;
  ApperUI.showLogin(target);
};

export const showRegister = (target) => {
  if (!window.ApperSDK) {
    console.error('Apper SDK not loaded');
    return;
  }
  
  const { ApperUI } = window.ApperSDK;
  ApperUI.showSignup(target);
};

export const logout = () => {
  const client = getApperClient();
  if (!client) {
    console.error('ApperClient not initialized');
    return Promise.reject('ApperClient not initialized');
  }
  
  return client.logout()
    .catch(error => {
      console.error('Logout error:', error);
      throw error;
    });
};

export default {
  initializeApperClient,
  getApperClient,
  setupAuthUI,
  showLogin,
  showRegister,
  logout,
  tableInfo
};