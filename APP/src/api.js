import { API_URL } from './config';

let token = null;
export const setToken = (t) => {
  token = t;
};

// Imagem vem como /public/uploads/... -> junta com o endereço da API
export const imgUrl = (p) => (!p ? null : p.startsWith('http') ? p : `${API_URL}${p}`);

// Produtos e cardápios vêm como { sucesso, dados }; pedidos vêm direto.
const un = (r) => (r && typeof r === 'object' && !Array.isArray(r) && 'dados' in r ? r.dados : r);

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form; // NÃO definir Content-Type: o fetch coloca o boundary sozinho
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(API_URL + path, { method, headers, body: payload });
  } catch {
    throw new Error('Sem conexão com a API. Confira o IP em src/config.js e se o servidor está rodando.');
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(data?.mensagem || data?.erro || data?.message || `Erro ${res.status}`);
  }
  return data;
}

const produtoForm = (p) => {
  const f = new FormData();
  ['nome', 'descricao', 'preco', 'categoria'].forEach((k) => {
    if (p[k] !== undefined && p[k] !== '') f.append(k, String(p[k]));
  });
  if (p.disponivel !== undefined) f.append('disponivel', String(p.disponivel));
  if (p.imagem) f.append('imagem', { uri: p.imagem.uri, name: p.imagem.name, type: p.imagem.type });
  return f;
};

// ---------- Autenticação ----------
export const registrar = (d) => request('/auth/registrar', { method: 'POST', body: d }).then(un);
export const login = (d) => request('/auth/login', { method: 'POST', body: d }).then(un);

// ---------- Produtos ----------
export const listarProdutos = () => request('/produtos').then(un);
export const obterProduto = (id) => request(`/produtos/${id}`).then(un);
export const criarProduto = (p) => request('/produtos', { method: 'POST', form: produtoForm(p) }).then(un);
export const editarProduto = (id, p) =>
  request(`/produtos/${id}`, { method: 'PUT', form: produtoForm(p) }).then(un);
export const excluirProduto = (id) => request(`/produtos/${id}`, { method: 'DELETE' });

// ---------- Cardápios ----------
export const listarCardapios = () => request('/cardapios').then(un);
export const obterCardapio = (id) => request(`/cardapios/${id}`).then(un);
export const criarCardapio = (d) => request('/cardapios', { method: 'POST', body: d }).then(un);
export const excluirCardapio = (id) => request(`/cardapios/${id}`, { method: 'DELETE' });

// ---------- Pedidos ----------
export const criarPedido = (d) => request('/pedidos', { method: 'POST', body: d });
export const listarPedidos = () => request('/pedidos');
export const obterPedido = (id) => request(`/pedidos/${id}`);
export const atualizarStatus = (id, status) =>
  request(`/pedidos/${id}/status`, { method: 'PATCH', body: { status } });
export const excluirPedido = (id) => request(`/pedidos/${id}`, { method: 'DELETE' });
