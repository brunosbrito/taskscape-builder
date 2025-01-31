import API_URL from '@/config';
import axios from 'axios';

// Função para criar uma nova atividade
export const createActivity = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/activities`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating activity', error);
    throw error;
  }
};

// Função para obter todas as atividades
export const getAllActivities = async () => {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities', error);
    throw error;
  }
};

export const getActivitiesByServiceOrderId = async (serviceOrderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/activities/service-order/${serviceOrderId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching activities', error);
    throw error;
  }
};

// Função para atualizar uma atividade
export const updateActivity = async (id: number, formData: FormData) => {
  try {
    const response = await axios.put(
      `${API_URL}/activities/${id}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating activity', error);
    throw error;
  }
};

// Função para excluir uma atividade
export const deleteActivity = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting activity', error);
    throw error;
  }
};
