let cliEngine = new (require('eslint').CLIEngine)({fix: true})
let chokidar = require('chokidar')
let fs = require('fs')
let writingTo = {} // Paths we're currently writing fixed codez to

module.exports = (globsToWatch, options) => {
  let startupTime = new Date().getTime()
  let verbose = options.verbose
  let fixOnStartup = options['fix-on-startup']

  if (!globsToWatch || !globsToWatch.length) {
    globsToWatch = ['./**/*.js']
  }

  if (!Array.isArray(globsToWatch)) {
    globsToWatch = [globsToWatch]
  }

  if (verbose) {
    console.error(`eslint-auto-fix is watching ${globsToWatch.join(', ')} for file changes`)
  }

  chokidar.watch(globsToWatch)
    .on('change', fix(verbose))
    .on('add', path => {
      if (fixOnStartup) {
        fix(verbose)(path)
      } else {
        // When chokidar first starts watching, it emits an "add" event for each file
        // it finds matching the glob. Fixing them all at that point might be undesirable.
        fs.stat(path, (error, stats) => {
          if (stats && startupTime < stats.birthtimeMs) {
            fix(verbose)(path)
          }
        })
      }
    })
}

let errorMessages = (fatalErrorResults, path) => {
  fatalErrorResults.forEach(result => {
    result.messages.forEach(({message, line, column}) => {
      console.error(`${message} on line ${line}, column ${column} of ${path}`)
    })
  })
}

let fatalErrors = results => results.filter(
  result => Boolean(result.messages.filter(
    message => message.fatal
  ).length)
)

let fix = verbose => path => {
  if (writingTo[path] === undefined) {
    let results = cliEngine.executeOnFiles([path]).results
    let fatalErrorResults = fatalErrors(results)

    if (fatalErrorResults.length !== 0) {
      errorMessages(fatalErrorResults, path)
    } else if(results[0].output) { // Something needed fixin'
      writeOutput(path, results[0].output, verbose)
    }
  }
}

let writeOutput = (path, output, verbose) => {
  writingTo[path] = true

  if (verbose) {
    console.error(`ESLint is fixing ${path}`)
  }

  fs.writeFile(path, output, writeError => {
    delete writingTo[path]
    if (writeError) {
      console.error(`Could not write to file ${path} to auto-fix it with ESLint.`)
    }
  })
}
