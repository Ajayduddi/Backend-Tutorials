export const userSchema = {
  name: {
    isString: {
        errorMessage: 'name must be a string',
    },
    notEmpty: {
        errorMessage: 'name is required',
    },
    isLength: {
        options: {min: 3, max: 30},
        errorMessage: 'name must be between 3 to 30 characters',
    }
  },
  email: {
    isString: {
        errorMessage: 'email must be a string',
    },
    notEmpty: {
        errorMessage: 'email is required',
    },
    isEmail: {
        errorMessage: 'email is not valid',
    }
  },
};