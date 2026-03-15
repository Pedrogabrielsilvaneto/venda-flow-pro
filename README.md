# 🏠 Pereira Acabamentos - Bot WhatsApp

Bot de atendimento automático para WhatsApp da loja **Pereira Acabamentos**.

## ✨ Funcionalidades

- 🤖 **Atendimento Automático**: Responde mensagens instantaneamente
- 👤 **Coleta de Dados**: Captura nome e e-mail do cliente
- 🏷️ **Catálogo de Promoções**: Mostra produtos em promoção baseado no interesse
- 📐 **Orçamento Automático**: Calcula orçamentos com base na metragem
- 👨‍💼 **Encaminhamento**: Encaminha para vendedor humano quando necessário
- 📊 **Dashboard**: Painel web para monitorar todas as conversas

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o bot
```bash
npm start
```

### 3. Conectar o WhatsApp
- Abra o navegador em `http://localhost:3000`
- Um QR Code será exibido no terminal
- Abra o WhatsApp > Dispositivos Conectados > Conectar Dispositivo
- Escaneie o QR Code

### 4. Pronto!
O bot responderá automaticamente todas as mensagens recebidas.

## 📋 Fluxo de Atendimento

1. **Boas-vindas** → Bot se apresenta e pede o nome
2. **Coleta de dados** → Pede e-mail (opcional)
3. **Catálogo** → Mostra categorias disponíveis
4. **Promoções** → Exibe produtos em promoção da categoria
5. **Detalhes** → Mostra informações detalhadas do produto
6. **Orçamento** → Calcula valor baseado na metragem
7. **Vendedor** → Encaminha para atendimento humano

## 🎯 Categorias de Produtos

- 🏛️ Porcelanato
- 🧱 Piso Cerâmico
- 🎨 Revestimento
- 🔧 Acabamentos
- 🪵 Piso Vinílico

## 💻 Dashboard

Acesse `http://localhost:3000` para o painel com:
- Estatísticas em tempo real
- Lista de conversas
- Histórico de mensagens
- Status da conexão WhatsApp

## 📁 Estrutura do Projeto

```
pereira-acabamentos-bot/
├── index.js              # Servidor principal
├── package.json
├── src/
│   ├── catalogo.js       # Catálogo de produtos
│   └── conversationFlow.js # Fluxo de conversa (estado)
├── public/
│   ├── index.html        # Dashboard HTML
│   ├── style.css         # Estilos do dashboard
│   └── app.js            # JavaScript do dashboard
└── README.md
```

## ⚙️ Comandos do Bot

O cliente pode enviar estes comandos durante a conversa:
- `/menu` - Voltar ao menu de categorias
- `/reiniciar` - Reiniciar a conversa do zero
- `voltar` - Voltar à tela anterior
