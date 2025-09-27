const buildResponse = ({ success, code, message, data }) => {
  const response = { success, code, message };
  if (data !== undefined) {
    response.data = data;
  }
  return response;
};

module.exports = { buildResponse };
