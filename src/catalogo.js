// Catálogo de produtos da Pereira Acabamentos
const catalogo = {
  porcelanato: [
    {
      id: 'porc001',
      nome: 'Porcelanato Marmo Bianco 80x80',
      descricao: 'Porcelanato polido com visual de mármore branco, ideal para salas e ambientes elegantes.',
      precoOriginal: 89.90,
      precoPromocional: 69.90,
      unidade: 'm²',
      imagem: 'porcelanato_marmo_bianco.jpg',
      destaque: true,
      categoria: 'porcelanato',
    },
    {
      id: 'porc002',
      nome: 'Porcelanato Cimento Grigio 60x60',
      descricao: 'Porcelanato acetinado com visual de cimento queimado, estilo industrial moderno.',
      precoOriginal: 69.90,
      precoPromocional: 49.90,
      unidade: 'm²',
      imagem: 'porcelanato_cimento_grigio.jpg',
      destaque: true,
      categoria: 'porcelanato',
    },
    {
      id: 'porc003',
      nome: 'Porcelanato Madeira Noce 20x120',
      descricao: 'Porcelanato com visual de madeira natural, perfeito para quartos e varandas.',
      precoOriginal: 79.90,
      precoPromocional: 59.90,
      unidade: 'm²',
      imagem: 'porcelanato_madeira_noce.jpg',
      destaque: true,
      categoria: 'porcelanato',
    },
  ],
  piso_ceramico: [
    {
      id: 'cer001',
      nome: 'Piso Cerâmico Classic Bege 45x45',
      descricao: 'Piso cerâmico resistente, ideal para áreas internas e externas. Fácil manutenção.',
      precoOriginal: 39.90,
      precoPromocional: 29.90,
      unidade: 'm²',
      imagem: 'ceramico_classic_bege.jpg',
      destaque: true,
      categoria: 'piso_ceramico',
    },
    {
      id: 'cer002',
      nome: 'Piso Cerâmico Granilha Cinza 50x50',
      descricao: 'Piso cerâmico com acabamento granilha, antiderrapante, ótimo para garagens.',
      precoOriginal: 34.90,
      precoPromocional: 24.90,
      unidade: 'm²',
      imagem: 'ceramico_granilha_cinza.jpg',
      destaque: false,
      categoria: 'piso_ceramico',
    },
  ],
  revestimento: [
    {
      id: 'rev001',
      nome: 'Revestimento Subway White 10x20',
      descricao: 'Revestimento tipo metrô branco brilhante, clássico para cozinhas e banheiros.',
      precoOriginal: 49.90,
      precoPromocional: 34.90,
      unidade: 'm²',
      imagem: 'revestimento_subway_white.jpg',
      destaque: true,
      categoria: 'revestimento',
    },
    {
      id: 'rev002',
      nome: 'Revestimento 3D Prisma Branco 30x60',
      descricao: 'Revestimento 3D com efeito geométrico, moderno e sofisticado.',
      precoOriginal: 59.90,
      precoPromocional: 44.90,
      unidade: 'm²',
      imagem: 'revestimento_3d_prisma.jpg',
      destaque: true,
      categoria: 'revestimento',
    },
  ],
  acabamentos: [
    {
      id: 'acab001',
      nome: 'Rodapé Poliestireno Branco 7cm',
      descricao: 'Rodapé de poliestireno de alta qualidade, fácil instalação, visual sofisticado.',
      precoOriginal: 12.90,
      precoPromocional: 8.90,
      unidade: 'metro linear',
      imagem: 'rodape_poliestireno.jpg',
      destaque: false,
      categoria: 'acabamentos',
    },
    {
      id: 'acab002',
      nome: 'Perfil de Acabamento Alumínio L',
      descricao: 'Perfil de alumínio para acabamento em cantos e transições de piso.',
      precoOriginal: 18.90,
      precoPromocional: 14.90,
      unidade: 'metro linear',
      imagem: 'perfil_aluminio.jpg',
      destaque: false,
      categoria: 'acabamentos',
    },
    {
      id: 'acab003',
      nome: 'Rejunte Flexível Premium Cinza 1kg',
      descricao: 'Rejunte flexível antifungo, para porcelanatos e cerâmicas.',
      precoOriginal: 24.90,
      precoPromocional: 18.90,
      unidade: 'kg',
      imagem: 'rejunte_premium.jpg',
      destaque: false,
      categoria: 'acabamentos',
    },
  ],
  piso_vinilico: [
    {
      id: 'vin001',
      nome: 'Piso Vinílico Click Carvalho 18x122',
      descricao: 'Piso vinílico com sistema click, visual de carvalho natural. Silencioso e confortável.',
      precoOriginal: 89.90,
      precoPromocional: 69.90,
      unidade: 'm²',
      imagem: 'vinilico_carvalho.jpg',
      destaque: true,
      categoria: 'piso_vinilico',
    },
    {
      id: 'vin002',
      nome: 'Piso Vinílico Régua Ipê 18x122',
      descricao: 'Piso vinílico régua com visual de ipê, resistente à água.',
      precoOriginal: 79.90,
      precoPromocional: 64.90,
      unidade: 'm²',
      imagem: 'vinilico_ipe.jpg',
      destaque: false,
      categoria: 'piso_vinilico',
    },
  ],
};

// Mapeamento de nomes amigáveis das categorias
const categoriaNomes = {
  porcelanato: '🏛️ Porcelanato',
  piso_ceramico: '🧱 Piso Cerâmico',
  revestimento: '🎨 Revestimento',
  acabamentos: '🔧 Acabamentos',
  piso_vinilico: '🪵 Piso Vinílico',
};

function getProdutosEmPromocao(categoria = null) {
  if (categoria && catalogo[categoria]) {
    return catalogo[categoria].filter((p) => p.precoPromocional < p.precoOriginal);
  }
  // Todos os produtos em promoção
  let todos = [];
  for (const cat of Object.values(catalogo)) {
    todos = todos.concat(cat.filter((p) => p.precoPromocional < p.precoOriginal));
  }
  return todos;
}

function getProdutosDestaque(categoria = null) {
  if (categoria && catalogo[categoria]) {
    return catalogo[categoria].filter((p) => p.destaque);
  }
  let todos = [];
  for (const cat of Object.values(catalogo)) {
    todos = todos.concat(cat.filter((p) => p.destaque));
  }
  return todos;
}

function formatarProduto(produto) {
  const desconto = Math.round(
    ((produto.precoOriginal - produto.precoPromocional) / produto.precoOriginal) * 100
  );
  return (
    `✨ *${produto.nome}*\n` +
    `${produto.descricao}\n\n` +
    `~~De R$ ${produto.precoOriginal.toFixed(2)}~~\n` +
    `🔥 *Por R$ ${produto.precoPromocional.toFixed(2)}/${produto.unidade}*\n` +
    `💰 Economia de ${desconto}%!`
  );
}

function formatarListaProdutos(produtos, titulo = '🏷️ *PROMOÇÕES IMPERDÍVEIS*') {
  let msg = `${titulo}\n${'━'.repeat(25)}\n\n`;
  produtos.forEach((produto, index) => {
    msg += `${index + 1}. ${formatarProduto(produto)}\n\n`;
    if (index < produtos.length - 1) {
      msg += `${'─'.repeat(25)}\n\n`;
    }
  });
  msg += `${'━'.repeat(25)}\n`;
  msg += `📍 *Pereira Acabamentos*\n`;
  msg += `📞 Condições especiais por tempo limitado!\n`;
  msg += `💬 Responda com o número do produto para mais informações.`;
  return msg;
}

function getCategoriasDisponiveis() {
  let msg = '*Qual tipo de produto você está procurando?* 🏠\n\n';
  const categorias = Object.keys(catalogo);
  categorias.forEach((cat, index) => {
    msg += `${index + 1}. ${categoriaNomes[cat]}\n`;
  });
  msg += `\n${categorias.length + 1}. 🌟 Ver todas as promoções\n`;
  msg += `\nDigite o *número* da opção desejada:`;
  return { mensagem: msg, categorias };
}

function identificarCategoriaDoAnuncio(textoAnuncio) {
  const texto = textoAnuncio.toLowerCase();

  if (texto.includes('porcelanato') || texto.includes('mármore') || texto.includes('marmore')) {
    return 'porcelanato';
  }
  if (
    texto.includes('cerâmic') ||
    texto.includes('ceramic') ||
    texto.includes('piso') ||
    texto.includes('chão')
  ) {
    return 'piso_ceramico';
  }
  if (
    texto.includes('revestimento') ||
    texto.includes('parede') ||
    texto.includes('azulejo') ||
    texto.includes('banheiro') ||
    texto.includes('cozinha')
  ) {
    return 'revestimento';
  }
  if (
    texto.includes('acabamento') ||
    texto.includes('rodapé') ||
    texto.includes('rejunte') ||
    texto.includes('perfil')
  ) {
    return 'acabamentos';
  }
  if (
    texto.includes('vinílico') ||
    texto.includes('vinilico') ||
    texto.includes('madeira') ||
    texto.includes('laminado')
  ) {
    return 'piso_vinilico';
  }

  return null; // Não identificou categoria específica
}

module.exports = {
  catalogo,
  categoriaNomes,
  getProdutosEmPromocao,
  getProdutosDestaque,
  formatarProduto,
  formatarListaProdutos,
  getCategoriasDisponiveis,
  identificarCategoriaDoAnuncio,
};
