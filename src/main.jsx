import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';
import { CartProvider } from './context/CartContext'
import { ProductCartProvider } from './context/ProductCartContext'

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <CartProvider>
        <ProductCartProvider>
          <App />
        </ProductCartProvider>
      </CartProvider>
    </BrowserRouter>
  </Provider>
);