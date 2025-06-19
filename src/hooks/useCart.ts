import { useState, useEffect } from 'react';
import { db } from '../data/db';
import { useMemo } from 'react';
import type { Guitar, CartItem } from '../types';

export const useCart = () => {
  const inicialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(inicialCart);
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCard(item: Guitar) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExist >= 0) {
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });

    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  // State Derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCard,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
