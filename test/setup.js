require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')
process.env.TZ = 'UTC'

global.expect = expect
global.supertest = supertest
