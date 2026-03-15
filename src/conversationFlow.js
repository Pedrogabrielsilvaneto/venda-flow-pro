const {
    getProdutosEmPromocao,
    getProdutosDestaque,
    formatarListaProdutos,
    getCategoriasDisponiveis,
    identificarCategoriaDoAnuncio,
    formatarProduto,
    catalogo,
    categoriaNomes,
} = require('./catalogo');

const { generateAIResponse } = require('./aiAssistant');

// Armazém de conversas em memória
const conversas = new Map();

const ESTADOS = {
    NOVO: 'novo',
    AGUARDANDO_NOME: 'aguardando_nome',
    AGUARDANDO_EMAIL: 'aguardando_email',
    MOSTRANDO_CATEGORIAS: 'mostrando_categorias',
    MOSTRANDO_PRODUTOS: 'mostrando_produtos',
    AGUARDANDO_PRODUTO: 'aguardando_produto',
    DECIDINDO: 'decidindo',
    ENCAMINHANDO_VENDEDOR: 'encaminhando_vendedor',
    FINALIZADO: 'finalizado'
};

function getConversa(numero) {
    if (!conversas.has(numero)) {
        conversas.set(numero, {
            numero,
            estado: 'novo',
            nome: null,
            email: null,
            interesse: null,
            categoriaAtual: null,
            produtosExibidos: [],
            historico: [],
            criadoEm: new Date(),
            ultimaMensagem: new Date(),
        });
    }
    const conversa = conversas.get(numero);
    conversa.ultimaMensagem = new Date();
    return conversa;
}

function getAllConversas() {
    return Array.from(conversas.values()).sort(
        (a, b) => b.ultimaMensagem - a.ultimaMensagem
    );
}

function registrarMensagem(conversa, remetente, texto) {
    conversa.historico.push({
        remetente, // 'cliente' ou 'bot'
        texto,
        timestamp: new Date(),
    });
}

// Processamento principal da mensagem - Agora via IA
async function processarMensagem(numero, mensagem) {
    const conversa = getConversa(numero);
    const texto = mensagem.trim();

    registrarMensagem(conversa, 'cliente', texto);

    // Comandos de sistema continuam rápidos
    if (texto.toLowerCase() === '/reiniciar' || texto.toLowerCase() === '/reset') {
        conversas.delete(numero);
        return ['🔄 Sistema de IA reiniciado. Envie um "Olá" para começar.'];
    }

    // Gerar resposta inteligente via Agente Virtual
    const respostaIA = await generateAIResponse(conversa, texto);
    
    const respostas = [respostaIA];
    respostas.forEach((r) => registrarMensagem(conversa, 'bot', r));
    
    return respostas;
}

// ================ HANDLERS ================

function handleNovo(conversa, texto) {
    conversa.estado = ESTADOS.AGUARDANDO_NOME;

    // Tenta identificar a categoria do anúncio de onde o cliente veio
    const categoriaAnuncio = identificarCategoriaDoAnuncio(texto);
    if (categoriaAnuncio) {
        conversa.interesse = categoriaAnuncio;
    }

    return [
        `Olá! 👋 Seja muito bem-vindo(a) à *Pereira Acabamentos*! 🏠✨\n\n` +
        `Somos especialistas em pisos, revestimentos e acabamentos de alta qualidade, ` +
        `sempre com os melhores preços da região! 💪\n\n` +
        `Estamos com *promoções incríveis* este mês! 🔥\n\n` +
        `Para te atender da melhor forma, poderia me informar seu *nome*, por favor? 😊`,
    ];
}

function handleNome(conversa, texto) {
    // Validação simples do nome
    const nome = texto.trim();
    if (nome.length < 2 || /^\d+$/.test(nome)) {
        return [
            `Desculpe, não entendi. Poderia me informar seu *nome completo*, por favor? 😊`,
        ];
    }

    conversa.nome = nome;
    conversa.estado = ESTADOS.AGUARDANDO_EMAIL;

    return [
        `Prazer em te conhecer, *${nome}*! 🤝\n\n` +
        `Para que possamos enviar as melhores ofertas e novidades, ` +
        `poderia me informar seu *e-mail*? 📧\n\n` +
        `_(Se preferir, pode digitar "pular" para continuar sem e-mail)_`,
    ];
}

function handleEmail(conversa, texto) {
    const email = texto.trim().toLowerCase();

    if (email === 'pular' || email === 'não' || email === 'nao') {
        conversa.email = 'Não informado';
    } else {
        // Validação simples de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return [
                `Hmm, esse e-mail não parece válido. 🤔\n\n` +
                `Por favor, informe um e-mail válido ou digite *"pular"* para continuar sem e-mail.`,
            ];
        }
        conversa.email = email;
    }

    // Se já identificou interesse do anúncio, mostra produtos direto
    if (conversa.interesse) {
        conversa.estado = ESTADOS.MOSTRANDO_PRODUTOS;
        const produtos = getProdutosEmPromocao(conversa.interesse);
        conversa.produtosExibidos = produtos;
        const catNome = categoriaNomes[conversa.interesse] || conversa.interesse;

        return [
            `Perfeito, *${conversa.nome}*! ✅\n\n` +
            `Vi que você tem interesse em ${catNome}! ` +
            `Temos ofertas incríveis nessa categoria! 🎉\n\n` +
            `Deixa eu te mostrar nossas melhores promoções:`,
            formatarListaProdutos(
                produtos,
                `🏷️ *PROMOÇÕES - ${catNome.toUpperCase()}*`
            ),
        ];
    }

    // Senão, mostra as categorias
    conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
    const { mensagem } = getCategoriasDisponiveis();

    return [
        `Perfeito, *${conversa.nome}*! ✅\n\n` +
        `Agora me conta, o que te trouxe até a *Pereira Acabamentos* hoje? 🏠`,
        mensagem,
    ];
}

function handleInteresse(conversa, texto) {
    conversa.interesse = texto;
    conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
    const { mensagem } = getCategoriasDisponiveis();
    return [mensagem];
}

function handleCategoria(conversa, texto) {
    const opcao = parseInt(texto);
    const categorias = Object.keys(catalogo);

    if (isNaN(opcao) || opcao < 1 || opcao > categorias.length + 1) {
        // Tenta identificar pela mensagem do cliente
        const categoriaIdentificada = identificarCategoriaDoAnuncio(texto);
        if (categoriaIdentificada) {
            conversa.categoriaAtual = categoriaIdentificada;
            conversa.estado = ESTADOS.MOSTRANDO_PRODUTOS;
            const produtos = getProdutosEmPromocao(categoriaIdentificada);
            conversa.produtosExibidos = produtos;
            const catNome = categoriaNomes[categoriaIdentificada];

            return [
                formatarListaProdutos(
                    produtos,
                    `🏷️ *PROMOÇÕES - ${catNome.toUpperCase()}*`
                ),
            ];
        }

        return [
            `Desculpe, não entendi sua escolha. 😅\n\n` +
            `Por favor, digite o *número* da categoria desejada:`,
            getCategoriasDisponiveis().mensagem,
        ];
    }

    // Opção "Ver todas as promoções"
    if (opcao === categorias.length + 1) {
        conversa.estado = ESTADOS.MOSTRANDO_PRODUTOS;
        const produtos = getProdutosDestaque();
        conversa.produtosExibidos = produtos;

        return [
            formatarListaProdutos(produtos, '🌟 *DESTAQUES EM PROMOÇÃO*'),
        ];
    }

    const categoriaSelecionada = categorias[opcao - 1];
    conversa.categoriaAtual = categoriaSelecionada;
    conversa.estado = ESTADOS.MOSTRANDO_PRODUTOS;
    const produtos = getProdutosEmPromocao(categoriaSelecionada);
    conversa.produtosExibidos = produtos;
    const catNome = categoriaNomes[categoriaSelecionada];

    return [
        formatarListaProdutos(
            produtos,
            `🏷️ *PROMOÇÕES - ${catNome.toUpperCase()}*`
        ),
    ];
}

function handleProduto(conversa, texto) {
    const opcao = parseInt(texto);

    if (isNaN(opcao) || opcao < 1 || opcao > conversa.produtosExibidos.length) {
        // Verifica se quer voltar ao menu
        if (
            texto.toLowerCase().includes('voltar') ||
            texto.toLowerCase().includes('menu') ||
            texto.toLowerCase().includes('outro')
        ) {
            conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
            return [getCategoriasDisponiveis().mensagem];
        }

        return [
            `Por favor, escolha um produto digitando o *número* correspondente (1 a ${conversa.produtosExibidos.length}).\n\n` +
            `Ou digite *"voltar"* para ver outras categorias. 👆`,
        ];
    }

    const produtoSelecionado = conversa.produtosExibidos[opcao - 1];
    conversa.produtoSelecionado = produtoSelecionado;
    conversa.estado = ESTADOS.DETALHES_PRODUTO;

    return [
        `Ótima escolha! 👏\n\n` +
        formatarProduto(produtoSelecionado) +
        `\n\n${'━'.repeat(25)}\n\n` +
        `O que deseja fazer?\n\n` +
        `1️⃣ Solicitar *orçamento* para este produto\n` +
        `2️⃣ Falar com um *vendedor*\n` +
        `3️⃣ Ver *outros produtos*\n` +
        `4️⃣ Voltar ao *menu principal*\n\n` +
        `Digite o número da opção:`,
    ];
}

function handleDetalhesProduto(conversa, texto) {
    const opcao = parseInt(texto);

    switch (opcao) {
        case 1:
            conversa.estado = ESTADOS.AGUARDANDO_ORCAMENTO;
            return [
                `📐 *Vamos preparar seu orçamento!*\n\n` +
                `Para calcularmos a quantidade ideal de *${conversa.produtoSelecionado.nome}*, ` +
                `precisamos de algumas informações:\n\n` +
                `Por favor, nos informe a *metragem aproximada* da área (em m²) ` +
                `onde deseja aplicar o produto:\n\n` +
                `_(Exemplo: 25 m²)_`,
            ];

        case 2:
            conversa.estado = ESTADOS.ENCAMINHANDO_VENDEDOR;
            return [
                `👨‍💼 Perfeito, *${conversa.nome}*!\n\n` +
                `Vou encaminhar você para um de nossos vendedores especializados. ` +
                `Eles poderão te ajudar com todas as informações sobre o *${conversa.produtoSelecionado.nome}*.\n\n` +
                `⏰ Nosso horário de atendimento é:\n` +
                `📅 Segunda a Sexta: 8h às 18h\n` +
                `📅 Sábado: 8h às 13h\n\n` +
                `Um vendedor entrará em contato em breve! 🚀\n\n` +
                `Enquanto isso, posso te ajudar com mais alguma coisa?\n\n` +
                `1️⃣ Ver *outros produtos*\n` +
                `2️⃣ Finalizar atendimento\n\n` +
                `Digite o número da opção:`,
            ];

        case 3:
            conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
            return [getCategoriasDisponiveis().mensagem];

        case 4:
            conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
            return [getCategoriasDisponiveis().mensagem];

        default:
            return [
                `Por favor, escolha uma opção válida (1 a 4):\n\n` +
                `1️⃣ Solicitar *orçamento*\n` +
                `2️⃣ Falar com um *vendedor*\n` +
                `3️⃣ Ver *outros produtos*\n` +
                `4️⃣ Voltar ao *menu principal*`,
            ];
    }
}

function handleOrcamento(conversa, texto) {
    // Tenta extrair a metragem
    const match = texto.match(/(\d+[\.,]?\d*)/);

    if (!match) {
        return [
            `Não consegui entender a metragem. 🤔\n\n` +
            `Por favor, informe apenas o número da metragem em m².\n` +
            `_(Exemplo: 25 ou 30.5)_`,
        ];
    }

    const metragem = parseFloat(match[1].replace(',', '.'));
    const produto = conversa.produtoSelecionado;

    // Calcula com 10% de margem de segurança
    const metComMarginragem = metragem * 1.1;
    const valorTotal = metComMarginragem * produto.precoPromocional;
    const valorOriginal = metComMarginragem * produto.precoOriginal;
    const economia = valorOriginal - valorTotal;

    conversa.estado = ESTADOS.ENCAMINHANDO_VENDEDOR;

    return [
        `📋 *ORÇAMENTO ESTIMADO*\n` +
        `${'━'.repeat(25)}\n\n` +
        `📦 *Produto:* ${produto.nome}\n` +
        `📐 *Área informada:* ${metragem} m²\n` +
        `📐 *Área com margem de segurança (+10%):* ${metComMarginragem.toFixed(1)} m²\n\n` +
        `💰 *Valor unitário:* R$ ${produto.precoPromocional.toFixed(2)}/${produto.unidade}\n` +
        `💰 *Valor estimado total:* R$ ${valorTotal.toFixed(2)}\n\n` +
        `🤑 *Você economiza:* R$ ${economia.toFixed(2)} com nossa promoção!\n\n` +
        `${'━'.repeat(25)}\n\n` +
        `⚠️ _Este é um valor estimado. O valor final pode variar conforme ` +
        `disponibilidade e condições de pagamento._\n\n` +
        `💳 *Formas de pagamento:*\n` +
        `• PIX com 5% de desconto adicional\n` +
        `• Cartão em até 10x sem juros\n` +
        `• Boleto à vista\n\n` +
        `Deseja prosseguir?\n\n` +
        `1️⃣ *Falar com vendedor* para fechar negócio\n` +
        `2️⃣ Ver *outros produtos*\n` +
        `3️⃣ *Finalizar* atendimento`,
    ];
}

function handleVendedor(conversa, texto) {
    const opcao = parseInt(texto);

    switch (opcao) {
        case 1:
            // Falar com vendedor ou ver mais produtos
            if (conversa.estado === ESTADOS.ENCAMINHANDO_VENDEDOR) {
                conversa.estado = ESTADOS.FINALIZADO;
                return [
                    `✅ *Perfeito, ${conversa.nome}!*\n\n` +
                    `Seus dados foram encaminhados para nossa equipe de vendas:\n\n` +
                    `👤 *Nome:* ${conversa.nome}\n` +
                    `📧 *E-mail:* ${conversa.email || 'Não informado'}\n` +
                    `📱 *WhatsApp:* ${conversa.numero}\n\n` +
                    `Um vendedor entrará em contato em breve para finalizar seu pedido! 🚀\n\n` +
                    `Obrigado por escolher a *Pereira Acabamentos*! 🏠💛\n\n` +
                    `_Se precisar de algo mais, é só enviar uma mensagem a qualquer momento!_ 😊`,
                ];
            }
            conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
            return [getCategoriasDisponiveis().mensagem];

        case 2:
            conversa.estado = ESTADOS.MOSTRANDO_CATEGORIAS;
            return [getCategoriasDisponiveis().mensagem];

        case 3:
            conversa.estado = ESTADOS.FINALIZADO;
            return [
                `Obrigado pelo contato, *${conversa.nome}*! 🙏\n\n` +
                `Foi um prazer te atender! Quando precisar de pisos, revestimentos ` +
                `ou acabamentos, lembre-se da *Pereira Acabamentos*! 🏠✨\n\n` +
                `📍 Visite nossa loja e confira todas as promoções pessoalmente!\n\n` +
                `Até logo! 👋😊\n\n` +
                `_Envie qualquer mensagem para iniciar um novo atendimento._`,
            ];

        default:
            return [
                `Por favor, escolha uma opção:\n\n` +
                `1️⃣ Falar com *vendedor*\n` +
                `2️⃣ Ver *outros produtos*\n` +
                `3️⃣ *Finalizar* atendimento`,
            ];
    }
}

module.exports = {
    processarMensagem,
    getConversa,
    getAllConversas,
    ESTADOS,
    conversas,
};
