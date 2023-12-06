import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ListResponseDto } from 'src/dto/response.dto';

export const SwaggerGetResponse = <TSchema extends Type<any>>(
  schema: TSchema,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(schema) }],
      },
    }),
  );
};

export const SwaggerPostResponse = <TSchema extends Type<any>>(
  schema: TSchema,
) => {
  return applyDecorators(
    ApiCreatedResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(schema) }],
      },
    }),
  );
};

export const SwaggerGetListResponse = <TSchema extends Type<any>>(
  schema: TSchema,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ListResponseDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(schema) },
              },
            },
            required: ['items'],
          },
        ],
      },
    }),
  );
};
