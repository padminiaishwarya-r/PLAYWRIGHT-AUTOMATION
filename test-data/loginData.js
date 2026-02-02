export const loginTestData = {
    valid: {
      email: 'automationtesting1@mailinator.com',
      password: 'Carat567@'
    },
  
    invalidEmail: {
      email: 'invalid@mailinator.com',
      password: 'Carat567@',
      error: 'Invalid login or password.'
    },
  
    invalidPassword: {
      email: 'automationtesting1@mailinator.com',
      password: 'WrongPass123',
      error: 'Invalid login or password.'
    },
  
    emptyEmail: {
      email: '',
      password: 'Carat567@',
      error: 'This is a required field.'
    },
  
    emptyPassword: {
      email: 'automationtesting1@mailinator.com',
      password: '',
      error: 'This is a required field.'
    },
  
    emptyBoth: {
      email: '',
      password: '',
      error: 'This is a required field.'
    }
  };
  