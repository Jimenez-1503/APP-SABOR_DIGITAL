import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api';
import { Badge, Button, Loading } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { brl, colors } from '../theme';

export default function ProdutoDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { isAdmin } = useAuth();
  const { adicionar } = useCart();
  const [p, setP] = useState(null);

  useFocusEffect(
    useCallback(() => {
      api.obterProduto(id).then(setP).catch((e) => { Alert.alert('Erro', e.message); navigation.goBack(); });
    }, [id])
  );

  const excluir = () =>
    Alert.alert('Excluir produto', `Remover "${p.nome}" do cardápio?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await api.excluirProduto(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  if (!p) return <Loading />;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      {p.imagem ? (
        <Image source={{ uri: api.imgUrl(p.imagem) }} style={{ width: '100%', height: 260, backgroundColor: colors.primarySoft }} />
      ) : (
        <View style={{ height: 180, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 56 }}>🍽️</Text>
        </View>
      )}
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          {!!p.categoria && <Badge label={p.categoria} color={colors.primary} />}
          <Badge label={p.disponivel ? 'Disponível' : 'Indisponível'} color={p.disponivel ? colors.ok : colors.danger} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: colors.ink }}>{p.nome}</Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: colors.primary, marginVertical: 8 }}>{brl(p.preco)}</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.muted }}>{p.descricao}</Text>

        {!!p.disponivel && (
          <Button title="Adicionar ao carrinho" variant="accent" style={{ marginTop: 24 }}
            onPress={() => { adicionar(p); Alert.alert('Adicionado', `${p.nome} está no seu carrinho.`); }} />
        )}
        {isAdmin && (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <Button title="Editar" variant="ghost" style={{ flex: 1 }} onPress={() => navigation.navigate('ProdutoForm', { produto: p })} />
            <Button title="Excluir" variant="danger" style={{ flex: 1 }} onPress={excluir} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
