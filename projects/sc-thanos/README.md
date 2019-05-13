# ScThanos
A superheroicCodings implementation of a Thanos like vaporize effect usable as an angular directive. 
This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.RC-3

## Usage
#### Depedencies: 
To install run 
```
npm install sc-thanos --save
```
This lib uses html2canvas. So please run 
```
npm install html2canvas --save.
``` 

#### And in your angular app: 
Add 
```
ScThanosModule.forRoot(config?)
``` 
to your root app module.

And add:
``` 
`ScThanosModule`
``` 
to your shared module exports to make the directive available.

Use the directive `scThanos` on your element and reference it using `@ViewChild(ScThanosDirective)` in your component
or directly in html via template ref: 
```
<div scThanos #thanos="thanos"></div>
<button (click)="thanos.vaporize()"> 
```

## Build
Run `ng build sc-thanos` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing
After building your library with `ng build sc-thanos`, go to the dist folder `cd dist/sc-thanos` and run `npm publish`.

## Running unit tests
Run `ng test sc-thanos` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
