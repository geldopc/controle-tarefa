# SitesmAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
# Linhas de comando iniciais
<pre>
git config --global user.name "$USER"
git config --global user.email "$USER@smsgi.com.br"
</pre>
# Clonando o repositório
<pre>
git clone http://gitlab.smsgi.com.br/web/sitesm-angular.git
cd sitesm-angular
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
</pre>
# Adicionando o git a uma pasta existente (não versionada)
<pre>
cd pasta_existente
git init
git remote add origin http://gitlab.smsgi.com.br/web/sitesm-angular.git
git add .
git commit -m "Initial commit"
git push -u origin master
</pre>
# Adicionando o git a um projeto existente
<pre>
cd repositorio_local_existente
git remote rename origin old-origin
git remote add origin http://gitlab.smsgi.com.br/web/sitesm-angular.git
git push -u origin --all
git push -u origin --tags
</pre>
