// RENAME THIS TO 'gulp-config.js' WITHOUT THE QUOTES
// This file includes config variables for gulp tasks
// THIS IS AN EXAMPLE FILE.


// path for production files on ftp server
var productionPath = 'dist';

// destination path for files after being uploaded.
// ex. '~/public_html/project_name/'
var destination = ''; 

// host server name
// ex. 'website.name.com'
var hostname = '';

// username to login to site via rsync
// ex. username
var username = '';


module.exports = {
  rsync: {
    // Source files on local pc, relative to gulpfile.js location
    src: productionPath + '/**',
    options: {
      destination: destination,
      root: productionPath,
      hostname: hostname,
      username: username,
      incremental: true,
      progress: true,
      relative: true,
      emptyDirectories: true,
      recursive: true,
      clean: true,
      exclude: ['.DS_Store'],
      include: []
    }
  }
}
