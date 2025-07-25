const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        'https://gantt-product-tracker.vercel.app',
        'http://localhost:5173',
    ],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true
}));

const recipeRoutes = require('./Routers/recipe.routes');
const processRoutes = require('./Routers/process.routes');
const itemRoutes = require('./Routers/item.routes');
const adminRoutes = require('./Routers/auth.route');

app.use('/api', recipeRoutes);
app.use('/api', processRoutes);
app.use('/api', itemRoutes);
app.use('/admin',adminRoutes)
app.get('/', (req, res) => {
    res.send('Hello Backend')
});

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected....");
    }).catch((err) => {
        console.log('❌ MongoDB Connection Error: ', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
}) 