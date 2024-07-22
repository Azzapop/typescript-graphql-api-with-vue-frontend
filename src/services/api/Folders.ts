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
  CreateFile,
  CreateFolder,
  ErrorResponse,
  File,
  Folder,
  UpdateFile,
  UpdateFolder,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class FoldersClient<SecurityDataType = unknown> {
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
  getFolder = (folderId: string, params: RequestParams = {}) =>
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
    folderId: string,
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
  deleteFolder = (folderId: string, params: RequestParams = {}) =>
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
  /**
 * No description
 *
 * @tags files
 * @name GetFolderFiles
 * @summary Get the list of files
 * @request GET:/folders/{folderId}/files
 * @secure
 * @response `200` `{
    files: (File)[],

}` An array of files
 * @response `500` `ErrorResponse`
 */
  getFolderFiles = (
    folderId: string,
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
      path: `/folders/${folderId}/files`,
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
 * @name CreateFolderFile
 * @summary Create a File
 * @request POST:/folders/{folderId}/files
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  createFolderFile = (
    folderId: string,
    data: CreateFile,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}/files`,
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
 * @name GetFolderFile
 * @summary Return a specific file
 * @request GET:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  getFolderFile = (
    folderId: string,
    fileId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}/files/${fileId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags files
 * @name UpdateFolderFile
 * @summary Update a File
 * @request POST:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
 */
  updateFolderFile = (
    folderId: string,
    fileId: string,
    data: UpdateFile,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        file: File;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}/files/${fileId}`,
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
 * @name DeleteFolderFile
 * @summary Delete a specific file
 * @request DELETE:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    deletedFile: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
 */
  deleteFolderFile = (
    folderId: string,
    fileId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        deletedFile: File;
      },
      ErrorResponse
    >({
      path: `/folders/${folderId}/files/${fileId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
}
