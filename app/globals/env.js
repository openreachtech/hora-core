import {
  EnvironmentFacade,
} from '@openreachtech/renchan-env'

const facade = EnvironmentFacade.create()

/** @type {EnvType} */
export default /** @type {*} */ (
  facade.generateFacade()
)

/**
 * @typedef {import('@openreachtech/renchan-env').EnvironmentFacadeInterface & {
 *   NODE_ENV: string
 * }} EnvType
 */
