declare global {
  namespace Express {
    interface User {
      admin: boolean;
      id?: Uint8Array;
      _id: object;
    }
  }
}

export {};
