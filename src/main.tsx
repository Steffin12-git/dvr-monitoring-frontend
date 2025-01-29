import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  console.error('API base URL is not set in the environment variables.');
  throw new Error('Base URL is not defined in .env file');
}

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

export default axios;