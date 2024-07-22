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
import {
  CreateFile,
  CreateFolder,
  File,
  Folder,
  UpdateFile,
  UpdateFolder,
} from './data-contracts';

// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2
// This is a custom comment to test it is working mark 2

export namespace Folders {
  /**
 * No description
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
  export namespace GetFolders {
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
    export type RequestBody = {}; // TODO verify what express puts here
    export type RequestHeaders = {};
    export type ResponseBody = {
      folders: Folder[];
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
  export namespace CreateFolder {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateFolder; // TODO verify what express puts here
    export type RequestHeaders = {};
    export type ResponseBody = {
      folder: Folder;
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
  export namespace GetFolder {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {}; // TODO verify what express puts here
    export type RequestHeaders = {};
    export type ResponseBody = {
      folder: Folder;
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
  export namespace UpdateFolder {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateFolder; // TODO verify what express puts here
    export type RequestHeaders = {};
    export type ResponseBody = {
      folder: Folder;
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
  export namespace DeleteFolder {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {}; // TODO verify what express puts here
    export type RequestHeaders = {};
    export type ResponseBody = {
      deletedFolder: Folder;
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
 * @name GetFolderFiles
 * @summary Get the list of files
 * @request GET:/folders/{folderId}/files
 * @secure
 * @response `200` `{
    files: (File)[],

}` An array of files
 * @response `500` `ErrorResponse`
*/
  export namespace GetFolderFiles {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
    };
    export type RequestQuery = {
      /**
       * Limit the amount of items returned
       * @format int32
       * @min 0
       * @max 100
       */
      limit: number;
    };
    export type RequestBody = {}; // TODO verify what express puts here
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
 * @name CreateFolderFile
 * @summary Create a File
 * @request POST:/folders/{folderId}/files
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
*/
  export namespace CreateFolderFile {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = CreateFile; // TODO verify what express puts here
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
 * @name GetFolderFile
 * @summary Return a specific file
 * @request GET:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
*/
  export namespace GetFolderFile {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
      /**
       * The id of the file to return
       * @format uuid
       */
      fileId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {}; // TODO verify what express puts here
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
 * @name UpdateFolderFile
 * @summary Update a File
 * @request POST:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    file: File,

}` An array of random values
 * @response `500` `ErrorResponse`
*/
  export namespace UpdateFolderFile {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
      /**
       * The id of the file to return
       * @format uuid
       */
      fileId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateFile; // TODO verify what express puts here
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
 * @name DeleteFolderFile
 * @summary Delete a specific file
 * @request DELETE:/folders/{folderId}/files/{fileId}
 * @secure
 * @response `200` `{
    deletedFile: File,

}` Expected response to a valid request
 * @response `500` `ErrorResponse`
*/
  export namespace DeleteFolderFile {
    export type RequestParams = {
      /**
       * The id of the folder to return
       * @format uuid
       */
      folderId: string;
      /**
       * The id of the file to return
       * @format uuid
       */
      fileId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {}; // TODO verify what express puts here
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
