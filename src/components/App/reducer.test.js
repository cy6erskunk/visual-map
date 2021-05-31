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
