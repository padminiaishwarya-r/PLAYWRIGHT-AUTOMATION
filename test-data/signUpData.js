import {
    generateRandomEmail,
    generateUSMobile,
    generateStrongPassword
  } from '../utils/dataGenerator';
  
  const validPassword = generateStrongPassword();
  
  export const signUpTestData = {
    valid: {
      firstname: 'Automation',
      lastname: 'Tester',
      email: generateRandomEmail(),
      mobile: generateUSMobile(),
      password: validPassword,
      confirmpassword: validPassword
    },
  
    emptyFirstname: {
      firstname: '',
      lastname: 'Tester',
      email: generateRandomEmail(),
      mobile: generateUSMobile(),
      password: validPassword,
      confirmpassword: validPassword,
      error: 'This is a required field.'
    },
  
    emptyLastname: {
      firstname: 'Automation',
      lastname: '',
      email: generateRandomEmail(),
      mobile: generateUSMobile(),
      password: validPassword,
      confirmpassword: validPassword,
      error: 'This is a required field.'
    },
  
    invalidMobile: {
      firstname: 'Automation',
      lastname: 'Tester',
      email: generateRandomEmail(),
      mobile: '12345',
      password: validPassword,
      confirmpassword: validPassword,
      error: 'Please enter a valid mobile number.'
    },
  
    weakPassword: {
        firstname: 'Automation',
        lastname: 'Tester',
        email: generateRandomEmail(),
        mobile: '4155552671',
        password: '12345',
        confirmpassword: '12345',
        error: 'The password needs at least 8 characters'
      },
      
  
    passwordMismatch: {
      firstname: 'Automation',
      lastname: 'Tester',
      email: generateRandomEmail(),
      mobile: generateUSMobile(),
      password: validPassword,
      confirmpassword: 'Mismatch@123',
      error: 'Please enter the same value again.'
    }
  };
  