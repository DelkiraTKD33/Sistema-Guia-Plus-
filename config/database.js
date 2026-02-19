const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guiaplus', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`\n✅ MongoDB conectado exitosamente: ${conn.connection.host}`);
        console.log(`📊 Base de datos: ${conn.connection.name}\n`);
    } catch (error) {
        console.error(`\n❌ Error al conectar a MongoDB: ${error.message}`);
        console.log('\n💡 Asegúrate de que MongoDB esté instalado y corriendo en tu computadora.');
        console.log('   Para iniciar MongoDB, ejecuta: mongod\n');
        process.exit(1);
    }
};

module.exports = conectarDB;
