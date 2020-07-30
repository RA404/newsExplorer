export default function escape(string) {
  var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
  };

  return string.replace(/[&<>"']/g, function(match) {
      return htmlEscapes[match];
  });
};