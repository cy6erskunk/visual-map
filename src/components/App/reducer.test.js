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
  const state = getDataTree(initialData);
  const hash = state[1];

  const newState = reducer(state, {
    type: 'remove',
    data: hash.root,
  });

  expect(newState).toBe(defaultState);
});

test('remove array item', () => {
  const data = [1];
  const state = getDataTree(data);
  const [tree] = state;
  const newData = [];
  const expectedState = getDataTree(newData);
  const [expectedTree, expectedHash] = expectedState;

  const valueId = tree.items[0].value.id;

  const [newTree, newHash] = reducer(state, {
    type: 'remove',
    data: valueId,
  });

  expect(newHash[valueId]).toBeUndefined();
  expect(Object.keys(newTree.items).length).toEqual(
    Object.keys(expectedTree.items).length
  );
  expect(Object.keys(newHash).length).toEqual(Object.keys(expectedHash).length);
});

test('remove object item', () => {
  const data = { a: 1 };
  const state = getDataTree(data);
  const [tree] = state;
  const newData = {};
  const expectedState = getDataTree(newData);
  const [expectedTree, expectedHash] = expectedState;

  const valueId = tree.items[0].value.id;

  const [newTree, newHash] = reducer(state, {
    type: 'remove',
    data: valueId,
  });

  expect(Object.keys(newTree.items).length).toEqual(
    Object.keys(expectedTree.items).length
  );
  expect(Object.keys(newHash).length).toEqual(Object.keys(expectedHash).length);
});
