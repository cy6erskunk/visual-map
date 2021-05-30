import {getDataTree} from './getDataTree'

test('empty array', () => {
  const result = getDataTree([]);
  
  expect(result.parent).toBeUndefined()
  expect(result.items).toEqual([])
})

test('non-empty array', () => {
  const data = [1];

  const result = getDataTree(data);

  expect(result.parent).toBeUndefined();
  expect(result.items.length).toEqual(data.length);
  
  const arrayItem = result.items[0];
  
  expect(arrayItem.parent).toBe(result);
  expect(arrayItem.index).toBe(0);
  
  const valueItem = arrayItem.value;
  
  expect(valueItem.value).toEqual(String(data[0]));
  expect(valueItem.parent).toEqual(arrayItem);
})

test('non-empty object', () => {
  const key = 'a';
  const value = 1;
  const data = {};
  data[key] = value;

  const result = getDataTree(data);
  expect(result.parent).toBeUndefined();
  expect(result.items.length).toEqual(1);

  const keyItem = result.items[0];
  
  expect(keyItem.parent).toBe(result);
  expect(keyItem.key).toBe(key);
  
  const valueItem = keyItem.value;
  
  expect(valueItem.value).toEqual(String(valueItem.value));
  expect(valueItem.parent).toEqual(keyItem);
})