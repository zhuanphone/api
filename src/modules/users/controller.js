import User from '../../models/users'

/**
 * @api {post} /users Create a new user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "username": "johndoe", "password": "secretpasas" } }' localhost:5000/users
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.username Username.
 * @apiParam {String} user.password Password.
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 */
export async function createUser(ctx) {
  const user = new User(ctx.request.body)
  try {
    await user.save()

    const token = user.generateToken()
    const response = user.toJSON()

    delete response.password

    ctx.body = {
      status: 201,
      message: 'Create User Success!',
      result: {
        user: response,
        token
      }
    }
  } catch (err) {
    ctx.status = 422
    ctx.body = {
      status: 422,
      message: err.message
    }
  }
}

/**
 * @api {get} /users Get all users
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users
 *
 * @apiSuccess {Object[]} users           Array of user objects
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "users": [{
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }]
 *     }
 *
 * @apiUse TokenError
 */
export async function getUsers(ctx) {
  let { page, limit, keyword, sort } = ctx.request.query
  page = Number(page) || 1
  limit = Number(limit) || 10
  sort = sort || '-created'

  let query = {}
  if (keyword) query['name'] = { $regex: keyword }

  try {
    const total = await User.count({})
    const users = await User
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort)
    ctx.body = {
      status: 200,
      result: { pagination: { total, limit }, list: users }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

/**
 * @api {get} /users/:id Get user by id
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getUser(ctx, next) {
  try {
    const user = await User.findById(ctx.params.id, '-password')
    if (!user) {
      ctx.throw(404)
    }

    ctx.body = {
      status: 200,
      user
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }

  if (next) { return next() }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name" } }' localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.name     Name.
 * @apiParam {String} user.username Username.
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      Updated name
 * @apiSuccess {String}   users.username  Updated username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */
export async function updateUser(ctx) {
  const user = ctx.body.user

  Object.assign(user, ctx.request.body.user)

  try {

    await user.save()
    ctx.body = {
      status: 201,
      user
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }


}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

export async function deleteUser(ctx) {
  const user = ctx.body.user

  try {
    await user.remove()

    ctx.body = {
      status: 200,
      success: true
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }

}

// 获取用户购物车
export async function getUserCart(ctx) {
  const user = ctx.state.user

  try {
    const userDoc = await User.findById(user._id).populate('cart')

    ctx.body = {
      status: 200,
      result: userDoc.cart
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

// 更新商品至购物车，增加新的商品，删除商品，商品数加1， 商品数减1
export async function addToCart(ctx) {
  const user = ctx.state.user
  console.log('ctx body: ', ctx.request.body)
  const { goodId } = ctx.request.body

  try {
    const userDoc = await User.findById(user._id).populate('cart')

    const index = userDoc.cart ? userDoc.cart.findIndex(item => item.goodId === goodId) : -1

    if (index >= 0) {
      userDoc.cart[index].count += 1
    } else {
      userDoc.cart = []
      userDoc.cart.push({ goodId, count: 1 })
    }

    await userDoc.save()

    ctx.body = {
      status: 201,
      message: 'Add to cart success!'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function removeFromCart() {
  const user = ctx.state.user
  const { goodId } = ctx.body

  try {
    const userDoc = await User.findById(user._id).populate('cart')
    const index = userDoc.cart.findIndex(item => item.goodId === goodId)
    userDoc.cart.splice(index, 1)
    await userDoc.save()
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function updateCartItem() {
  const user = ctx.state.user
  const { goodId, count } = ctx.state.body

  try {
    const user = await User.findById(user._id).populate('cart')
    const index = user.cart.findIndex(item => item.id === goodId)
    user.cart[index].count = count

    await user.save()
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}