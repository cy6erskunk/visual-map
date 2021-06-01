import { getDataTree, addArrayItem } from './getDataTree';

function regenerateIndices(array) {
  return array.map((item, index) => {
    item.index = index;
    return item;
  });
}

export const defaultState = {};

const addTypes = {
  array: [],
  object: {},
};

export function reducer(state = defaultState, action) {
  let hash = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case 'add':
      const parentId = action.data.parentId;
      const type = action.data.type;

      if (!parentId) {
        return getDataTree(addTypes[type]);
      } else {
        let parent = hash[parentId];
        if (parent.type === 'array') {
          if (action.data.length !== parent.items.length) {
            return state;
          }
          hash = addArrayItem(parent, hash, addTypes[type]);

          return hash;
        } else {
          throw new Error('unsupported change type');
        }
      }
    case 'remove':
      const element = hash[action.data];

      if (!element) {
        throw new Error('Element not found');
      }

      if (typeof element.parentId === 'undefined') {
        return defaultState;
      }

      delete hash[element.id];

      if (
        hash[element.parentId].type === 'arrayItem' ||
        hash[element.parentId].type === 'objectItem'
      ) {
        const arrayItemElement = hash[element.parentId];
        const arrayElement = hash[arrayItemElement.parentId];

        delete hash[arrayItemElement.id];

        arrayElement.items.splice(arrayItemElement.index, 1);
        arrayElement.items = regenerateIndices(arrayElement.items);
        arrayElement.items.forEach(
          (item) => (hash[item.id].index = item.index)
        );

        return hash;
      }
      break;
    default:
      throw new Error();
  }
}
