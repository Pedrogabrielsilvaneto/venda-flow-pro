import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../src/models/Lead.js';
import Product from '../src/models/Product.js';
import User from '../src/models/User.js';
import Config from '../src/models/Config.js';

dotenv.config({ path: '.env.local' });

async function cleanup() {
    console.log('🚀 Iniciando limpeza total do banco de dados...');
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI não encontrada!');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado ao MongoDB');

        // Limpando Coleções de Produção
        const leadRes = await Lead.deleteMany({});
        console.log(`🧹 Leads deletados: ${leadRes.deletedCount}`);

        // Opcional: Se quiser limpar produtos também, mas geralmente o catálogo deve persistir.
        // Como o usuário pediu para "iniciar um novo atendimento sem interversões anteriores",
        // vou focar em Leads e sessões.
        
        console.log('✅ Banco de dados limpo com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro na limpeza:', error);
        process.exit(1);
    }
}

cleanup();
