const esc = encodeURIComponent;
exports.queryString = params =>
  Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
