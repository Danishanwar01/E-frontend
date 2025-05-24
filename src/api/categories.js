import axios from 'axios';
export const API = axios.create({ baseURL: 'https://e-backend-rf04.onrender.com/api' });
export const fetchCategories = () => API.get('/categories');
