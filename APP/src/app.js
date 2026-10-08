import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { Loading } from './src/components/UI';
import { colors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import ProdutosScreen from './src/screens/ProdutosScreen';
import ProdutoDetalheScreen from './src/screens/ProdutoDetalheScreen';
import ProdutoFormScreen from './src/screens/ProdutoFormScreen';
import CardapiosScreen from './src/screens/CardapiosScreen';
import CardapioDetalheScreen from './src/screens/CardapioDetalheScreen';
import CardapioFormScreen from './src/screens/CardapioFormScreen';
import CarrinhoScreen from './src/screens/CarrinhoScreen';
import PedidosScreen from './src/screens/PedidosScreen';
import PedidoDetalheScreen from './src/screens/PedidoDetalheScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = {
  Produtos: 'restaurant-outline',
  Cardápios: 'book-outline',
  Carrinho: 'cart-outline',
  Pedidos: 'receipt-outline',
  Perfil: 'person-outline',
};

const headerOpts = {
  headerStyle: { backgroundColor: colors.bg },
  headerTitleStyle: { fontWeight: '900', color: colors.ink },
  headerTintColor: colors.primary,
  headerShadowVisible: false,
};

function Tabs() {
  const { quantidadeTotal } = useCart();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOpts,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Produtos" component={ProdutosScreen} />
      <Tab.Screen name="Cardápios" component={CardapiosScreen} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} options={{ tabBarBadge: quantidadeTotal || undefined, tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.ink } }} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { usuario, carregando } = useAuth();
  if (carregando) return <Loading />;
  if (!usuario) return <LoginScreen />;
  return (
    <Stack.Navigator screenOptions={headerOpts}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProdutoDetalhe" component={ProdutoDetalheScreen} options={{ title: 'Produto' }} />
      <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen} options={({ route }) => ({ title: route.params?.produto ? 'Editar produto' : 'Novo produto' })} />
      <Stack.Screen name="CardapioDetalhe" component={CardapioDetalheScreen} options={{ title: 'Cardápio' }} />
      <Stack.Screen name="CardapioForm" component={CardapioFormScreen} options={{ title: 'Novo cardápio' }} />
      <Stack.Screen name="PedidoDetalhe" component={PedidoDetalheScreen} options={{ title: 'Pedido' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } }}>
          <StatusBar style="dark" />
          <Root />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
