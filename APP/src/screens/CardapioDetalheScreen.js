import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as api from '../api';
import { Badge, Button, Loading, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { brl, colors } from '../theme';

export default function CardapioDetalheScreen({ route, navigation }) {
  const { id } = route.params;
  const { isAdmin } = useAuth();
  const [c, setC] = useState(null);

  useEffect(() => {
    api.obterCardapio(id).then(setC).catch((e) => { Alert.alert('Erro', e.message); navigation.goBack(); });
  }, [id]);

  const excluir = () =>
    Alert.alert('Excluir cardápio', `Remover "${c.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await api.excluirCardapio(id); navigation.goBack(); }
          catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);

  if (!c) return <Loading />;
  const produtos = c.produtos || [];

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Badge label={c.disponivel ? 'Em vigor' : 'Fora de vigor'} color={c.disponivel ? colors.ok : colors.muted} />
      <Text style={{ fontSize: 28, fontWeight: '900', color: colors.ink, marginTop: 10 }}>{c.nome}</Text>
      <Text style={{ color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 6, marginBottom: 18 }}>{c.descricao}</Text>

      {produtos.length === 0 && <Text style={{ color: colors.muted }}>Este cardápio ainda não tem produtos.</Text>}
      {produtos.map((p) => (
        <Pressable key={p.id} onPress={() => navigation.navigate('ProdutoDetalhe', { id: p.id })} style={[s.card, { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10 }]}>
          {p.imagem ? (
            <Image source={{ uri: api.imgUrl(p.imagem) }} style={{ width: 54, height: 54, borderRadius: 12 }} />
          ) : (
            <View style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22 }}>🍽️</Text>
            </View>
          )}
          <Text style={{ flex: 1, marginLeft: 12, fontWeight: '800', color: colors.ink }}>{p.nome}</Text>
          <Text style={{ fontWeight: '900', color: colors.primary }}>{brl(p.preco)}</Text>
        </Pressable>
      ))}

      {isAdmin && <Button title="Excluir cardápio" variant="danger" style={{ marginTop: 16 }} onPress={excluir} />}
    </ScrollView>
  );
}
