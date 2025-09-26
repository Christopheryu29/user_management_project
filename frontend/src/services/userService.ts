import axios from 'axios';
import { User, UserFormData, UsersResponse } from '../types/User';

const API_BASE_URL = 'http://localhost:5001/api';

export const userService = {
  async getUsers(page: number = 1, limit: number = 6, search: string = ''): Promise<UsersResponse> {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { page, limit, search }
    });
    // Handle new backend response format
    if (response.data.success !== undefined) {
      return {
        users: response.data.users,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        total: response.data.total
      };
    }
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },

  async createUser(userData: UserFormData): Promise<User> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('gender', userData.gender);
    formData.append('birthday', userData.birthday);
    formData.append('occupation', userData.occupation);
    formData.append('phone', userData.phone);
    
    if (userData.image) {
      formData.append('image', userData.image);
    }

    const response = await axios.post(`${API_BASE_URL}/users`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Handle new backend response format
    return response.data.user || response.data;
  },

  async updateUser(id: string, userData: UserFormData): Promise<User> {
    console.log('updateUser called with:', id, userData);
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('gender', userData.gender);
    formData.append('birthday', userData.birthday);
    formData.append('occupation', userData.occupation);
    formData.append('phone', userData.phone);
    
    if (userData.image) {
      formData.append('image', userData.image);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('updateUser response:', response.data);
      // Handle new backend response format  
      return response.data.user || response.data;
    } catch (error) {
      console.error('updateUser error:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    console.log('deleteUser called with:', id);
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
      console.log('deleteUser response:', response.data);
    } catch (error) {
      console.error('deleteUser error:', error);
      throw error;
    }
  },
};