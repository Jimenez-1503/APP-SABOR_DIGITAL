import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api';
import { Badge, Empty, Loading, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { brl, colors, statusColors } from '../theme';

export default function PedidosScreen({ navigation }) {
  const { usuario, isAdmin } = useAuth();
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      setErro(null);
      const r = await api.listarPedidos();
      const todos = Array.isArray(r) ? r : r?.dados || [];
      // Cliente vê só os próprios pedidos; admin vê todos.
      const meus = isAdmin ? todos : todos.filter((p) => p.cliente === usuario.nome);
      setLista(meus.sort((a, b) => Number(b.id) - Number(a.id)));
    } catch (e) {
      setErro(e.message);
      setLista([]);
    }
  };
  useFocusEffect(useCallback(() => { carregar(); }, [isAdmin]));

  if (!lista) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={lista}
      keyExtractor={(p) => String(p.id)}
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await carregar(); setRefreshing(false); }} />}
      ListEmptyComponent={<Empty title={erro ? 'Falha ao carregar' : 'Nenhum pedido ainda'} hint={erro || 'Seus pedidos aparecem aqui depois que você finalizar o carrinho.'} />}
      renderItem={({ item: p }) => (
        <Pressable onPress={() => navigation.navigate('PedidoDetalhe', { id: p.id })} style={[s.card, { padding: 16, marginBottom: 12 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '900', fontSize: 17, color: colors.ink }}>Pedido #{p.id}</Text>
            <Badge label={p.status} color={statusColors[p.status] || colors.muted} />
          </View>
          <Text style={{ color: colors.muted, marginTop: 4 }}>{p.cliente}</Text>
          <Text style={{ fontWeight: '900', color: colors.primary, fontSize: 18, marginTop: 8 }}>{brl(p.total)}</Text>
        </Pressable>
      )}
    />
  );
}
