# Woolly - Front

Woolly is the online shop of all the [associations of the Université de Technologie de Compiègne](https://assos.utc.fr/).

## Installation

The user interface was developped with [Angular 6](https://angular.io/guide/quickstart).



First of all, install [Angular CLI](https://github.com/angular/angular-cli), clone the repo et install the dependancies :


```sh
sudo npm install -g @angular/cli
git clone https://github.com/simde-utc/woolly-front.git
cd woolly-front
sudo npm install
```


## Development

To start the development server, use `ng serve --o` and go to`http://localhost:4200/`. The application will rebuild automatically if you modify the source files.



To learn how to develop with Angular, read the [Angular tutorial](https://angular.io/tutorial).
For more help about Angular CLI, use`ng help` ou read the  [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



To test the application, you can :

- run unit tests with [Karma](https://karma-runner.github.io) : `ng test`
- run end-to-end tests with [Protractor](http://www.protractortest.org/) : `ng e2e`


## Deployment

To build the project, use :
```sh
ng build --base-href /woolly/ --build-optimizer --prod
```
Replace `/woolly/` by the base URL of your deployment server.
Then you only need to put all the content of the`dist/` folder in your deployment folder.