import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem('sessao');
        if (salvo) {
          const { token, usuario: u } = JSON.parse(salvo);
          api.setToken(token);
          setUsuario(u);
        }
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const entrar = async (email, senha) => {
    const r = await api.login({ email, senha });
    api.setToken(r.token);
    await AsyncStorage.setItem('sessao', JSON.stringify({ token: r.token, usuario: r.usuario }));
    setUsuario(r.usuario);
  };

  const cadastrar = async ({ nome, email, senha, papel }) => {
    await api.registrar({ nome, email, senha, papel });
    await entrar(email, senha);
  };

  const sair = async () => {
    api.setToken(null);
    await AsyncStorage.removeItem('sessao');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, entrar, cadastrar, sair, isAdmin: usuario?.papel === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
}
