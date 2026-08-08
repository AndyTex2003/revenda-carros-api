const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Revenda de Carros API',
    description: 'API REST para gerenciamento de uma revenda de veículos.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticação e perfil de usuário' },
    { name: 'Health', description: 'Verificação de status da API' },
    { name: 'Veículos', description: 'Operações de gerenciamento de veículos' },
    { name: 'Clientes', description: 'Operações de gerenciamento de clientes' },
    { name: 'Vendas', description: 'Operações de gerenciamento de vendas' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
        description: 'Identificador único do recurso',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
        example: {
          message: 'Recurso não encontrado',
        },
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
          },
          password: {
            type: 'string',
          },
        },
        required: ['email', 'password'],
        example: {
          email: 'admin@revendacarros.com',
          password: 'SenhaSegura123!',
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
          },
        },
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...example',
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          profile: { type: 'string', enum: ['ADMIN', 'VENDEDOR'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        example: {
          id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Admin User',
          email: 'admin@revendacarros.com',
          profile: 'ADMIN',
          createdAt: '2026-08-07T12:00:00.000Z',
          updatedAt: '2026-08-07T12:00:00.000Z',
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          brand: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'integer' },
          color: { type: 'string' },
          mileage: { type: 'integer' },
          price: { type: 'number' },
          plate: { type: 'string' },
          status: { type: 'string', enum: ['DISPONIVEL', 'VENDIDO'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        example: {
          id: 'e1af1110-2d64-4ca8-a68f-8b0d7bd9a6a5',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2024,
          color: 'Prata',
          mileage: 12000,
          price: 98000.0,
          plate: 'ABC1234',
          status: 'DISPONIVEL',
          createdAt: '2026-08-07T12:00:00.000Z',
          updatedAt: '2026-08-07T12:00:00.000Z',
        },
      },
      NewVehicle: {
        type: 'object',
        properties: {
          brand: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'integer' },
          color: { type: 'string' },
          mileage: { type: 'integer' },
          price: { type: 'number' },
          plate: { type: 'string' },
          status: { type: 'string', enum: ['DISPONIVEL', 'VENDIDO'] },
        },
        required: ['brand', 'model', 'year', 'color', 'mileage', 'price', 'plate', 'status'],
        example: {
          brand: 'Toyota',
          model: 'Corolla',
          year: 2024,
          color: 'Prata',
          mileage: 12000,
          price: 98000.0,
          plate: 'ABC1234',
          status: 'DISPONIVEL',
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          cpf: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        example: {
          id: '4c4b147d-9f1c-4e1a-9c79-95f9f9d0c1a4',
          name: 'João Silva',
          cpf: '12345678901',
          email: 'joao.silva@example.com',
          phone: '+55 11 98765-4321',
          createdAt: '2026-08-07T12:00:00.000Z',
          updatedAt: '2026-08-07T12:00:00.000Z',
        },
      },
      NewCustomer: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          cpf: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
        required: ['name', 'cpf', 'email', 'phone'],
        example: {
          name: 'João Silva',
          cpf: '12345678901',
          email: 'joao.silva@example.com',
          phone: '+55 11 98765-4321',
        },
      },
      Sale: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          customerId: { type: 'string', format: 'uuid' },
          vehicleId: { type: 'string', format: 'uuid' },
          salePrice: { type: 'number' },
          saleDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        example: {
          id: 'a1234b56-c789-4d01-8e23-45f678901234',
          customerId: '4c4b147d-9f1c-4e1a-9c79-95f9f9d0c1a4',
          vehicleId: 'e1af1110-2d64-4ca8-a68f-8b0d7bd9a6a5',
          salePrice: 94000.0,
          saleDate: '2026-08-07T12:00:00.000Z',
          createdAt: '2026-08-07T12:00:00.000Z',
          updatedAt: '2026-08-07T12:00:00.000Z',
        },
      },
      NewSale: {
        type: 'object',
        properties: {
          customerId: { type: 'string', format: 'uuid' },
          vehicleId: { type: 'string', format: 'uuid' },
          salePrice: { type: 'number' },
        },
        required: ['customerId', 'vehicleId', 'salePrice'],
        example: {
          customerId: '4c4b147d-9f1c-4e1a-9c79-95f9f9d0c1a4',
          vehicleId: 'e1af1110-2d64-4ca8-a68f-8b0d7bd9a6a5',
          salePrice: 94000.0,
        },
      },
      UpdateSale: {
        type: 'object',
        properties: {
          salePrice: { type: 'number' },
        },
        required: ['salePrice'],
        example: {
          salePrice: 95000.0,
        },
      },
    },
  },
  paths: {
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar usuário e gerar token JWT',
        description: 'Realiza login com email e senha e retorna um token JWT válido.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticação bem-sucedida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Retornar perfil do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Perfil do usuário autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/admin': {
      get: {
        tags: ['Auth'],
        summary: 'Rota reservada para usuários ADMIN',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Acesso autorizado para ADMIN',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Acesso autorizado para ADMIN' },
                },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar estado da API',
        description: 'Retorna status de funcionamento da API.',
        security: [],
        responses: {
          '200': {
            description: 'API funcionando corretamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    service: { type: 'string' },
                  },
                },
                example: {
                  status: 'ok',
                  service: 'Revenda Carros API',
                },
              },
            },
          },
        },
      },
    },
    '/vehicles': {
      post: {
        tags: ['Veículos'],
        summary: 'Criar veículo',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewVehicle' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Veículo criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vehicle' },
              },
            },
          },
          '400': {
            description: 'Dados de veículo inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Placa já cadastrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Veículos'],
        summary: 'Listar veículos',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de veículos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Vehicle' },
                },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/vehicles/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: {
        tags: ['Veículos'],
        summary: 'Buscar veículo por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Veículo encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vehicle' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Veículo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Veículos'],
        summary: 'Atualizar veículo por ID',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewVehicle' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Veículo atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vehicle' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Veículo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Placa já cadastrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Veículos'],
        summary: 'Remover veículo por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': {
            description: 'Veículo removido com sucesso',
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Veículo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers': {
      post: {
        tags: ['Clientes'],
        summary: 'Criar cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewCustomer' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cliente criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
          '400': {
            description: 'Dados de cliente inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'CPF ou email já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Customer' },
                },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: {
        tags: ['Clientes'],
        summary: 'Buscar cliente por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Atualizar cliente por ID',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewCustomer' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cliente atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'CPF ou email já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Remover cliente por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': {
            description: 'Cliente removido com sucesso',
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/sales': {
      post: {
        tags: ['Vendas'],
        summary: 'Criar venda',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewSale' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Venda criada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sale' },
              },
            },
          },
          '400': {
            description: 'Dados de venda inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente ou veículo não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Veículo não disponível para venda ou já vendido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Vendas'],
        summary: 'Listar vendas',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de vendas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Sale' },
                },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/sales/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: {
        tags: ['Vendas'],
        summary: 'Buscar venda por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Venda encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sale' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Venda não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Vendas'],
        summary: 'Atualizar valor de venda por ID',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSale' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Venda atualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sale' },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Venda não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Vendas'],
        summary: 'Remover venda por ID',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': {
            description: 'Venda removida com sucesso',
          },
          '401': {
            description: 'Token ausente ou inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Usuário sem permissão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Venda não encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

export default openApiDocument;
