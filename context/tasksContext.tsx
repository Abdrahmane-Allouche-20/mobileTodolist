import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  fetchTasks: () => void;
  loading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@todolist_tasks';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from AsyncStorage
  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (tasksToSave: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tasks';
      setError(errorMessage);
    }
  };

  const addTask = async (task: Task): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (task.title.trim() === '') {
        throw new Error('Task title is required');
      }
      
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      await saveTasks(newTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!updatedTask) return;
      
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      );
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const filteredTasks = tasks.filter(task => task.id !== id);
      setTasks(filteredTasks);
      await saveTasks(filteredTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      fetchTasks,
      loading, 
      error 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the context
export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
