import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api';
import { Badge, Button, Chip, Empty, Loading, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { brl, colors } from '../theme';

export default function ProdutosScreen({ navigation }) {
  const { isAdmin } = useAuth();
  const { adicionar } = useCart();
  const [produtos, setProdutos] = useState(null);
  const [erro, setErro] = useState(null);
  const [categoria, setCategoria] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      setErro(null);
      const r = await api.listarProdutos();
      setProdutos(Array.isArray(r) ? r : []);
    } catch (e) {
      setErro(e.message);
      setProdutos([]);
    }
  };

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const categorias = useMemo(
    () => ['Todos', ...new Set((produtos || []).map((p) => p.categoria).filter(Boolean))],
    [produtos]
  );
  const lista = (produtos || []).filter((p) => categoria === 'Todos' || p.categoria === categoria);

  if (!produtos) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4 }}>
          {categorias.map((c) => (
            <Chip key={c} label={c} active={c === categoria} onPress={() => setCategoria(c)} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await carregar(); setRefreshing(false); }} />}
        ListEmptyComponent={<Empty title={erro ? 'Falha ao carregar' : 'Nenhum produto por aqui'} hint={erro || (isAdmin ? 'Toque em "Novo produto" para cadastrar o primeiro.' : 'Volte mais tarde.')} />}
        renderItem={({ item: p }) => (
          <Pressable onPress={() => navigation.navigate('ProdutoDetalhe', { id: p.id })} style={[s.card, { flexDirection: 'row', marginBottom: 12, overflow: 'hidden' }]}>
            {p.imagem ? (
              <Image source={{ uri: api.imgUrl(p.imagem) }} style={{ width: 104, height: 104, backgroundColor: colors.primarySoft }} />
            ) : (
              <View style={{ width: 104, height: 104, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30 }}>🍽️</Text>
              </View>
            )}
            <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: colors.ink }} numberOfLines={1}>{p.nome}</Text>
                <Text style={{ color: colors.muted, marginTop: 2 }} numberOfLines={2}>{p.descricao}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 17, fontWeight: '900', color: colors.primary }}>{brl(p.preco)}</Text>
                  {!p.disponivel && <Badge label="Indisponível" color={colors.danger} />}
                </View>
                {!!p.disponivel && (
                  <Pressable onPress={() => adicionar(p)} style={{ backgroundColor: colors.accent, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: colors.ink, marginTop: -2 }}>+</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />

      {isAdmin && (
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <Button title="Novo produto" onPress={() => navigation.navigate('ProdutoForm')} />
        </View>
      )}
    </View>
  );
}
