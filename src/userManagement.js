const User = require('./models/User');

async function getUsers() {
    try {
        return await User.find({}).lean();
    } catch (e) {
        console.error("Erro ao carregar usuários do DB:", e);
        return [];
    }
}

async function addUser(userData) {
    // Check if username exists
    const existing = await User.findOne({ username: userData.username });
    if (existing) {
        throw new Error("Usuário já existe");
    }

    const newUser = new User({
        name: userData.name,
        username: userData.username,
        password: userData.password, // Em prod, usar hash!
        role: userData.role === 'ADMIN' ? 'ADMIN' : 'VENDEDOR',
        signature: userData.signature || userData.name,
        active: true
    });

    await newUser.save();
    return newUser.toObject();
}

async function updateUser(id, updates) {
    try {
        const updated = await User.findOneAndUpdate({ id }, updates, { new: true });
        return updated ? updated.toObject() : null;
    } catch(e) {
        // Fallback para _id se id falhar (Next.js usa _id, o bot pode usar id manual)
        const updated = await User.findByIdAndUpdate(id, updates, { new: true });
        return updated ? updated.toObject() : null;
    }
}

async function deleteUser(id) {
    // Evita deletar o admin principal se ele tiver um username específico
    const user = await User.findById(id);
    if (user && user.username === 'admin') throw new Error("Não é possível deletar o admin principal");
    
    await User.findByIdAndDelete(id);
}

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
