import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'Enterprise-grade User Management System with MongoDB Atlas and Cloudinary',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com/api' 
          : 'http://localhost:5001/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'gender', 'birthday', 'occupation', 'phone'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier',
              example: '60d0fe4f5311236168a109ca'
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 50,
              example: 'John Doe'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'User gender',
              example: 'Male'
            },
            birthday: {
              type: 'string',
              format: 'date',
              description: 'User birthday',
              example: '1990-01-01'
            },
            occupation: {
              type: 'string',
              enum: ['Student', 'Engineer', 'Teacher', 'Unemployed'],
              description: 'User occupation',
              example: 'Engineer'
            },
            phone: {
              type: 'string',
              description: 'User phone number',
              example: '+1234567890'
            },
            image: {
              type: 'string',
              description: 'Cloudinary image URL',
              example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              example: 'Detailed error information'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'name'
                  },
                  message: {
                    type: 'string',
                    example: 'Name is required'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);