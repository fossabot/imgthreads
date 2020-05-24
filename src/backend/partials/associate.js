'use strict'

const AWS = require('aws-sdk')
const { readMeta } = require('../helpers/aws')
const {
  initializeDb,
  fileToDbPath,
  fileToId,
  setAysnc,
} = require('../helpers/firebase')

module.exports = async file => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const firebase = initializeDb()
  const db = firebase.database()

  const ref = db.ref(fileToDbPath(file))

  const id = fileToId(file)
  const { caption, browserId, timestamp } = await readMeta(dynamodb, id)

  await setAysnc(ref, {
    file,
    caption,
    browserId,
    id,
    timestamp,
  })

  firebase.delete()
}