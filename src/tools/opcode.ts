import { HttpException, HttpStatus } from '@nestjs/common';

export type OpcodeNames =
  | 'Success'
  | 'InvalidError'
  | 'ValidateFailed'
  | 'NotFound';

export type OpcodeItem = (
  details?: { [key: string]: any },
  actualError?: Error,
) => HttpException & { actualError?: Error };
export const globalOpcode: { [key in OpcodeNames]: OpcodeItem } = {
  Success: $(0, HttpStatus.OK, '요청에 성공하였습니다.'),
  InvalidError: $(
    -999,
    HttpStatus.INTERNAL_SERVER_ERROR,
    '알 수 없는 내부 오류가 발생하였습니다.',
  ),
  ValidateFailed: $(
    -1,
    HttpStatus.BAD_REQUEST,
    '모든 정보를 올바르게 입력해주세요.',
  ),
  NotFound: $(
    -404,
    HttpStatus.NOT_FOUND,
    '잘못된 요청입니다. 잠시 후 다시 시도하세요.',
  ),
};

export function $(
  opcode: number,
  statusCode: number,
  message?: string,
): OpcodeItem {
  return (details: { [key: string]: any } = {}, error?: Error) => {
    const err: any = new HttpException(
      { opcode, message, ...details },
      statusCode,
    );

    err.actualError = error;
    return err;
  };
}
