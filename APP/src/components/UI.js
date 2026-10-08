import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const bg = { primary: colors.primary, accent: colors.accent, danger: colors.danger, ghost: 'transparent' }[variant];
  const fg = variant === 'accent' ? colors.ink : variant === 'ghost' ? colors.primary : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        {...props}
        style={[s.input, props.multiline && { height: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Chip({ label, active, onPress, color }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.chip, active && { backgroundColor: color || colors.primary, borderColor: color || colors.primary }]}
    >
      <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, color }) {
  return (
    <View style={[s.badge, { backgroundColor: color + '22' }]}>
      <Text style={{ color, fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function Empty({ title, hint }) {
  return (
    <View style={s.center}>
      <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>{title}</Text>
      {hint ? <Text style={{ color: colors.muted, marginTop: 6, textAlign: 'center' }}>{hint}</Text> : null}
    </View>
  );
}

export const s = StyleSheet.create({
  btn: { paddingVertical: 14, 
        paddingHorizontal: 18,
        borderRadius: 14,
        alignItems: 'center' 
      },

  btnText: { fontWeight: '800',
             fontSize: 15 
          },

  label: { color: colors.muted,
           fontWeight: '700',
           marginBottom: 6,
           fontSize: 13 
          },

  input: { backgroundColor: colors.surface,
           borderRadius: 12, 
           borderWidth: 1, 
           borderColor: colors.line,
           paddingHorizontal: 14, 
           paddingVertical: 12, 
           fontSize: 16, 
           color: colors.ink,
          },

  chip: { paddingHorizontal: 14, 
          paddingVertical: 8, 
          borderRadius: 20, 
          borderWidth: 1.5,
          borderColor: colors.line, 
          backgroundColor: colors.surface, 
          marginRight: 8, 
          marginBottom: 8,
        },

  chipText: { fontWeight: '700', 
              color: colors.ink 
            },

  badge: { paddingHorizontal: 10, 
           paddingVertical: 4, 
           borderRadius: 10, 
           alignSelf: 'flex-start' 
          },

  center: { flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 32 
          },

  card: { backgroundColor: colors.surface, 
          borderRadius: 18, 
          borderWidth: 1, 
          borderColor: colors.line 
        },

});
