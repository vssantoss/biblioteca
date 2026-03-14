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
