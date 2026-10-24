import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API de Gestión Hotelera (PMS) - UAS FIM',
      version: '1.0.0',
      description: 'Especificación formal y documentación interactiva de la API REST del Sistema PMS (Property Management System).',
      contact: {
        name: 'Dr. Herman Geovany Ayala Zúñiga',
        email: 'hayala@uas.edu.mx'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido en /api/users/login o /api/v1/auth/login para acceder a rutas protegidas.'
        }
      },
      schemas: {
        ErrorRFC7807: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'URI de referencia que identifica el tipo de error',
              example: 'https://example.com/probs/invalid-request'
            },
            title: {
              type: 'string',
              description: 'Resumen legible del error',
              example: 'Entidad no procesable o datos inválidos'
            },
            status: {
              type: 'integer',
              description: 'Código de estado HTTP devuelto por el servidor',
              example: 422
            },
            detail: {
              type: 'string',
              description: 'Explicación detallada específica de esta ocurrencia del problema',
              example: 'El precio por noche debe ser mayor a 0 y el número de habitación es requerido.'
            },
            instance: {
              type: 'string',
              description: 'URI que identifica la solicitud específica que generó el error',
              example: '/api/v1/rooms'
            }
          },
          required: ['type', 'title', 'status', 'detail']
        },
        RoomInput: {
          type: 'object',
          required: ['room_number', 'type', 'price_per_night', 'capacity'],
          properties: {
            room_number: {
              type: 'string',
              description: 'Identificador único o número de la habitación',
              example: '101'
            },
            type: {
              type: 'string',
              enum: ['STANDARD', 'SUITE', 'DELUXE', 'PRESIDENCIAL'],
              description: 'Categoría o tipo de la habitación',
              example: 'SUITE'
            },
            price_per_night: {
              type: 'number',
              minimum: 1,
              description: 'Costo por noche de estancia',
              example: 1250.50
            },
            capacity: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              description: 'Capacidad máxima de huéspedes',
              example: 3
            },
            status: {
              type: 'string',
              enum: ['DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'LIMPIEZA'],
              default: 'DISPONIBLE',
              example: 'DISPONIBLE'
            }
          }
        },
        RoomResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'b7c1264b-5517-4ef8-a28a-7964b0716c52'
            },
            room_number: {
              type: 'string',
              example: '101'
            },
            type: {
              type: 'string',
              example: 'SUITE'
            },
            price_per_night: {
              type: 'number',
              example: 1250.50
            },
            capacity: {
              type: 'integer',
              example: 3
            },
            status: {
              type: 'string',
              example: 'DISPONIBLE'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-24T12:00:00Z'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Nombre de usuario o correo electrónico',
              example: 'admin'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario',
              example: 'Admin123!'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JSON Web Token (JWT) firmado',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'usr-101' },
                username: { type: 'string', example: 'admin' },
                email: { type: 'string', example: 'admin@pms.uas.edu.mx' },
                role: { type: 'string', example: 'ADMINISTRADOR' }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './miniproyecto/src/components/**/*.ts',
    './miniproyecto/src/routes/*.ts',
    './miniproyecto/src/config/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
