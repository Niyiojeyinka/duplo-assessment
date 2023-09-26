export const createValidationSchema = {
  body: {
    type: 'object',
    properties: {
      title: { 
        type: 'string',
        errorMessage: { 
          type: 'Title should be a string',
          required: 'Title is required' 
        }
      },
      content: { 
        type: 'string',
        errorMessage: { 
          type: 'Content should be a string',
          required: 'Content is required' 
        }
      }
    },
    required: ['title', 'content'],
    additionalProperties: false
  }
};


export const getValidationSchema = {
  params: {
    type: 'object',
    properties: {
      id: { 
        type: 'number',
        errorMessage: { 
          type: 'Id should be a number',
          required: 'Id is required' 
        }
      }
    },
    required: ['id'],
    additionalProperties: false
  }
};


export const updateValidationSchema = {
  ...getValidationSchema,
  body: {
    type: 'object',
    properties: {
      title: { 
        type: 'string',
        errorMessage: { 
          type: 'Title should be a string'
        }
      },
      content: { 
        type: 'string',
        errorMessage: { 
          type: 'Content should be a string',
        }
      }
    },
    additionalProperties: false
  }
};
