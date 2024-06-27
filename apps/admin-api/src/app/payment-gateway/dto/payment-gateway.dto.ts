import { Authorize, IDField, Relation } from '@ptc-org/nestjs-query-graphql';
import {
  Field,
  FieldMiddleware,
  ID,
  MiddlewareContext,
  NextFn,
  ObjectType,
} from '@nestjs/graphql';
import { PaymentGatewayType } from '@ridy/database/enums/payment-gateway-type.enum';
import { MediaDTO } from '../../upload/media.dto';
import { GatewayAuthorizer } from './gateway.authorizer';
import { numberMasker } from '../../number.masker.middleware';

export const apiKeyMasker: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let value: string = await next();
  if (process.env.DEMO_MODE != null && value != null && value.length > 0) {
    value = value
      .toString()
      .split('')
      .map(() => '*')
      .join('');
  }
  return value;
};

@ObjectType('PaymentGateway')
@Authorize(GatewayAuthorizer)
@Relation('media', () => MediaDTO, { nullable: true })
export class PaymentGatewayDTO {
  @IDField(() => ID)
  id!: number;
  enabled!: boolean;
  title!: string;
  type!: PaymentGatewayType;
  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  publicKey?: string;
  @Field(() => String, { middleware: [apiKeyMasker] })
  privateKey: string;
  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  merchantId?: string;
  @Field(() => String, { nullable: true, middleware: [apiKeyMasker] })
  saltKey?: string;
  mediaId?: number;
}
