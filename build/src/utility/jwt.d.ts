import { SignOptions } from "jsonwebtoken";
declare class JWT {
    create(payload: object, options?: Partial<SignOptions>): string;
    verify(token: string): any;
}
declare const _default: JWT;
export default _default;
