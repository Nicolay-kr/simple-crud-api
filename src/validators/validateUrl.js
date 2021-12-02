const { validate } = require('uuid');

function validateUrl(url){
  let urlArr = url.split('/');
  if (urlArr[1] === 'person' && urlArr.length <= 3) {
    if (urlArr[2] && !validate(urlArr[2])) {
      return { isValid: false, message: 'id is not uuid', statusCode: 404 };
    }
  } else {
    return { isValid: false, message: 'url is incorrect', statusCode: 404 };
  }
  return { isValid: true, message: 'url is valid' };
};
module.exports = { validateUrl };
