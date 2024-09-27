# jotai-async

![image](https://deno.bundlejs.com/badge?q=jotai-async@0.3.1,jotai-async@0.3.1/react&treeshake=[*],[*])

An extension for [Jotai](https://github.com/pmndrs/jotai) that simplifies asynchronous state management in React applications.

## Features

- Simplifies handling of asynchronous data fetching and mutations.
- Provides `queryAtom` and `mutationAtom` for managing async operations.
- Includes a `useQueryAtom` hook for seamless integration with React components.

## Installation

```bash
npm install jotai-async
```

or

```bash
yarn add jotai-async
```

or

```bash
pnpm install jotai-async
```

## Usage

### Importing

```javascript
import { queryAtom, mutationAtom } from 'jotai-async';
import { useQueryAtom } from 'jotai-async/react';
```

### Creating a Query Atom

```javascript
const userQueryEffect = queryAtom(async ({ get, set, signal }) => {
  const response = await fetch('/api/user', { signal });
  if (!response.ok) throw new Error('Failed to fetch user data');
  const data = await response.json();
  return data;
});
```

### Using `userQueryEffect` in a Component

```jsx
import React, { Suspense } from "react";
import { useQueryAtom } from 'jotai-async/react';

const UserProfile = () => {
  const { data, isLoading, error } = useQueryAtom(userQueryEffect);

  if (error) return <div>Error loading user data: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}

const App = () => {
  return <Suspense fallback={"Loading"}>
    <UserProfile/>
  </Suspense>
}
```

### Creating a Mutation Atom

```javascript
const updateUserMutation = mutationAtom(async ({ get, set, signal }, userData) => {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    signal,
  });
  if (!response.ok) throw new Error('Failed to update user data');
  const data = await response.json();
  return data;
});
```

### Using the Mutation Atom

```jsx
import React from 'react';
import { useAtom } from 'jotai';
import { updateUserMutation } from './atoms';

function UpdateUserForm() {
  const updateUser = useAtomSet(updateUserMutation);
  const [formState, setFormState] = useState({ name: '', email: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    updateUser(formState).catch(error => {
      console.error(error);
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for name and email */}
      <button type="submit">Update User</button>
    </form>
  );
}
```

## API Reference

### `queryAtom(callback, options)`

Creates an atom for managing asynchronous data fetching.

- **Parameters:**
    - `callback`: An asynchronous function that fetches data.
    - `options` _(optional)_: An object with the following properties:
        - `cacheKey`: A `CacheKeyAtom` used for caching purposes.
        - `debugLabel`: A string label for debugging.

**Returns:** A `QueryAtom` with additional properties and methods.

#### Properties of `QueryAtom`

- `mutation`: A writable atom for manually triggering the query.
- `$isFetching`: An atom representing the fetching state (`boolean`).
- `$data`: An atom holding the fetched data (`Result | null`).
- `abort`: A writable atom to abort the ongoing fetch.
- `$error`: An atom holding any errors encountered (`Error | null`).
- `$status`: An atom representing the status (`'init' | 'loading' | 'fetching' | 'success' | 'error'`).
- `$isLoading`: An atom indicating if loading is in progress (`boolean`).
- `$promise`: An atom holding the promise of the fetch operation (`Promise<Result> | null`).

### `mutationAtom(callback)`

Creates an atom for managing asynchronous mutations.

- **Parameters:**
    - `callback`: An asynchronous function that performs the mutation.

**Returns:** A writable atom with additional properties and methods.

#### Properties of `mutationAtom`

- `$data`: An atom holding the result of the mutation (`Result | null`).
- `$error`: An atom holding any errors encountered (`Error | null`).
- `$status`: An atom representing the status (`'init' | 'loading' | 'fetching' | 'success' | 'error'`).
- `$isLoading`: An atom indicating if the mutation is in progress (`boolean`).
- `$isFetching`: An atom indicating if fetching is in progress (`boolean`).
- `$promise`: An atom holding the promise of the mutation (`Promise<Result> | null`).
- `abort`: A writable atom to abort the ongoing mutation.

### `useQueryAtom(queryAtom)`

A React hook for using a `QueryAtom` in a component.

- **Parameters:**
    - `queryAtom`: The `QueryAtom` to be used.

**Returns:** An object containing:

- `data`: The fetched data or `null`.
- `isLoading`: `true` if loading is in progress.
- `isFetching`: `true` if fetching is in progress.
- `status`: The status of the query (`'init' | 'loading' | 'fetching' | 'success' | 'error'`).
- `error`: Any error encountered during fetching.

## Types

### `AsyncCallback<Result, Payload>`

An asynchronous function that performs an operation and returns a `Promise<Result>`.

```typescript
type AsyncCallback<Result, Payload> = (
  options: AsyncCallbackOptions,
  payload: Payload
) => Promise<Result>;
```

### `AsyncCallbackOptions`

Options provided to the `AsyncCallback` function.

- `get`: Jotai's `Getter`.
- `set`: Jotai's `Setter`.
- `signal`: An `AbortSignal` to handle cancellation.

### `CacheKey`

An array of strings or numbers used for caching.

```typescript
type CacheKey = Array<string | number>;
```

### `CacheKeyAtom`

An atom or promise that resolves to a `CacheKey`.

```typescript
type CacheKeyAtom = Atom<CacheKey | Promise<CacheKey>>;
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[MIT](LICENSE)
