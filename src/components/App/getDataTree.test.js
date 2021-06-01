import { getDataTree, addArrayItem } from './getDataTree';

test('empty', () => {
  const result = getDataTree();

  expect(result).toBeUndefined();
});

test('empty array', () => {
  const result = getDataTree([]);

  expect(result.parentId).toBeUndefined();
  expect(result[result.root].items).toEqual([]);
});

test('non-empty array', () => {
  const data = [1];

  const result = getDataTree(data);

  expect(result.parentId).toBeUndefined();
  expect(result[result.root].items.length).toEqual(data.length);

  const arrayItem = result[result.root].items[0];

  expect(arrayItem.parentId).toBe(result.root);
  expect(result[arrayItem.id].index).toBe(0);

  const valueItem = result[result[arrayItem.id].valueId];

  expect(valueItem.value).toEqual(String(data[0]));
  expect(valueItem.parentId).toEqual(arrayItem.id);
});

test('non-empty object', () => {
  const key = 'a';
  const value = 1;
  const data = {};
  data[key] = value;

  const result = getDataTree(data);
  expect(result[result.root].parentId).toBeUndefined();
  expect(result[result.root].items.length).toEqual(1);

  const keyItem = result[result.root].items[0];

  expect(result[keyItem.id].key).toBe(key);

  const valueItem = result[keyItem.id];

  expect(result[valueItem.valueId].value).toEqual(String(value));
  expect(result[valueItem.valueId].parentId).toEqual(keyItem.id);
});

test('addArrayItem - 1', () => {
  const result = getDataTree([]);
  const newResult = addArrayItem(result[result.root], result, 1);

  expect(result.root).toEqual(newResult.root);
  expect(newResult[newResult.root].items.length).toBe(1);
  expect(
    newResult[newResult[newResult[newResult.root].items[0].id].valueId]
  ).toEqual(
    expect.objectContaining({
      type: 'value',
      value: '1',
      id: expect.any(String),
      parentId: expect.any(String),
    })
  );
  expect(Object.keys(newResult).length).toBe(4); // root, array, item, value
});

test('addArrayItem - [[]]', () => {
  const result = getDataTree([]);
  const newResult = addArrayItem(result[result.root], result, []);

  expect(result.root).toEqual(newResult.root);
  expect(newResult[newResult.root].items.length).toBe(1);
  expect(
    newResult[newResult[newResult[newResult.root].items[0].id].valueId]
  ).toEqual(
    expect.objectContaining({
      type: 'array',
      items: [],
      id: expect.any(String),
      parentId: expect.any(String),
    })
  );
  expect(Object.keys(newResult).length).toBe(4); // root, array, item, array
});
