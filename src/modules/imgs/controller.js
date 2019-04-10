import Img from '../../models/img'

export async function listImgs(ctx) {
  const query = ctx.request.query
  try {
    const imgs = await Img.find(query).sort('-created')
    ctx.body = {
      status: 200,
      results: imgs
    }
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      status: 200,
      results: err.message
    }
  }
}

export async function createImgs(ctx) {
  const { imgsHash } = ctx.request.body
  try {
    const imgInstances = imgsHash.map(hash => {
      return new Img({
        domain: 'p7jj6peze.bkt.clouddn.com',
        hash
      })
    })
    const imgs = await Img.insertMany(imgInstances)
    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Create Success',
      result: imgs
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function readImg(ctx, next) {
  try {
    const result = await Img.findById(ctx.params.id)
    if (!result) {
      ctx.status = 404
      ctx.body = {
        status: 404,
        message: 'Image not found!'
      }
    }

    ctx.status = 200
    ctx.body = {
      result
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

export async function updateImg(ctx) {
  const result = ctx.body.result

  Object.assign(result, ctx.request.body)

  try {
    await result.save()

    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Create Image Success'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: error.message
    }
  }
}

export async function updateMultiImgs(ctx) {
  const { ids, attrs } = ctx.request.body
  try {
    await Img.update({ _id: { $in: ids } }, attrs, { multi: true })
    ctx.status = 201
    ctx.body = {
      status: 201,
      message: 'Update Multiple Imgs Success!'
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function deleteImg(ctx) {
  const { id } = ctx.params
  try {
    await Img.remove({ _id: id })
    ctx.body = {
      status: 200,
      message: 'Delete Success!'
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}

export async function deleteMultiImgs(ctx) {
  const { ids } = ctx.request.body
  try {
    await Img.remove({ _id: { $in: ids } })
    ctx.body = {
      status: 200,
      message: 'Delete Multiple Imgs Success!'
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      message: err.message
    }
  }
}
