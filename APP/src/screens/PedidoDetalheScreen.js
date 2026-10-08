import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api';
import { Badge, Button, Chip, Loading, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { STATUS, brl, colors, statusColors } from '../theme';

export default function PedidoDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { isAdmin } = useAuth();
  const [p, setP] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const r = await api.obterPedido(id);
      setP(r?.dados ?? r);
    } catch (e) {
      Alert.alert('Erro', e.message);
      navigation.goBack();
    }
  }, [id]);
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const mudarStatus = async (status) => {
    try {
      await api.atualizarStatus(id, status);
      await carregar();
    } catch (e) {
      Alert.alert('Não foi possível atualizar', e.message);
    }
  };

  const excluir = () =>
    Alert.alert('Excluir pedido', `Remover o pedido #${id}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await api.excluirPedido(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  if (!p) return <Loading />;
  const itens = p.itens || [];

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: colors.ink }}>Pedido #{p.id}</Text>
      <Text style={{ color: colors.muted, marginVertical: 6 }}>{p.cliente}</Text>
      <Badge label={p.status} color={statusColors[p.status] || colors.muted} />

      <View style={[s.card, { padding: 14, marginTop: 18 }]}>
        {itens.map((i, idx) => (
          <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text style={{ color: colors.ink, fontWeight: '700' }}>
              {i.quantidade}× {i.nome || i.produto_nome || `Produto #${i.produto_id}`}
            </Text>
            {(i.preco_unitario ?? i.preco) != null && (
              <Text style={{ color: colors.muted }}>{brl(Number(i.preco_unitario ?? i.preco) * i.quantidade)}</Text>
            )}
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: '800', color: colors.muted }}>Total</Text>
          <Text style={{ fontWeight: '900', fontSize: 20, color: colors.primary }}>{brl(p.total)}</Text>
        </View>
      </View>

      {isAdmin && (
        <>
          <Text style={{ fontWeight: '800', color: colors.ink, marginTop: 22, marginBottom: 10 }}>Atualizar status</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {STATUS.map((st) => (
              <Chip key={st} label={st} active={p.status === st} color={statusColors[st]} onPress={() => mudarStatus(st)} />
            ))}
          </View>
          <Button title="Excluir pedido" variant="danger" style={{ marginTop: 18 }} onPress={excluir} />
        </>
      )}
    </ScrollView>
  );
}
