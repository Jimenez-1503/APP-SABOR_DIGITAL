import React, { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import * as api from '../api';
import { Button, Empty, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { brl, colors } from '../theme';

const Qtd = ({ label, onPress }) => (
  <Pressable onPress={onPress} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontWeight: '900', color: colors.primary, fontSize: 18 }}>{label}</Text>
  </Pressable>
);

export default function CarrinhoScreen({ navigation }) {
  const { usuario } = useAuth();
  const { itens, alterar, limpar, totalEstimado } = useCart();
  const [loading, setLoading] = useState(false);

  const finalizar = async () => {
    setLoading(true);
    try {
      // O total é calculado pela API: enviamos só produto_id e quantidade.
      await api.criarPedido({
        cliente: usuario.nome,
        itens: itens.map((i) => ({ produto_id: i.produto.id, quantidade: i.quantidade })),
      });
      limpar();
      Alert.alert('Pedido enviado', 'A cozinha já recebeu o seu pedido.');
      navigation.navigate('Pedidos');
    } catch (e) {
      Alert.alert('Não foi possível enviar o pedido', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (itens.length === 0) return <Empty title="Seu carrinho está vazio" hint='Toque no "+" de um produto para começar o pedido.' />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={itens}
        keyExtractor={(i) => String(i.produto.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: i }) => (
          <View style={[s.card, { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 10 }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: colors.ink, fontSize: 16 }}>{i.produto.nome}</Text>
              <Text style={{ color: colors.muted }}>{brl(i.produto.preco)} cada</Text>
            </View>
            <Qtd label="−" onPress={() => alterar(i.produto.id, -1)} />
            <Text style={{ width: 34, textAlign: 'center', fontWeight: '900', fontSize: 16 }}>{i.quantidade}</Text>
            <Qtd label="+" onPress={() => alterar(i.produto.id, 1)} />
          </View>
        )}
      />
      <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: colors.muted, fontWeight: '700' }}>Total estimado</Text>
          <Text style={{ fontWeight: '900', fontSize: 20, color: colors.ink }}>{brl(totalEstimado)}</Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>O valor final é calculado pelo restaurante ao enviar.</Text>
        <Button title="Fazer pedido" variant="accent" onPress={finalizar} loading={loading} />
        <Button title="Esvaziar carrinho" variant="ghost" onPress={limpar} style={{ marginTop: 8, borderWidth: 0 }} />
      </View>
    </View>
  );
}
