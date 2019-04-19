import app from '../bin/server'
import supertest from 'supertest'
import { expect, should } from 'chai'
import { cleanDb } from './utils';

should()
const request = supertest.agent(app.listen(5001))
const context = {}

// npm run test -- -g 'Test Goods'
describe('Test Goods', () => {
  before((done) => {
    cleanDb()
    done()
  })

  describe('POST /goods/create', () => {
    it('Created good should have properties', (done) => {

      const good = {
        type: 'Phone',
        title: '测试手机',
        desc: '测试手机desc',
        originPrice: 1000,
        purchasePrice: 800,
        onShelve: 'will_shelves',
        properties: {
          model: 'iphone',
          color: '红色',
          capacity: '80GB'
        }
      }

      request
        .post('/api/v1/goods/create')
        .set('Accept', 'appliction/json')
        .send(good)
        .expect(200, (err, res) => {
          if (err) {
            return done(err)
          }

          res.body.status.should.equal(201)
          res.body.result.should.have.property('properties')

          done()
        })
    })
  })
})