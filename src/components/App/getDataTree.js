import { nanoid } from 'nanoid';

function getIdByParentId(hash, parentId) {
  return hash[
    Object.keys(hash).filter((key) => hash[key].parentId === parentId)[0]
  ].id;
}

export function addArrayItem(arrayTree, hash, data) {
  const id = nanoid();

  const subHash = getDataTree(data, id, hash);
  hash = Object.assign(subHash, hash);

  const newItem = {
    id,
    type: 'arrayItem',
    parentId: arrayTree.id,
  };

  const newFullItem = {
    id,
    type: 'arrayItem',
    index: arrayTree.items.length,
    parentId: arrayTree.id,
    valueId: getIdByParentId(subHash, id),
  };

  subHash[id] = newFullItem;
  arrayTree.items.push(newItem);

  return subHash;
}

export function addObjectItem(arrayTree, hash, data, objectKey) {
  const id = nanoid();

  const subHash = getDataTree(data, id, hash);
  hash = Object.assign(subHash, hash);

  const newItem = {
    id,
    type: 'objectItem',
    parentId: arrayTree.id,
  };

  const newFullItem = {
    id,
    type: 'objectItem',
    key: objectKey,
    index: arrayTree.items.length,
    parentId: arrayTree.id,
    valueId: getIdByParentId(subHash, id),
  };

  subHash[id] = newFullItem;
  arrayTree.items.push(newItem);

  return subHash;
}

export function getDataTree(data, parentId, hash = {}) {
  let result;
  const id = nanoid();

  if (!hash.root) {
    hash.root = id;
  }

  if (!data && !parentId) {
    return undefined;
  }

  if (Array.isArray(data)) {
    result = {
      id,
      type: 'array',
      items: [],
      parentId,
    };
    hash[id] = result;
    data.forEach((item) => {
      hash = addArrayItem(result, hash, item);
    });
  } else if (typeof data === 'object') {
    result = {
      id,
      type: 'object',
      items: [],
      parentId,
    };
    hash[id] = result;
    Object.keys(data).forEach((objectKey, index) => {
      hash = addObjectItem(result, hash, data[objectKey], objectKey);
    });
  } else if (typeof data === 'string' && /^\$[^$]/.test(data)) {
    result = {
      id,
      type: 'var',
      value: `${data.substring(1)}`,
      parentId,
    };
    hash[id] = result;
  } else {
    result = {
      id,
      type: 'value',
      value: JSON.stringify(/^\$\$/.test(data) ? data.substring(1) : data),
      parentId,
    };
    hash[id] = result;
  }

  return hash;
}
