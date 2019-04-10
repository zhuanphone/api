import Notice from '../../models/notice'

export async function createNotice(ctx) {
  const notice = new Notice(ctx.request.body)
  try {
    await notice.save()
    const response = notice.toJSON()

    ctx.body = {
      status: 201,
      result: response
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      result: error.message
    }
  }
}

export async function updateNotice(ctx) {
  const { id } = ctx.params
  const updated = ctx.request.body
  try {
    await Notice.update({ _id: id }, updated)
    ctx.status = 201
    ctx.body = {
      message: 'Update Notice Success!'
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      result: error.message
    }
  }
}

export async function getNotices(ctx) {
  try {
    const notices = await Notice.find({}, '-createAt').populate(['brand'])
    ctx.body = {
      status: 200,
      results: notices
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      results: error.message
    }
  }

}
