import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]); // [{ produto, quantidade }]

  const adicionar = (produto) =>
    setItens((cur) => {
      const achou = cur.find((i) => i.produto.id === produto.id);
      return achou
        ? cur.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i))
        : [...cur, { produto, quantidade: 1 }];
    });

  const alterar = (id, delta) =>
    setItens((cur) =>
      cur
        .map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );

  const limpar = () => setItens([]);
  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);
  const totalEstimado = itens.reduce((s, i) => s + i.quantidade * Number(i.produto.preco || 0), 0);

  return (
    <CartContext.Provider value={{ itens, adicionar, alterar, limpar, quantidadeTotal, totalEstimado }}>
      {children}
    </CartContext.Provider>
  );
}
