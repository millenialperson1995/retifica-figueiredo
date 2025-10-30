// mock-data.ts
// This file previously contained development mock/static data. Static data has
// been removed from the codebase. Please use the API endpoints (e.g. /api/*)
// or the MongoDB models under lib/models to access application data.

export function _mockDataRemoved(): never {
  throw new Error('mock-data was removed. Use apiService or DB models instead.');
}

export default _mockDataRemoved;
