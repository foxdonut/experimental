/* credit: James Forbes @james_a_forbes */
const fs = require('fs-extra')
const path = require('path')

function getSubDirectories(directory) {
    let filenames
    return fs.readdir(
        directory
    ).then(_fnames => {
        filenames = _fnames
        return Promise.all(filenames.map(
            filename => fs.lstat(path.join(directory, filename))
        ))
    }).then(stats => {
        const dirs = []
        for (let i = 0; i < filenames.length; ++i) {
            if (stats[i].isDirectory()) {
                dirs.push(filenames[i])
            }
        }
        return dirs
    })
}

// quick hacky Maybe
const Y = (x) => [x]
const N = () => []

const concat = (a,b) => a.concat(b)
const flatten = xs => xs.reduce( concat, [] )
const map = f => xs => xs.map(f)

const $lstatAsyncFilter = fn => filepath => {
  return fs.lstat( filepath )
  .then( fn )
  .then( x => (x ? Y : N)(filepath) )
}

function getSubDirectories2(directory) {
    return fs.readdir(directory)
    .then( map( $lstatAsyncFilter( stat => stat.isDirectory() ) ) )
    .then( ps => Promise.all(ps) ) // Why doesn't .then( Promise.all ) work?
    .then( flatten )
}

getSubDirectories(".").then(console.log)
getSubDirectories2(".").then(console.log)

