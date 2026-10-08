import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as api from '../api';
import { Badge, Button, Empty, Loading, s } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function CardapiosScreen({ navigation }) {
  const { isAdmin } = useAuth();
  const [lista, setLista] = useState(null);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      setErro(null);
      const r = await api.listarCardapios();
      setLista(Array.isArray(r) ? r : []);
    } catch (e) {
      setErro(e.message);
      setLista([]);
    }
  };
  useFocusEffect(useCallback(() => { carregar(); }, []));

  if (!lista) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={lista}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await carregar(); setRefreshing(false); }} />}
        ListEmptyComponent={<Empty title={erro ? 'Falha ao carregar' : 'Nenhum cardápio criado'} hint={erro || (isAdmin ? 'Monte um cardápio escolhendo produtos.' : 'Ainda não há cardápios publicados.')} />}
        renderItem={({ item: c }) => (
          <Pressable onPress={() => navigation.navigate('CardapioDetalhe', { id: c.id })} style={[s.card, { padding: 16, marginBottom: 12, borderLeftWidth: 6, borderLeftColor: c.disponivel ? colors.accent : colors.line }]}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: colors.ink }}>{c.nome}</Text>
            <Text style={{ color: colors.muted, marginVertical: 6 }} numberOfLines={2}>{c.descricao}</Text>
            <Badge label={c.disponivel ? 'Em vigor' : 'Fora de vigor'} color={c.disponivel ? colors.ok : colors.muted} />
          </Pressable>
        )}
      />
      {isAdmin && (
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <Button title="Novo cardápio" onPress={() => navigation.navigate('CardapioForm')} />
        </View>
      )}
    </View>
  );
}
