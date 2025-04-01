const validationFunctions = {
  id: () => '',
  
  name: (value) => {
    const validNameRegex = RegExp(/^([a-zA-Z -]+)$/);
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return safeValue.length < 4 || !validNameRegex.test(safeValue)
      ? 'Name must be 4 characters long and only contain letters and spaces.'
      : '';
  },
  
  username: (value) => {
    const validUsernameRegex = RegExp(/^([a-zA-Z0-9_-]+)$/);
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return safeValue.length < 4 || !validUsernameRegex.test(safeValue)
      ? 'Username must be 4 characters long and only contain alphanumeric characters and underscores.'
      : '';
  },
  
  email: (value) => {
    const validEmailRegex = RegExp(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return validEmailRegex.test(safeValue) ? '' : 'Email is not valid.';
  },
  
  password: (value) => {
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return safeValue.length < 5 ? 'Password must be 5 characters long!' : '';
  },
  
  passwordUpdate: (value) => {
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return safeValue.length !== 0 && safeValue.length < 5
      ? 'Password must be 5 characters long!'
      : '';
  },
  
  passwordConfirmation: (value, password) => {
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    return safeValue === password
      ? ''
      : 'Password and password confirmation must match!';
  },
  
  phoneNumber: (value) => {
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    const parsedValue = safeValue.replace(/\D+/g, '');
    return parsedValue.length === 0 || parsedValue.length === 10
      ? ''
      : 'Phone number must be exactly 10 digits long.';
  },
  
  postalCode: (value) => {
    const safeValue = value || ''; // Safeguard: use empty string if value is undefined
    const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
    return safeValue.length === 0 || postalCodeRegex.test(safeValue)
      ? ''
      : 'Postal code must look like: A1A1A1 or A1A 1A1.';
  },
  
  emailNotification: () => '',
  smsNotification: () => '',
  categories: () => '',
};

export default validationFunctions;
