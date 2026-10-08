import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Button, Chip, Field } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen() {
  const { entrar, cadastrar } = useAuth();
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('cliente');
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!email || !senha || (modo === 'registrar' && !nome)) {
      return Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
    }
    setLoading(true);
    try {
      if (modo === 'login') await entrar(email.trim(), senha);
      else await cadastrar({ nome: nome.trim(), email: email.trim(), senha, papel });
    } catch (e) {
      Alert.alert('Não foi possível entrar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.primary }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 28, paddingTop: 90 }}>
          <View style={{ backgroundColor: colors.accent, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, transform: [{ rotate: '-3deg' }] }}>
            <Text style={{ fontWeight: '900', color: colors.ink }}>pede, chega, saboreia</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 46, fontWeight: '900', lineHeight: 50, marginTop: 14 }}>
            Sabor{'\n'}Digital
          </Text>
        </View>

        <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 36 }}>
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            <Chip label="Entrar" active={modo === 'login'} onPress={() => setModo('login')} />
            <Chip label="Criar conta" active={modo === 'registrar'} onPress={() => setModo('registrar')} />
          </View>

          {modo === 'registrar' && <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />}
          <Field label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="voce@email.com" />
          <Field label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Sua senha" />

          {modo === 'registrar' && (
            <>
              <Text style={{ color: colors.muted, fontWeight: '700', marginBottom: 8, fontSize: 13 }}>Tipo de conta</Text>
              <View style={{ flexDirection: 'row' }}>
                <Chip label="Cliente" active={papel === 'cliente'} onPress={() => setPapel('cliente')} />
                <Chip label="Administrador" active={papel === 'admin'} onPress={() => setPapel('admin')} />
              </View>
            </>
          )}

          <Button title={modo === 'login' ? 'Entrar' : 'Criar conta e entrar'} onPress={enviar} loading={loading} variant="accent" style={{ marginTop: 10 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
