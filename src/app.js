import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { requestLogger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT||8081;
const connection = mongoose.connect(`mongodb+srv://coder:coderpass@ecommerce-cluster.f9huqmw.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce-cluster`)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Adoptme',
            version: '1.0.0',
            description: 'Documentación de la API para el sistema de adopción de mascotas',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/docs/*.yaml'],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT,()=>console.log(`Servidor escuchando en puerto ${PORT}`))
}

export default app;
