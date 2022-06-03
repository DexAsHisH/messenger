import isEmpty from 'lodash/isEmpty';

const store = (key: string, obj: any) => {
  if (!obj || isEmpty(obj)) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(obj));
};

const get = (key: string) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || '');
  } catch (e) {
    return undefined;
  }
};

const remove = (key: string) => {
  sessionStorage.removeItem(key);
};

export { store, get, remove };
