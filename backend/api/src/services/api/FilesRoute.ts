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
import { RequestHandler } from 'express';
import { CreateFile, File, UpdateFile } from './data-contracts';

// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2

export namespace Files {
  /**
 * No description
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
  export namespace GetFiles {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit the amount of items returned
       * @format int32
       * @min 0
       * @max 100
       */
      limit: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      files: File[];
    };
    export type Handler = RequestHandler<
      RequestParams,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Record<string, unknown>
    >;
  }

  /**
 * No description
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
  export namespace CreateFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateFile;
    export type RequestHeaders = {};
    export type ResponseBody = {
      file: File;
    };
    export type Handler = RequestHandler<
      RequestParams,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Record<string, unknown>
    >;
  }

  /**
 * No description
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
  export namespace GetFile {
    export type RequestParams = {
      /** The id of the file to return */
      fileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      file: File;
    };
    export type Handler = RequestHandler<
      RequestParams,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Record<string, unknown>
    >;
  }

  /**
 * No description
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
  export namespace UpdateFile {
    export type RequestParams = {
      /** The id of the file to return */
      fileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateFile;
    export type RequestHeaders = {};
    export type ResponseBody = {
      file: File;
    };
    export type Handler = RequestHandler<
      RequestParams,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Record<string, unknown>
    >;
  }

  /**
 * No description
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
  export namespace DeleteFile {
    export type RequestParams = {
      /** The id of the file to return */
      fileId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      deletedFile: File;
    };
    export type Handler = RequestHandler<
      RequestParams,
      ResponseBody,
      RequestBody,
      RequestQuery,
      Record<string, unknown>
    >;
  }
}
