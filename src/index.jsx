import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query'; // إضافة React Query
import i18n from './Utils/i18n';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'; // إضافة React Query DevTools



const queryClient = new QueryClient(); // إنشاء الـ QueryClient

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>  {/* تغليف التطبيق بـ QueryClientProvider */}
        <App />
        <ReactQueryDevtools initialIsOpen={false} /> {/* إضافة React Query DevTools */}
      </QueryClientProvider>
    </Provider>
);
