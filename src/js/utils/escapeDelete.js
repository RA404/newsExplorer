export default function escape(string) {
  var htmlEscapes = {
      '&': '',
      '<': '',
      '>': '',
      '"': '',
      "'": ''
  };

  return string.replace(/[&<>"']/g, function(match) {
      return htmlEscapes[match];
  });
};