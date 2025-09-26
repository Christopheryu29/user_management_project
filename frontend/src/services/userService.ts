import axios from 'axios';
import { User, UserFormData, UsersResponse } from '../types/User';

const API_BASE_URL = 'http://localhost:5001/api';

export const userService = {
  async getUsers(page: number = 1, limit: number = 6, search: string = ''): Promise<UsersResponse> {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { page, limit, search }
    });
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
    return response.data;
  },

  async updateUser(id: string, userData: UserFormData): Promise<User> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('gender', userData.gender);
    formData.append('birthday', userData.birthday);
    formData.append('occupation', userData.occupation);
    formData.append('phone', userData.phone);
    
    if (userData.image) {
      formData.append('image', userData.image);
    }

    const response = await axios.put(`${API_BASE_URL}/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },
};