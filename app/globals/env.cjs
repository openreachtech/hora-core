'use strict'

const {
  EnvironmentFacade,
} = require('@openreachtech/renchan-env')

const facade = EnvironmentFacade.create()

/** @type {EnvType} */
module.exports = /** @type {*} */ (
  facade.generateFacade()
)

/**
 * @typedef {import('@openreachtech/renchan-env').EnvironmentFacadeInterface & {
 *   NODE_ENV: string
 * }} EnvType
 */
