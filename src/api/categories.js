// import axios from 'axios';
// export const API = axios.create({ baseURL: 'http://localhost:5000/api' });
// export const fetchCategories = () => API.get('/categories');

import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});


export const fetchCategories = () => API.get('/categories');
