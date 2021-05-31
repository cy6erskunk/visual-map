import { nanoid } from 'nanoid';

export function getDataTree(data, parent, hash = {}) {
  let result;
  const id = nanoid();

  if (!hash.root) {
    hash.root = id;
  }

  if (!data && !parent) {
    return [undefined, undefined];
  }

  if (Array.isArray(data)) {
    result = {
      id,
      type: 'array',
      items: [],
      parent,
      parentId: parent?.id,
    };
    data.forEach((item, index) =>
      result.items.push({
        type: 'arrayItem',
        index,
        parent: result,
      })
    );
    result.items.forEach((item, index) => {
      const [tree, subHash] = getDataTree(data[index], item, hash);
      item.value = tree;
      Object.assign(hash, subHash);
    });
  } else if (typeof data === 'object') {
    result = {
      id,
      type: 'object',
      items: [],
      parent,
      parentId: parent?.id,
    };
    Object.keys(data).forEach((objectKey, index) =>
      result.items.push({
        type: 'objectItem',
        index,
        key: objectKey,
        parent: result,
        parentId: parent?.id,
      })
    );
    result.items.forEach((item, index) => {
      const [tree, subHash] = getDataTree(data[item.key], item, hash);
      item.value = tree;
      Object.assign(hash, subHash);
    });
  } else if (typeof data === 'string' && /^\$[^$]/.test(data)) {
    result = {
      id,
      type: 'var',
      value: `${data.substring(1)}`,
      parent,
      parentId: parent?.id,
    };
  } else {
    result = {
      id,
      type: 'value',
      value: JSON.stringify(/^\$\$/.test(data) ? data.substring(1) : data),
      parent,
      parentId: parent?.id,
    };
  }

  hash[id] = result;

  return [result, hash];
}
