# Frontend-Boilerplate
Simple boilerplate using gulp to minify/concate/compress stuff.  
Use `gulp-config-example.js` contents and create a `gulp-config.js` file.  
This file will contain deployment credentials if you choose to deploy to a server using rsync

## Gulp Tasks

`gulp`  
- gulp default(ran by default using just "gulp")
- Hosts a server using development files
- Watches scss/html/js files for changes and reloads browsers upon changes
- compiles sass to css/nunjucks to html and refreshes development server
- outputs files to "tmp" folder

`gulp clean:cache`  
- Cleans image cache

`gulp clean:dist`  
- Cleans production files

`gulp build`  
- Cleans production files
- Compiles sass into css
- Minify/Concatenates js/css files
- Optimizes/Compresses Images
- Moves font files to dist(production) folder
- Moves all other files into dist(production) folder

`gulp build:server`  
- Runs gulp build
- Hosts a server via browser-sync

`gulp build:deploy`
- Runs `gulpd build`
- Deploys to a server using rsync
- Credentials are in `gulpconfig.js`

## Questions, Concerns, or Feedback?
You can contact me at myoldemailname@gmail.com