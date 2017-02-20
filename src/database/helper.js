import uuid from 'uuid-v4'

const uuids = {
  user: [],
  testModel: [],
  answerModel: [],
  questionModel: [],
}

const indices = {}

export function nextUuid(model) {
  if (!uuids[model]) {
    throw new Error(`Model ${model} does not exist.`)
  }
  if (indices[model]) {
    indices[model] = 0
  }
  const index = indices[model]
  indices[model] = indices[model] + 1
  if (uuids[model][index]) {
    return uuids[model][index]
  }
  const newUuid = uuid()
  uuids[model].push(newUuid)
  return newUuid
}

export function getUuid(model, index) {
  if (!uuids[model]) {
    throw new Error(`Model ${model} not set.`)
  }
  if (!uuids[model][index]) {
    throw new Error(`Index ${index} for this model are not set.`)
  }
  return uuids[model][index]
}
