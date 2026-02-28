
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import { processMessageLogic } from './src/lib/bot-logic.js';

console.log('Connecting to db:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI).then(async () => {
   console.log('Connected');
   await processMessageLogic('551911111111', 'ola', async (to, text) => {
      console.log('REPLIED TO', to, ':', text);
   });
   console.log('DONE');
   process.exit(0);
}).catch(console.error);
