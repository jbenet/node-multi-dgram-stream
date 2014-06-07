var _ = require('underscore')
var dgramStream = require('dgram-stream')
var transDuplex = require('duplex-transform')

module.exports = MultiDgramStream

function MultiDgramStream(srcAddr, dstAddrs) {
  srcAddr = addrSplit(srcAddr)
  dstAddrs = _.map(dstAddrs, addrSplit)

  var dgrams = dgramStream('udp4')
  dgrams.bind(srcAddr.port, srcAddr.address)

  return transDuplex.obj(outgoing, dgrams, incoming)

  function outgoing(data, enc, next) {
    for (var d in dstAddrs)
      this.push({to: dstAddrs[d], payload: data})
    next()
  }

  function incoming(msg, enc, next) {
    this.emit('dgram', msg) // in case the whole thing is wanted
    this.push(msg.payload) // unwrap. loses sender addr.
    next()
  }
}


function addrSplit(addr) {
  var parts = addr.split(':')
  return {
    address: parts[0] || 'localhost',
    port: parseInt(parts[1], 10),
  }
}
