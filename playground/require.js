import require from '../app/globals/require.js'
import rootPath from '../app/globals/root-path.js'

const env = require(rootPath.to('app/globals/env.cjs'))

console.log('NODE_ENV:', env.NODE_ENV)

/*
export NODE_ENV=development; node playground/require.js
*/
