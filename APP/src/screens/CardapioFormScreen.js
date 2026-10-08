import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import * as api from '../api';
import { Button, Field, Loading } from '../components/UI';
import { brl, colors } from '../theme';

export default function CardapioFormScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [produtos, setProdutos] = useState(null);
  const [sel, setSel] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.listarProdutos().then((r) => setProdutos(Array.isArray(r) ? r : [])).catch((e) => { Alert.alert('Erro', e.message); setProdutos([]); });
  }, []);

  const alternar = (id) => setSel((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const salvar = async () => {
    if (!nome) return Alert.alert('Campo obrigatório', 'Dê um nome ao cardápio.');
    if (sel.length === 0) return Alert.alert('Escolha os produtos', 'Selecione pelo menos um produto.');
    setLoading(true);
    try {
      await api.criarCardapio({ nome, descricao, disponivel, produtos: sel });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Não foi possível salvar', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!produtos) return <Loading />;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Ex.: Almoço executivo" />
      <Field label="Descrição" value={descricao} onChangeText={setDescricao} multiline placeholder="Quando e para quem é este cardápio" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <Text style={{ fontWeight: '800', color: colors.ink }}>Em vigor</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ true: colors.primary }} />
      </View>

      <Text style={{ fontWeight: '800', color: colors.ink, marginBottom: 10 }}>Produtos ({sel.length} selecionados)</Text>
      {produtos.map((p) => {
        const on = sel.includes(p.id);
        return (
          <Pressable key={p.id} onPress={() => alternar(p.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: on ? colors.primarySoft : colors.surface, borderWidth: 1.5, borderColor: on ? colors.primary : colors.line }}>
            <Text style={{ flex: 1, fontWeight: '700', color: colors.ink }}>{p.nome}</Text>
            <Text style={{ color: colors.muted }}>{brl(p.preco)}</Text>
          </Pressable>
        );
      })}

      <Button title="Criar cardápio" onPress={salvar} loading={loading} style={{ marginTop: 14 }} />
    </ScrollView>
  );
}
