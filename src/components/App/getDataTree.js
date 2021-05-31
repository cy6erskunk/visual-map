import { nanoid } from 'nanoid';

export function getDataTree(data, parentId, hash = {}) {
  let result;
  const id = nanoid();

  if (!hash.root) {
    hash.root = id;
  }

  if (!data && !parentId) {
    return [undefined, undefined];
  }

  if (Array.isArray(data)) {
    result = {
      id,
      type: 'array',
      items: [],
      parentId,
    };
    data.forEach((item, index) => {
      const itemId = nanoid();
      const [tree, subHash] = getDataTree(data[index], itemId, hash);
      const newItem = {
        id: itemId,
        type: 'arrayItem',
        index,
        parentId: id,
        value: tree,
      };

      hash[itemId] = newItem;
      result.items.push(newItem);
      Object.assign(hash, subHash);
    });
  } else if (typeof data === 'object') {
    result = {
      id,
      type: 'object',
      items: [],
      parentId,
    };
    Object.keys(data).forEach((objectKey, index) => {
      const itemId = nanoid();
      const [tree, subHash] = getDataTree(data[objectKey], itemId, hash);
      const newItem = {
        id: itemId,
        type: 'objectItem',
        index,
        key: objectKey,
        parentId: id,
        value: tree,
      };

      result.items.push(newItem);
      hash[itemId] = newItem;
      Object.assign(hash, subHash);
    });
  } else if (typeof data === 'string' && /^\$[^$]/.test(data)) {
    result = {
      id,
      type: 'var',
      value: `${data.substring(1)}`,
      parentId,
    };
  } else {
    result = {
      id,
      type: 'value',
      value: JSON.stringify(/^\$\$/.test(data) ? data.substring(1) : data),
      parentId,
    };
  }

  hash[id] = result;

  return [result, hash];
}
