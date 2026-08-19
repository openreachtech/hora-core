#!/usr/bin/env node

import HoraCoreCli from './HoraCoreCli.js'

process.exitCode = HoraCoreCli.create({
  args: process.argv.slice(2),
})
  .run()
