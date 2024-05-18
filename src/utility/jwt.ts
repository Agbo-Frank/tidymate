import { JWT_SECRET_KEY } from "./config"
import { SignOptions, sign, verify as verifyToken } from "jsonwebtoken"
import { UnauthorizedException } from "./service-error"

class JWT {

  create(payload: object, options: Partial<SignOptions> = {}){
    return sign(payload, String(JWT_SECRET_KEY),  {
      expiresIn: '360h',
      audience: 'API',
      issuer: 'Tidymates',
      ...options
    })
  }

  verify(token: string): any{
    try {
      return verifyToken(token, JWT_SECRET_KEY)
    } catch (error) {
      throw new UnauthorizedException(error?.message?.replace("jwt", "token") || "Session expired")
    }
  }
}

export default new JWT()