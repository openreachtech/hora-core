#!/usr/bin/env node

import HoraCoreCli from './HoraCoreCli.js'

process.exitCode = HoraCoreCli.runPostinstall()
