# Biblioteca

Personal utility library with code I use across various projects.

## Setup

Include the script in your HTML:

```html
<script src="biblioteca.js"></script>
```

No dependencies required — everything uses native browser APIs.

## Requisicao (AJAX Request Class)

A simple wrapper around `fetch()` for making API requests.

### Creating an instance

```js
const api = new Requisicao('https://www.example.com/api');
```

### `post(operation, data, callback?)` — Form-encoded POST

Sends data as `application/x-www-form-urlencoded`.

```js
// Using async/await
const result = await api.post('Save', { Name: 'Victor', LastName: 'Santos' });

// Using a callback
api.post('Save', { Name: 'Victor', LastName: 'Santos' }, (result) => {
  console.log(result);
});

// Passing data as a string
api.post('Save', 'Name=Victor&LastName=Santos', (result) => {
  console.log(result);
});
```

### `json(operation, data, callback?)` — JSON POST

Sends data as `application/json`. Some .NET webservices require this format.

```js
const result = await api.json('Save', { Name: 'Victor', LastName: 'Santos' });
```

### `get(operation, params?, callback?)` — GET request

Sends data as query parameters.

```js
const result = await api.get('List', { page: 1, limit: 10 });
```

### Webservice parameter

By default, the operation name is appended to the URL path (e.g. `https://example.com/api/Save`). If you set `webservice: false`, the operation is sent as an `Operacao` parameter instead:

```js
const api = new Requisicao('https://www.example.com/handler.ashx', { webservice: false });
api.post('Save', { Name: 'Victor' }, (result) => {
  // Sends: Operacao=Save&Name=Victor
});
```

## Utility Functions

### `serializeForm(formElement)`

Converts a form element into a plain object:

```js
const data = serializeForm(document.querySelector('#myForm'));
// { name: "Victor", email: "victor@example.com" }
```

### `loadScripts(files)`

Loads JS and CSS files sequentially, skipping duplicates. Returns a Promise:

```js
await loadScripts(['/js/utils.js', '/css/theme.css']);
```

## Modernization Notes

This library was originally written in 2012 and has been modernized to follow current JavaScript standards. Here's what changed and why.

### Removed: `json2.js` / `json2.min.js`

The original code included Douglas Crockford's JSON polyfill so that `JSON.stringify()` and `JSON.parse()` would work in browsers like Internet Explorer 6–8. Every browser released since IE10 (2012) supports JSON natively, so these files are no longer needed and have been removed entirely.

### Removed: jQuery dependency

The original `jquery.plugins.js` required jQuery for everything — DOM queries, AJAX calls, event handling, and even `console.log` wrapping. Modern browsers provide native APIs that do all of this without a library:

| Original (jQuery) | Replacement (native) | Why |
|---|---|---|
| `$.ajax()` | `fetch()` | Built into all modern browsers, Promise-based |
| `$.param()` | `URLSearchParams` | Native API for encoding form data |
| `$.fn.serializeJSON` (jQuery plugin) | `serializeForm()` using `FormData` | No need for jQuery to read form values |
| `$.fn.log` (jQuery plugin) | `console.log()` directly | `console` is universally available now — the safe wrapper was only needed for IE6–8 |
| `$.fn.carregaScripts` (jQuery plugin) | `loadScripts()` standalone function | Uses `Promise` chaining and a `Set` for deduplication instead of `$.getScript` and `$.inArray` |
| `$.getScript()` | `<script>` element with `onload` | Native script loading, no library needed |
| `document.createStyleSheet` (IE-only) | `<link>` element appended to `<head>` | The IE-specific API was removed from the standard long ago |

### Renamed: `jquery.plugins.js` → `biblioteca.js`

The file no longer contains jQuery plugins, so the old name was misleading. The new name matches the project itself.

### Renamed: `clsRequisicao` → `Requisicao`

The original used a constructor function with the Hungarian-notation-style `cls` prefix, a common convention in 2012. The modernized version uses a proper ES6 `class` and drops the prefix — classes in JavaScript are self-evident without it.

### Renamed: single-letter methods → descriptive names

| Original | New | Why |
|---|---|---|
| `.p()` | `.post()` | Clear intent without needing to read comments |
| `.j()` | `.json()` | Self-documenting |
| `.g()` | `.get()` | Consistent naming |

The original code relied on comments like `// p de post. :)` to explain what each method did. Descriptive method names eliminate that need.

### Added: `async/await` and Promises

The original code was callback-only (a necessity in 2012). The modernized version uses `async/await` and returns Promises, which makes it easier to chain requests, handle errors with `try/catch`, and avoid callback nesting. Callbacks are still supported for backward compatibility.

### Added: `get()` method implementation

The original `.g()` method was a stub that just showed an alert saying "implementar envio por get quando necessário" (implement GET when needed). It has now been fully implemented using `fetch()` with query parameters via `URLSearchParams`.

### Removed: `alert()` for error messages

The original code used `alert()` to report errors like missing parameters. This blocks the entire page and is not appropriate for production code. The modernized version relies on standard JavaScript errors and lets the caller handle them with `try/catch`.
