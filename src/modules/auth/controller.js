import passport from "koa-passport";
import User from "../../models/users";
import qiniu, { conf } from "qiniu";
import config from "../../../config";

/**
 * @apiDefine TokenError
 * @apiError Unauthorized Invalid JWT token
 *
 * @apiErrorExample {json} Unauthorized-Error:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 1.0.0
 * @apiName AuthUser
 * @apiGroup Auth
 *
 * @apiParam {String} username  User username.
 * @apiParam {String} password  User password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": "johndoe@gmail.com", "password": "foo" }' localhost:5000/auth
 *
 * @apiSuccess {Object}   user           User object
 * @apiSuccess {ObjectId} user._id       User id
 * @apiSuccess {String}   user.name      User name
 * @apiSuccess {String}   user.username  User username
 * @apiSuccess {String}   token          Encoded JWT
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "username": "johndoe"
 *        },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
 *     }
 *
 * @apiError Unauthorized Incorrect credentials
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "status": 401,
 *       "error": "Unauthorized"
 *     }
 */

export async function login(ctx, next) {
  return passport.authenticate("local", user => {
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: "该用户无效！"
      };
      return;
    }

    const token = user.generateToken();

    const response = user.toJSON();

    delete response.password;

    ctx.body = {
      status: 200,
      result: {
        token,
        user: response
      }
    };
  })(ctx, next);
}

// 注册
// phone, password, duplicatePass
export async function register(ctx) {
  const { username, password, duplicatePass, phone } = ctx.request.body;

  if (!username) {
    ctx.body = 501;
    ctx.body = {
      status: 501,
      message: "手机号不能为空"
    };
    return;
  }

  if (!password) {
    ctx.body = 501;
    ctx.body = {
      status: 501,
      message: "密码不能为空"
    };
    return;
  }
  if (!duplicatePass) {
    ctx.body = 501;
    ctx.body = {
      status: 501,
      message: "验证密码不能为空"
    };
    return;
  }
  if (password !== duplicatePass) {
    ctx.body = 501;
    ctx.body = {
      status: 501,
      message: "两次输入密码不一致"
    };
    return;
  }

  const existUser = User.findOne({ username: username });
  console.log("existUser: ", existUser);

  if (existUser) {
    ctx.body = 501;
    ctx.body = {
      status: 501,
      message: "该用户已存在！"
    };
    return;
  }

  const user = new User({ username, phone, password });

  try {
    await user.save();

    const token = user.generateToken();
    const response = user.toJSON();

    delete response.password;

    ctx.body = {
      status: 201,
      message: "注册成功！",
      result: {
        user: response,
        token
      }
    };
  } catch (err) {
    ctx.status = 422;
    ctx.body = {
      status: 422,
      message: err.message
    };
  }
}

export function createQiniuToken(ctx) {
  const accessKey = config.qiniu.ak;
  const secretKey = config.qiniu.sk;
  const domain = config.qiniu.domain;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  const options = {
    scope: "zhuanzhuan",
    expires: 3153600
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  ctx.body = {
    status: 201,
    result: {
      token: uploadToken,
      domain
    }
  };
}
