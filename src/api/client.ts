const MOCK_DELAY = 450;
const delay = () => new Promise<void>((r) => setTimeout(r, MOCK_DELAY));

export const apiGet = async <T>(_path: string, mockFn: () => T): Promise<T> => {
  await delay();
  return mockFn();
};

export const apiPost = async <T>(_path: string, _body: unknown, mockFn: () => T): Promise<T> => {
  await delay();
  return mockFn();
};

export const apiPatch = async <T>(_path: string, _body: unknown, mockFn: () => T): Promise<T> => {
  await delay();
  return mockFn();
};

export const apiDelete = async (_path: string, mockFn: () => void): Promise<void> => {
  await delay();
  mockFn();
};
