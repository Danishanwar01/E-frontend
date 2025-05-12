
import { API } from './categories';
export const fetchProducts    = params => API.get('/products', { params });
export const fetchProductById = id     => API.get(`/products/${id}`);

