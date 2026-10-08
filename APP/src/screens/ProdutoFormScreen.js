import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as api from '../api';
import { Button, Field } from '../components/UI';
import { colors } from '../theme';

export default function ProdutoFormScreen({ route, navigation }) {
  const editando = route.params?.produto;
  const [nome, setNome] = useState(editando?.nome || '');
  const [descricao, setDescricao] = useState(editando?.descricao || '');
  const [preco, setPreco] = useState(editando ? String(editando.preco) : '');
  const [categoria, setCategoria] = useState(editando?.categoria || '');
  const [disponivel, setDisponivel] = useState(editando ? !!editando.disponivel : true);
  const [imagem, setImagem] = useState(null); // nova imagem escolhida
  const [loading, setLoading] = useState(false);

  const escolherImagem = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (r.canceled) return;
    const a = r.assets[0];
    setImagem({ uri: a.uri, name: a.fileName || 'produto.jpg', type: a.mimeType || 'image/jpeg' });
  };

  const salvar = async () => {
    if (!nome || !preco) return Alert.alert('Campos obrigatórios', 'Informe pelo menos nome e preço.');
    const dados = { nome, descricao, preco: preco.replace(',', '.'), categoria, disponivel, imagem };
    setLoading(true);
    try {
      if (editando) await api.editarProduto(editando.id, dados);
      else await api.criarProduto(dados);
      navigation.popToTop();
    } catch (e) {
      Alert.alert('Não foi possível salvar', e.message);
    } finally {
      setLoading(false);
    }
  };

  const preview = imagem?.uri || (editando?.imagem ? api.imgUrl(editando.imagem) : null);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Pressable onPress={escolherImagem} style={{ height: 180, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        {preview ? (
          <Image source={{ uri: preview }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Text style={{ color: colors.primary, fontWeight: '800' }}>Toque para escolher a foto (JPG ou PNG, até 5 MB)</Text>
        )}
      </Pressable>

      <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Ex.: Lasanha de berinjela" />
      <Field label="Descrição" value={descricao} onChangeText={setDescricao} multiline placeholder="Ingredientes, porção..." />
      <Field label="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" placeholder="29,90" />
      <Field label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Ex.: Massas" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontWeight: '800', color: colors.ink }}>Disponível para pedido</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ true: colors.primary }} />
      </View>

      <Button title={editando ? 'Salvar alterações' : 'Cadastrar produto'} onPress={salvar} loading={loading} />
    </ScrollView>
  );
}
