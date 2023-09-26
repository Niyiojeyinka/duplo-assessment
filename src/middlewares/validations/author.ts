export const registerValidationSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', errorMessage: { type: 'Not a valid email', required: 'Email is required' } },
      password: { type: 'string', minLength: 5, errorMessage: { type: 'Password should be at least 5 chars', required: 'Password is required' } },
      name: { type: 'string', errorMessage: { type: 'Name should be a string', required: 'Name is required' } }
    },
    required: ['email', 'password', 'name'],
    additionalProperties: false
  }
};

export const loginValidationSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', errorMessage: { type: 'Not a valid email', required: 'Email is required' } },
      password: { type: 'string', minLength: 5, errorMessage: { type: 'Password should be at least 5 chars', required: 'Password is required' } }
    },
    required: ['email', 'password'],
    additionalProperties: false
  }
};
