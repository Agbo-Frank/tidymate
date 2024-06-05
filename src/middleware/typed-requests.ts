import { Request as ExpressRequest } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request { user: string }
  }
}

export type ExtendedDictionary = { [key: string]: string | number | any };

export type TypedRequestQuery<T extends ExtendedDictionary> = ExpressRequest & {
  query: T;
}

export type TypedRequestBody<T extends ExtendedDictionary> = ExpressRequest & {
  body: T;
}

export type TypedRequestParams<T extends ExtendedDictionary> = ExpressRequest & {
  params: T;
}

export type TypedRequest<P extends ExtendedDictionary = Record<any, any>, B extends ExtendedDictionary = Record<any, any>, Q extends ExtendedDictionary = Record<any, any>> = ExpressRequest & {
  params: P;
  query: Q;
  body: B;
}