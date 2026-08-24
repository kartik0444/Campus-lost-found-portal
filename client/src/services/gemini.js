import api from './api';

export const matchItemsWithAI = async (query, type) => {
  try {
    const response = await api.post('/ai/match', { query, type });
    return response.data;
  } catch (error) {
    console.error('Error calling AI match:', error);
    throw error;
  }
};

export const generateDescriptionWithAI = async (title, category, keywords) => {
  try {
    const response = await api.post('/ai/generate-description', { title, category, keywords });
    return response.data.description;
  } catch (error) {
    console.error('Error calling AI description generator:', error);
    throw error;
  }
};
