export const UserRoles = {
  ADMIN: 'ADMIN',
  USER: 'USER'
}

export const GoodStatusMap = {
  WILLSHELVES: 'WILLSHELVES', // 待上架
  ONSHELVES: 'ONSHELVES', // 已上架
  OBTAINED: "OBTAINED" // 已下架
}

export const NoticeStatusMap = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED'
}

export const OrderState = {
  CONFIRM: 'CONFIRM', // 已确认
  PAYMENT: 'PAYMENT', // 代付款
  PAIDED: 'PAIDED', // 买家已付款
  BESEND: 'BESEND', // 待发货
  SENDED: 'SENDED', // 已发货
  COMPLETE: 'COMPLETE', // 交易成功
  CANCEL: 'CANCEL', // 交易取消
}

export const PaymentState = {
  BEPAID: 'BEPAID',
  PAIDED: 'PAIDED',
  PAIDFAIL: 'PAIDFAIL'
}

export const PostageOpts = {
  SHIPPING: 'SHIPPING', // 包邮
  PAY: 'PAY', // 到付
  TEN: '10',
  TWEENTY: '20',
  THIRTY: '30'
}