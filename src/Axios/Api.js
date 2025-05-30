import axios from 'axios';

const Api = axios.create({
baseURL: '/api', // كل الطلبات تبدأ من /api (عشان البروكسي في dev أو التوجيه في production)
withCredentials: true,
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json',
},
});

// هنا تقدر تضيف Interceptors لو تبغى (مثلا إضافة توكن بشكل أوتوماتيكي)

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default Api;
