/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Folder {
  /** @format uuid */
  id: string;
  name: string;
}

export type ErrorCodes =
  | 'UNKNOWN'
  | 'MISSING_AUTH_ERROR'
  | 'MUST_BE_STRING_VALUE';

export interface ErrorDetail {
  errorCode: ErrorCodes;
  paramType?: 'body';
  locationPath?: string;
}

export interface ErrorResponse {
  message: string;
  errorDetails?: ErrorDetail[];
}

export interface CreateFolder {
  name: string;
}

export interface UpdateFolder {
  name: string;
}

export interface File {
  /** @format uuid */
  id: string;
  /** @format uuid */
  folderId: string;
  name: string;
}

export interface CreateFile {
  name: string;
}

export interface UpdateFile {
  name: string;
}
