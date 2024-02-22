import React from 'react'

const CartContext = React.createContext({
  cartList: [],
  activeCategory: 'Salads and Soup',
  removeAllCartItems: () => {},
  addCartItem: () => {},
  removeCartItem: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
})

export default CartContext
