import axios from 'axios';
export const API = axios.create({ baseURL: 'https://e-backend-rf04.onrender.com/api' });
export const fetchCategories = () => API.get('/categories');

// import axios from 'axios';

// export const API = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL
// });


// export const fetchCategories = () => API.get('/categories');
