import { prisma } from '@services/domain-model/prisma';
import { randomUUID } from 'crypto';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import request from 'supertest';
import { api } from '../../..';

describe('createFile', () => {
  let app: ReturnType<typeof request>;
  beforeEach(() => {
    app = request(api);
  });

  it('returns an OK response', async () => {
    const name = 'file-abc-xyz';
    const { id: folderId } = await prisma.folder.create({
      data: { name: 'sample' },
    });
    const response = await app
      .post(`/api/folders/${folderId}/files`)
      .set('Authorization', 'Basic am9obkBleGFtcGxlLmNvbTphYmMxMjM=')
      .set('Accept', 'application/json')
      .send({ name });

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body).toEqual({
      file: {
        folderId,
        id: expect.any(String),
        name,
      },
    });
  });

  it('returns an UNAUTHORISED when missing the auth header', async () => {
    const name = 'file-abc-xyz';
    const folderId = randomUUID();
    const response = await app
      .post(`/api/folders/${folderId}/files`)
      .set('Accept', 'application/json')
      .send({ name });

    expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
    expect(response.body).toEqual({
      message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
      errorDetails: [{ errorCode: 'MISSING_AUTH_HEADER' }],
    });
  });

  it('returns a BAD_REQUEST when the request data is malformed', async () => {
    const name = 1234;
    const folderId = randomUUID();
    const response = await app
      .post(`/api/folders/${folderId}/files`)
      .set('Authorization', 'Basic am9obkBleGFtcGxlLmNvbTphYmMxMjM=')
      .set('Accept', 'application/json')
      .send({ name });

    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual({
      message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      errorDetails: [
        {
          errorCode: 'MUST_BE_STRING_VALUE',
          paramType: 'body',
          locationPath: 'name',
        },
      ],
    });
  });
});
