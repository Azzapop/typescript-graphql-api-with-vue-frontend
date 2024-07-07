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
import {
  CreateFolder,
  ErrorResponse,
  Folder,
  UpdateFolder,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Folders<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
 * No description
 *
 * @tags folders
 * @name GetFolders
 * @summary Get the list of folders
 * @request GET:/folders
 * @secure
 * @response `200` `{
    folders: (Folder)[],

}` An array of folders
 * @response `500` `ErrorResponse`
 */
  getFolders = (
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
        folders: Folder[];
      },
      ErrorResponse
    >({
      path: `/folders`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags folders
 * @name CreateFolder
 * @summary Create a Folder
 * @request POST:/folders
 * @secure
 * @response `200` `{
    folder: Folder,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  createFolder = (data: CreateFolder, params: RequestParams = {}) =>
    this.http.request<
      {
        folder: Folder;
      },
      ErrorResponse
    >({
      path: `/folders`,
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
 * @tags folders
 * @name GetFolder
 * @summary Return a specific folder
 * @request GET:/folders/{folderId}
 * @secure
 * @response `200` `{
    folder: Folder,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  getFolder = (folderId: number, params: RequestParams = {}) =>
    this.http.request<
      {
        folder: Folder;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags folders
 * @name UpdateFolder
 * @summary Update a Folder
 * @request POST:/folders/{folderId}
 * @secure
 * @response `200` `{
    folder: Folder,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  updateFolder = (
    folderId: number,
    data: UpdateFolder,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        folder: Folder;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}`,
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
 * @tags folders
 * @name DeleteFolder
 * @summary Delete a specific folder
 * @request DELETE:/folders/{folderId}
 * @secure
 * @response `200` `{
    deletedFolder: Folder,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  deleteFolder = (folderId: number, params: RequestParams = {}) =>
    this.http.request<
      {
        deletedFolder: Folder;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
}
