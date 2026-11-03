const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const checkinRoutes = require('./routes/checkin.routes');
const seasonRoutes = require('./routes/season.routes');
const rankingRoutes = require('./routes/ranking.routes');
const pointRoutes = require('./routes/point.routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NaSalinha API',
      version: '1.0.0',
      description: 'API para sistema de check-in gamificado',
      contact: {
        name: 'Comp Júnior',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário',
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'MEMBER', 'TRAINEE'],
              description: 'Nível de acesso do usuário',
            },
            avatar: {
              type: 'string',
              nullable: true,
              description: 'URL do avatar do usuário',
            },
            isActive: {
              type: 'boolean',
              description: 'Status de ativação do usuário',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Season: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da temporada',
            },
            name: {
              type: 'string',
              description: 'Nome da temporada',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descrição da temporada',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de início',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de término',
            },
            isActive: {
              type: 'boolean',
              description: 'Status de ativação da temporada',
            },
            pointsPerCheckIn: {
              type: 'integer',
              description: 'Pontos por check-in',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        CheckIn: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do check-in',
            },
            photoUrl: {
              type: 'string',
              description: 'URL da foto do check-in',
            },
            points: {
              type: 'integer',
              description: 'Pontos ganhos',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
              description: 'Status do check-in',
            },
            notes: {
              type: 'string',
              nullable: true,
              description: 'Observações sobre o check-in',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário',
            },
            seasonId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da temporada',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Point: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do ponto',
            },
            totalPoints: {
              type: 'integer',
              description: 'Total de pontos',
            },
            checkInsCount: {
              type: 'integer',
              description: 'Quantidade de check-ins',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário',
            },
            seasonId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da temporada',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Mensagem de sucesso',
            },
            data: {
              type: 'object',
              description: 'Dados retornados',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
});
app.use(limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'NaSalinha API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/points', pointRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

app.use(errorHandler);

module.exports = app;
