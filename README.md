# SuperheroicCoding: Some examples with Angular+, Angular-Material, p5, three.js,  

Just some cool examples implemented in Angular for topics that I am interested in. 

The topics are science algorithms like poisson distribution and reaction diffusion.
Also shader programming with webgl and AI are given. 
Firebase is used for persistence.  
For visualization p5 and three.js are used.

I always try to keep a good code structure as defined in the Angular style guide.
Also I love rxjs and use it as much as I can.
For components I use Angular-Material.    
CSS wise I try use grid and flex layout.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.x.

To deploy it I use travisCI and AWS S3, with Cloudfront

## sc-thanos
A special library is extracted from these Experiments called sc-thanos. 
It's a cool vaporizing effect for your html Elements. 
[sc-thanos on npm](https://www.npmjs.com/package/sc-thanos)

Readme under: [Sc-Thanos README.md](./projects/sc-thanos/README.md)

A running version can be found on github pages: https://angularexamples.superheroiccoding.de/

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Deploy
Run `npm run deploy` to deploy the page to my bucket. (HAHA, you need credentials...)

## Service Worker
A serviceWorker configuration is generated if you run `ng build --prod`.
It is used to serve the page even when you are offline. 
You can test the service worker with `http-server -p 8080` from dist folder.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
