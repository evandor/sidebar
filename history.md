stared as angular-cli project: ng new sb
created new github repo "sb"
git remote add origin https://github.com/evandor/sb.git
ng github-pages:deploy --message "testing github pages deploy"

created jenkins build "sb"
npm install
ng build --prod

updating angular-cli: (see https://github.com/angular/angular-cli)

  npm uninstall -g angular-cli
  npm cache clean
  npm install -g angular-cli@latest

and

  rm -rf node_modules dist tmp
  npm install --save-dev angular-cli@latest
  ng init

updated to rc6 and router 3.0.0-rc.1

GRGRRRRRR

=== restarting project ===

https://github.com/AngularClass/angular2-webpack-starter

installing

webpack (npm install --global webpack)
webpack-dev-server (npm install --global webpack-dev-server)
karma (npm install --global karma-cli)
protractor (npm install --global protractor)
typescript (npm install --global typescript)

npm install

later:

npm install --save @types/gapi.auth2
added google signin with http://stackoverflow.com/questions/35530483/google-sign-in-for-websites-and-angular-2-using-typescript#

https://github.com/awslabs/aws-cognito-angular2-quickstart/


jquery with angular2

  http://4dev.tech/2016/05/using-jquery-with-angular2/


https://github.com/mgechev/angular2-seed/wiki/Deploying-prod-build-to-Apache-2

http://stackoverflow.com/questions/35320302/how-to-use-angular2-local-storage-module-in-angular-2-app:

  npm install --save angular2-localstorage

--- relevant commands ---

npm run server
npm run build:prod

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

--- relevant links ---

http://localhost:3000
https://evandor.github.io/sb/   



GRGRRRRRR

=== restarting project ===

stared as angular-cli project: ng new sidebar
created new github repo "sidebar"
git remote add origin https://github.com/evandor/sidebar.git
//ng github-pages:deploy --message "testing github pages deploy"

--- relevant commands ---

ng serve (port 4200)

ng build

cd dist
serve (Port 3000)