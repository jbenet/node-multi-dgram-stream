#!/usr/bin/env node
var mds = require('./index')

var src = process.argv[2]
var dst = process.argv.slice(3)

if (!src || !dst) {
  console.log('usage: ./try.js <src addr> <dst addr>...')
  process.exit(-1)
}

var stream = mds(src, dst)
process.stdin.pipe(stream).pipe(process.stdout)
