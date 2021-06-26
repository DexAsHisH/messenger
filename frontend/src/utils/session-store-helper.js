import isEmpty from 'lodash/isEmpty';

const store = (key, obj) => {
  if (!obj || isEmpty(obj)) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(obj));
};

const get = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || '');
  } catch (e) {
    return undefined;
  }
};

const remove = (key) => {
  sessionStorage.removeItem(key);
};

export { store, get, remove };
