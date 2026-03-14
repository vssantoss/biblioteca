/**
 * Biblioteca - Utility library for AJAX requests
 * By Victor Santos (Updated 2026)
 *
 * Modernized from the 2012 jQuery-based version.
 * No dependencies required.
 */

/**
 * Serializes a form element into a plain object.
 *
 * @param {HTMLFormElement} form - The form element to serialize.
 * @returns {Object} Key-value pairs from the form fields.
 *
 * @example
 * const data = serializeForm(document.querySelector('#myForm'));
 * // { name: "Victor", email: "victor@example.com" }
 */
function serializeForm(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

/**
 * Loads scripts and stylesheets sequentially, skipping duplicates.
 *
 * @param {string[]} files - Array of JS/CSS file paths to load.
 * @returns {Promise<void>} Resolves when all files are loaded.
 *
 * @example
 * await loadScripts(['/js/utils.js', '/css/theme.css']);
 */
const loadScripts = (() => {
  const loaded = new Set();

  return function loadScripts(files) {
    return files.reduce((chain, file) => {
      return chain.then(() => {
        if (loaded.has(file)) return;
        loaded.add(file);

        const ext = file.split('.').pop().toLowerCase();

        if (ext === 'css') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = file;
          document.head.appendChild(link);
          return;
        }

        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = file;
          script.onload = resolve;
          script.onerror = () => reject(new Error(`Failed to load ${file}`));
          document.head.appendChild(script);
        });
      });
    }, Promise.resolve());
  };
})();

/**
 * Class for making AJAX requests.
 *
 * @example
 * const api = new Requisicao('https://example.com/api');
 *
 * // POST with form-encoded data
 * const result = await api.post('save', { name: 'Victor' });
 *
 * // POST with JSON body
 * const result = await api.json('save', { name: 'Victor' });
 *
 * // GET request
 * const result = await api.get('list', { page: 1 });
 */
class Requisicao {
  /**
   * @param {string} url - Base URL for requests.
   * @param {Object} [options]
   * @param {boolean} [options.webservice=true] - When true, the operation name
   *   is appended to the URL path. When false, it is sent as an "Operacao" parameter.
   */
  constructor(url, { webservice = true } = {}) {
    this.url = url.endsWith('/') ? url : url + '/';
    this.webservice = webservice;
  }

  /**
   * POST with form-encoded data (application/x-www-form-urlencoded).
   *
   * @param {string} operation - The endpoint or operation name.
   * @param {Object|string} [data=''] - Data to send.
   * @param {Function} [callback] - Optional callback (receives parsed response).
   *   If omitted, returns a Promise instead.
   * @returns {Promise<any>}
   */
  async post(operation, data = '', callback) {
    let body;

    if (typeof data === 'object' && data !== null) {
      body = new URLSearchParams(data).toString();
    } else {
      body = data;
    }

    if (!this.webservice) {
      body = 'Operacao=' + operation + (body ? '&' : '') + body;
    }

    const url = this.webservice ? this.url + operation : this.url;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const result = await response.text();

    if (callback) callback(result);
    return result;
  }

  /**
   * POST with a JSON body (application/json).
   *
   * @param {string} operation - The endpoint or operation name.
   * @param {Object} data - Data to send (must be an object).
   * @param {Function} [callback] - Optional callback (receives parsed response).
   *   If omitted, returns a Promise instead.
   * @returns {Promise<any>}
   */
  async json(operation, data, callback) {
    const url = this.webservice ? this.url + operation : this.url;

    const body = this.webservice
      ? JSON.stringify(data)
      : JSON.stringify({ Operacao: operation, ...data });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const result = await response.json();

    if (callback) callback(result);
    return result;
  }

  /**
   * GET request with query parameters.
   *
   * @param {string} operation - The endpoint or operation name.
   * @param {Object} [params={}] - Query parameters.
   * @param {Function} [callback] - Optional callback (receives parsed response).
   *   If omitted, returns a Promise instead.
   * @returns {Promise<any>}
   */
  async get(operation, params = {}, callback) {
    const url = new URL(this.webservice ? this.url + operation : this.url);

    if (!this.webservice) {
      params.Operacao = operation;
    }

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url);
    const result = await response.json();

    if (callback) callback(result);
    return result;
  }
}
