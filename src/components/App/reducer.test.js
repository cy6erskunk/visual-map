import { reducer, defaultState } from './reducer';
import { getDataTree } from './getDataTree';

const initialData = [
  [],
  1,
  { a: 123, b: [1, 2, 3], c: '$foo', d: {} },
  '123',
  ['$$foo <- not var'],
];

test('remove everything', () => {
  const hash = getDataTree(initialData);

  const newState = reducer(hash, {
    type: 'remove',
    data: hash.root,
  });

  expect(newState).toBe(defaultState);
});

test('remove array item', () => {
  const data = [1];
  const state = getDataTree(data);
  const newData = [];
  const expectedState = getDataTree(newData);
  const expectedHash = expectedState;

  const valueId = state[state[state.root].items[0].id].valueId;
  const newHash = reducer(state, {
    type: 'remove',
    data: valueId,
  });

  expect(newHash[valueId]).toBeUndefined();
  expect(Object.keys(newHash).length).toEqual(Object.keys(expectedHash).length);
});

test('remove object item', () => {
  const data = { a: 1 };
  const state = getDataTree(data);
  const newData = {};
  const expectedState = getDataTree(newData);

  const valueId = state[state[state.root].items[0].id].valueId;

  const newHash = reducer(state, {
    type: 'remove',
    data: valueId,
  });

  expect(Object.keys(newHash).length).toEqual(
    Object.keys(expectedState).length
  );
});

test('add arrayItem array', () => {
  const data = [];
  const state = getDataTree(data);

  const newState = reducer(state, {
    type: 'add',
    data: { type: 'array', parentId: state.root, length: 0 },
  });

  expect(state.root).toBe(newState.root);
  expect(Object.keys(newState).length).toBe(4);
});

test('add arrayItem object', () => {
  const data = [];
  const state = getDataTree(data);

  const newState = reducer(state, {
    type: 'add',
    data: { type: 'object', parentId: state.root, length: 0 },
  });

  expect(state.root).toBe(newState.root);
  expect(Object.keys(newState).length).toBe(4);
});
