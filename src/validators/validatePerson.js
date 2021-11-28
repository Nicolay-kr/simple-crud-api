function validatePerson(newPerson) {

  if (!newPerson.name || typeof newPerson.name !== 'string') {
    return {
      isValid: false,
      message: newPerson.name ? 'name shoudbe string' : 'name is required',
      statusCode: 400,
    };
  }
  if (!newPerson.age) {
    return {
      isValid: false,
      message: newPerson.name ? 'age shoudbe number' : 'age is required',
      statusCode: 400,
    };
  }
  if (!newPerson.hobbies && typeof newPerson.hobbies !== 'array') {
    return {
      isValid: false,
      message: newPerson.hobbies
        ? 'hobbies shoudbe should be array of string'
        : 'hobbies is required',
      statusCode: 400,
    };
  } else {
    newPerson.hobbies.forEach((element) => {
      if (typeof element !== 'string') {
        return {
          isValid: false,
          message: newPerson.hobbies
            ? 'hobbies shoudbe should be array of string'
            : 'hobbies is required',
          statusCode: 400,
        };
      }
    });
  }
  return {
    isValid: true,
  };;
}
module.exports = { validatePerson };
