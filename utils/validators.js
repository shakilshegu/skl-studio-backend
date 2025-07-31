// File: utils/validators.js
export  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  export  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
    
    // Optional: Add more complex password validation
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumbers = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    //   return {
    //     isValid: false,
    //     message: 'Password must contain uppercase, lowercase, number and special character'
    //   };
    // }
    
    return {
      isValid: true,
      message: 'Password is valid'
    };
  };