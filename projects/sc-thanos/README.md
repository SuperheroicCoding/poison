# ScThanos
A superheroicCoding implementation of the Thanos vaporize effect for angular. 
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

## Usage
Add `ScThanosModule.forRoot(config?)` to your imported app modules.
Add  `ScThanosModule` to your shared module exports to make the directive available.

Use the directive `scThanos` on your element and reference it using `@ViewChild(ScThanosDirective)` in your component
or directly inside html: 
```
<div scThanos #thanos></div>
<button (click)="thanos.vaporize()"> 
```

## Code scaffolding
Run `ng generate component component-name --project sc-thanos` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project sc-thanos`.
> Note: Don't forget to add `--project sc-thanos` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build sc-thanos` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build sc-thanos`, go to the dist folder `cd dist/sc-thanos` and run `npm publish`.

## Running unit tests

Run `ng test sc-thanos` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
