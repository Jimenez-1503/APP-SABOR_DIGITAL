import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function PerfilScreen() {
  const { usuario, sair, isAdmin } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: '900', color: colors.ink }}>{usuario.nome?.[0]?.toUpperCase()}</Text>
      </View>
      <Text style={{ fontSize: 26, fontWeight: '900', color: colors.ink, marginTop: 14 }}>{usuario.nome}</Text>
      <Text style={{ color: colors.muted, marginVertical: 4 }}>{usuario.email}</Text>
      <Badge label={isAdmin ? 'Administrador' : 'Cliente'} color={colors.primary} />
      <Button title="Sair da conta" variant="ghost" style={{ marginTop: 28 }} onPress={sair} />
    </View>
  );
}
