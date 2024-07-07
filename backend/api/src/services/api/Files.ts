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
import { CreateFile, ErrorResponse, File, UpdateFile } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Files<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * No description
 *
 * @tags files
 * @name GetFiles
 * @summary Get the list of files
 * @request GET:/files
 * @secure
 * @response `200` `{
    files: (File)[],

}` An array of files
 * @response `500` `ErrorResponse`
 */
  getFiles = (
    query: {
      /**
       * Limit the amount of items returned
       * @format int32
       * @min 0
       * @max 100
       */
      limit: number;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        files: File[];
      },
      ErrorResponse
    >({
      path: `/files`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags files
 * @name CreateFile
 * @summary Create a File
 * @request POST:/files
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  createFile = (data: CreateFile, params: RequestParams = {}) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/files`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags files
 * @name GetFile
 * @summary Return a specific file
 * @request GET:/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  getFile = (fileId: number, params: RequestParams = {}) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/files/${fileId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags files
 * @name UpdateFile
 * @summary Update a File
 * @request POST:/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  updateFile = (fileId: number, data: UpdateFile, params: RequestParams = {}) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/files/${fileId}`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags files
 * @name DeleteFile
 * @summary Delete a specific file
 * @request DELETE:/files/{fileId}
 * @secure
 * @response `200` `{
    deletedFile: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  deleteFile = (fileId: number, params: RequestParams = {}) =>
    this.http.request<
      {
        deletedFile: File;
      },
      ErrorResponse
    >({
      path: `/files/${fileId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
}
