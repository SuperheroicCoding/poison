webpackJsonp([7],{T2Lu:function(n,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var e=l("WT6e"),r=function(){},u=l("INQx"),s=l("6GVX"),o=l("XHgV"),c=l("Uo70"),p=l("bfOx"),h=l("Xjw4"),d=l("GuVZ"),g=l("j06o"),_=l("jevj"),m=l("9Sd6"),v=l("1T37"),w=l("kZql"),P=function(){function n(){}return n.prototype.ngOnInit=function(){this._navLinks=[{path:"perceptron",label:"Perceptron",hidden:!1},{path:"multiPerceptron",label:"Multi layer net",hidden:!w.a.production}]},Object.defineProperty(n.prototype,"navLinks",{get:function(){return this._navLinks.filter(function(n){return!n.hidden})},enumerable:!0,configurable:!0}),n}(),S=e._2({encapsulation:0,styles:[[""]],data:{}});function C(n){return e._27(0,[(n()(),e._4(0,0,null,null,6,"a",[["class","mat-tab-link"],["mat-tab-link",""],["routerLinkActive",""]],[[1,"aria-disabled",0],[1,"tabIndex",0],[2,"mat-tab-disabled",null],[2,"mat-tab-label-active",null],[1,"target",0],[8,"href",4]],[[null,"click"]],function(n,t,l){var r=!0;return"click"===t&&(r=!1!==e._16(n,1)._handleClick(l)&&r),"click"===t&&(r=!1!==e._16(n,2).onClick(l.button,l.ctrlKey,l.metaKey,l.shiftKey)&&r),r},null,null)),e._3(1,147456,[[2,4]],0,s.h,[s.i,e.k,e.y,o.a,[2,c.m],[8,null]],{active:[0,"active"]},null),e._3(2,671744,[[4,4]],0,p.n,[p.l,p.a,h.h],{routerLink:[0,"routerLink"]},null),e._3(3,1720320,[["rla",4]],2,p.m,[p.l,e.k,e.C,e.h],{routerLinkActive:[0,"routerLinkActive"]},null),e._23(603979776,3,{links:1}),e._23(603979776,4,{linksWithHrefs:1}),(n()(),e._25(6,null,["\n    ","\n  "]))],function(n,t){n(t,1,0,e._16(t,3).isActive),n(t,2,0,t.context.$implicit.path),n(t,3,0,"")},function(n,t){n(t,0,0,e._16(t,1).disabled.toString(),e._16(t,1).tabIndex,e._16(t,1).disabled,e._16(t,1).active,e._16(t,2).target,e._16(t,2).href),n(t,6,0,t.context.$implicit.label)})}function L(n){return e._27(0,[(n()(),e._4(0,0,null,null,10,"mat-toolbar",[["class","mat-toolbar"],["color","primary"]],[[2,"mat-toolbar-multiple-rows",null],[2,"mat-toolbar-single-row",null]],null,null,d.b,d.a)),e._3(1,4243456,null,1,g.a,[e.k,o.a,h.d],{color:[0,"color"]},null),e._23(603979776,1,{_toolbarRows:1}),(n()(),e._25(-1,0,["\n  "])),(n()(),e._4(4,0,null,1,5,"mat-toolbar-row",[["class","mat-toolbar-row"]],null,null,null,null,null)),e._3(5,16384,[[1,4]],0,g.c,[],null,null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(7,0,null,null,1,"div",[],null,null,null,null,null)),(n()(),e._25(-1,null,["Neural-Networks!"])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._25(-1,0,["\n"])),(n()(),e._25(-1,null,["\n"])),(n()(),e._4(12,0,null,null,6,"nav",[["class","mat-tab-nav-bar"],["mat-tab-nav-bar",""]],null,null,null,_.b,_.a)),e._3(13,3325952,null,1,s.i,[e.k,[2,m.c],e.y,e.h,v.g],null,null),e._23(603979776,2,{_tabLinks:1}),(n()(),e._25(-1,0,["\n  "])),(n()(),e.Z(16777216,null,0,1,null,C)),e._3(17,802816,null,0,h.j,[e.N,e.K,e.r],{ngForOf:[0,"ngForOf"]},null),(n()(),e._25(-1,0,["\n"])),(n()(),e._25(-1,null,["\n"])),(n()(),e._4(20,16777216,null,null,1,"router-outlet",[],null,null,null,null,null)),e._3(21,212992,null,0,p.p,[p.b,e.N,e.j,[8,null],e.h],null,null),(n()(),e._25(-1,null,["\n\n"]))],function(n,t){var l=t.component;n(t,1,0,"primary"),n(t,17,0,l.navLinks),n(t,21,0)},function(n,t){n(t,0,0,e._16(t,1)._toolbarRows.length,!e._16(t,1)._toolbarRows.length)})}var O=e._0("app-neural-network",P,function(n){return e._27(0,[(n()(),e._4(0,0,null,null,1,"app-neural-network",[],null,null,null,L,S)),e._3(1,114688,null,0,P,[],null,null)],function(n,t){n(t,1,0)},null)},{},{},[]),D=l("mu/C"),R=l("1OzB"),I=l("voZO"),W=l("AFXa"),M=function(){function n(t){this.inputConnections=t,this.bias=1,this.isLearning=!1,this.weights=n.getRandomWeights(t)}return n.outputMapping=function(n){return n<.5?0:1},n.getRandomWeights=function(n){for(var t=[],i=0;i<n;i++)t.push(2*Math.random()-1);return t},n.prototype.guess=function(n){return this.lastGuess=this.guessSilent(n),this.lastInput=n,this.lastGuess},n.prototype.guessSilent=function(t){return n.outputMapping(this.guessSigSilent(t))},n.prototype.guessSigSilent=function(n){var t=this,l=n.reduce(function(n,l,e){return n+l*t.weights[e]},this.bias);return 1/(1+Math.exp(-l))},n.prototype.guessSig=function(n){return this.lastGuess=this.guessSigSilent(n),this.lastInput=n.slice(),this.lastGuess},n.prototype.train=function(n,t){var l=this,e=n.inputs,r=n.expected;this.lastLearnRate=t;var u=r-this.guess(e);if(0!==u){this.isLearning=!0,this.learnTimeoutSub&&this.learnTimeoutSub.unsubscribe(),this.learnTimeoutSub=Object(W.a)(500).subscribe(function(n){return l.isLearning=!1});var s=this.weights.map(function(n,l){return n+u*e[l]*t});this.bias=this.bias+u*t,this.weights=s}return u},n.prototype.trainWithLastInput=function(n,t){var l=this;if(this.lastLearnRate=t,0!==n){this.isLearning=!0,this.learnTimeoutSub&&this.learnTimeoutSub.unsubscribe(),this.learnTimeoutSub=Object(W.a)(500).subscribe(function(n){return l.isLearning=!1});var e=this.weights.map(function(e,r){return e+n*l.lastInput[r]*t});this.bias=this.bias+n*t,this.weights=e}return n},Object.defineProperty(n.prototype,"classSeparatorLine",{get:function(){if(2===this.inputConnections)return{x0:0,y0:this.bias/-this.weights[1],x1:0,y1:(this.weights[0]+this.bias)/-this.weights[1]}},enumerable:!0,configurable:!0}),n}(),T=function(){function n(n,t,l,e,r,u){void 0===t&&(t=400),void 0===l&&(l=400),void 0===u&&(u=!0),this.p=n,this.width=t,this.height=l,this.brainService=e,this.onClickHandler=r,this.showLinearDivider=u,this.points=[],n.setup=this.setup.bind(this),n.draw=this.draw.bind(this),n.mousePressed=this.mouseClicked.bind(this)}return n.prototype.setup=function(){this.p.createCanvas(this.width,this.height)},n.prototype.draw=function(){var n=this;if(this.perceptron){this.separationImg=this.p.createImage(this.width/2,this.height/2),this.separationImg.loadPixels();for(var x=0;x<this.separationImg.width;x++)for(var y=0;y<this.separationImg.height;y++){var t=this.p.map(x,0,this.separationImg.width,0,1),l=this.p.map(y,0,this.separationImg.height,0,1),e=this.brainService.guessSilent([t,l]),r=Math.abs(e-.5),u=this.p.map(r,0,.1,255,128);this.separationImg.set(x,y,[u,u,u,255])}this.separationImg.updatePixels(),this.p.image(this.separationImg,0,0,this.width,this.height),this.p.strokeWeight(1),this.points.forEach(function(t){return t.show(n.p)}),this.p.stroke(0),this.p.line(0,0,this.p.width,this.p.height),this.points.forEach(function(t){var l=n.brainService.guessSilent(t.data);t.showForResult(n.p,l)}),this.showLinearDivider&&this.drawSeparationLine()}},n.prototype.mouseClicked=function(){if(this.onClickHandler){var n=this.p.mouseX,t=this.p.mouseY;if(n>0&&t>0&&n<=this.width&&t<=this.p.height){var l=void 0;return this.p.mouseButton===this.p.LEFT&&(l="left"),this.p.mouseButton===this.p.RIGHT&&(l="right"),this.onClickHandler(n,t,l),!1}}},n.prototype.drawSeparationLine=function(){var n=this.perceptron.classSeparatorLine;if(null!=n){var t=n.y0*this.height,l=this.width*n.y1;this.p.stroke(255,200,200),this.p.strokeWeight(3),this.p.line(0,t,this.width,l),this.p.strokeWeight(1)}},n}(),H=l("RBYm"),A=function(){function n(x,y,n){void 0===x&&(x=Math.random()),void 0===y&&(y=Math.random()),void 0===n&&(n=function(n,t){return n>t?1:0}),this.x=x,this.y=y,this._labelDefinition=n}return Object.defineProperty(n.prototype,"label",{get:function(){return null==this._label?this._labelDefinition(this.x,this.y):this._label},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"labelDefinition",{set:function(n){this._label=null,this._labelDefinition=n},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"data",{get:function(){return[this.x,this.y]},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"trainData",{get:function(){return new function(n,t){this.inputs=n,this.expected=t}(this.data,this.label)},enumerable:!0,configurable:!0}),n.prototype.show=function(n){n.stroke(0),n.fill(1===this.label?n.color(255,255,0):n.color(0,0,255)),n.ellipse(this.x*n.width,this.y*n.height,8,8)},n.prototype.showForResult=function(n,t){n.noStroke(),t===this.label?n.fill(0,255,0):n.fill(255,0,0),n.ellipse(this.x*n.width,this.y*n.height,4,4)},n}(),E=function(){function n(){}return n.prototype.createTestData=function(n){for(var t=[],i=0;i<n;i++)t[i]=new A;return t},n}(),F=l("Hhif"),V=l("l5y7"),N=l("g5jc"),$=.3,G=function(){function n(n){var t=this;this.trainDataService=n,this.learnedDataPoints=0,this.points=[],this.isSinglePerceptron=!1,this._learnRate=$,this.autoLearningSubject=new N.b,this.startAutoLearning$=this.autoLearningSubject.pipe(Object(V.filter)(function(n){return n})),this.stopAutoLearning$=this.autoLearningSubject.pipe(Object(V.filter)(function(n){return!n})),this.autoLearner$=F.a.create(50).pipe(Object(V.distinctUntilChanged)(),Object(V.skipUntil)(this.startAutoLearning$),Object(V.takeUntil)(this.stopAutoLearning$),Object(V.repeat)()),this.autoLearner$.subscribe(function(){return t.train()})}return Object.defineProperty(n.prototype,"autoLearning$",{get:function(){return this.autoLearningSubject.asObservable().pipe(Object(V.startWith)(!1))},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"learnRate",{get:function(){return this._learnRate},set:function(n){this._learnRate=n},enumerable:!0,configurable:!0}),n.prototype.createPerceptron=function(n){return void 0===n&&(n=2),this.createMultiPerceptron(n,[1]),this.perceptrons[0][0]},n.prototype.createMultiPerceptron=function(n,t){return void 0===n&&(n=2),void 0===t&&(t=[3,1]),this.learnedDataPoints=0,this.learnRate=$,this.isSinglePerceptron=1===t.length,this.perceptrons=t.map(function(l,e){for(var r=[],i=0;i<l;i++)r.push(new M(e>0?t[e-1]:n));return r}),this.perceptrons},n.prototype.train=function(n){if(void 0===n&&(n=10),0!==this.points.length)for(var i=0;i<n;i++){var t=Math.random()*this.points.length,l=this.points[Math.floor(t)];this.isSinglePerceptron?0!==this.perceptrons[0][0].train(l.trainData,this.learnRate)&&(this.learnedDataPoints++,this._learnRate=Math.max(this.learnRate*(1-this.learnedDataPoints/1e3),5e-4)):this.trainWithBackPropagation(l.trainData)}},n.prototype.trainWithBackPropagation=function(n){var t=this;this.guess(n.inputs);var l=this.perceptrons[this.perceptrons.length-1][0],e=l.lastGuess*(1-l.lastGuess)*(n.expected-l.lastGuess);if(0!==e){l.trainWithLastInput(e,this.learnRate);for(var i=this.perceptrons.length-2;i>=0;i--)this.perceptrons[i].forEach(function(n,r){n.trainWithLastInput(l.lastGuess*(1-l.lastGuess)*e*l.weights[r],t.learnRate)});this.learnedDataPoints++,this._learnRate=Math.max(this.learnRate*(1-this.learnedDataPoints/1e3),5e-4)}},n.prototype.updateTrainingData=function(){return this.points=this.trainDataService.createTestData(100),this.points},n.prototype.guess=function(n){if(this.isSinglePerceptron)return this.perceptrons[0][0].guess(n);for(var t=n.slice(),i=0;i<this.perceptrons.length-1;i++)t=this.perceptrons[i].map(function(n){return n.guessSig(t)});return this.perceptrons[this.perceptrons.length-1][0].guess(t)},n.prototype.guessSig=function(n){return this.isSinglePerceptron?this.perceptrons[0][0].guessSigSilent(n):this.guess(n)},n.prototype.toggleAutoTraining=function(n){this.autoLearningSubject.next(n)},n.prototype.addPoint=function(n){this.points.push(n),this.guess(n.data)},n.prototype.clearPoints=function(){this.points=[]},n.prototype.guessSilent=function(n){if(this.isSinglePerceptron)return this.perceptrons[0][0].guessSilent(n);for(var t=n.slice(),i=0;i<this.perceptrons.length-1;i++)t=this.perceptrons[i].map(function(n){return n.guessSigSilent(t)});return this.perceptrons[this.perceptrons.length-1][0].guessSilent(t)},n}(),B=function(){function n(n){this.brainService=n,this.canvasWidth=400,this.canvasHeight=400,this.showLinearDivider=!0,this.dataViewClicked=new e.n}return n.prototype.ngOnChanges=function(n){n.points&&!n.points.firstChange&&n.points.previousValue!==n.points.currentValue&&(this.dataScetch.points=n.points.currentValue),n.perceptron&&!n.perceptron.firstChange&&n.perceptron.previousValue!==n.perceptron.currentValue&&(this.dataScetch.perceptron=n.perceptron.currentValue)},n.prototype.ngAfterViewInit=function(){this.initDataScetch(),this.initLegendScetch()},n.prototype.ngOnInit=function(){},n.prototype.ngOnDestroy=function(){this.dataP5.remove(),this.legendScetch.remove()},n.prototype.initDataScetch=function(){var n=this;this.dataP5=new H(function(t){n.dataScetch=new T(t,n.canvasWidth,n.canvasHeight,n.brainService,function(x,y,t){n.dataViewClicked.emit({x:x,y:y,click:t})},n.showLinearDivider),n.dataScetch.points=n.points,n.dataScetch.perceptron=n.perceptron},this.dataCanvas.nativeElement)},n.prototype.initLegendScetch=function(){var n=this;this.legendScetch=new H(function(t){t.setup=function(){t.createCanvas(100,n.canvasHeight),t.background(255),t.fill(0),t.stroke(0),t.line(10,50,60,50),t.noStroke(),t.text("Class separation",10,42),t.stroke(255,200,200),t.strokeWeight(2),t.line(10,100,60,100),t.noStroke(),t.text("Perceptron separation",10,68,20,80),t.fill(255,0,0),t.noStroke(),t.ellipse(15,150,5,5),t.fill(0),t.text("Learned wrong",10,142),t.fill(0,255,0),t.noStroke(),t.ellipse(15,200,5,5),t.fill(0),t.text("Learned correct",10,192),t.fill(255,255,0),t.stroke(0),t.ellipse(15,250,8,8),t.fill(0),t.noStroke(),t.text("Class 1",10,242),t.fill(0,0,255),t.stroke(0),t.ellipse(15,300,8,8),t.fill(0),t.noStroke(),t.text("Class 2",10,292)}},this.legendCanvas.nativeElement)},n}(),z=e._2({encapsulation:0,styles:[[".canvas-container[_ngcontent-%COMP%]{display:-ms-grid;display:grid;grid-gap:.5rem;-ms-grid-columns:400px 1fr;grid-template-columns:400px 1fr;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:start}"]],data:{}});function X(n){return e._27(0,[e._23(402653184,1,{dataCanvas:0}),e._23(402653184,2,{legendCanvas:0}),(n()(),e._4(2,0,null,null,7,"div",[["class","canvas-container"]],null,null,null,null,null)),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(4,0,[[1,0],["dataCanvas",1]],null,1,"div",[["oncontextmenu","return false;"]],null,null,null,null,null)),(n()(),e._25(-1,null,["\n  "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(7,0,[[2,0],["legendCanvas",1]],null,1,"div",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n  "])),(n()(),e._25(-1,null,["\n"])),(n()(),e._25(-1,null,["\n"]))],null,null)}var K=l("BTH+"),Z=l("gsbp"),U=l("U/+3"),q=l("wkOE"),J=l("86rF"),Y=l("7DMc"),Q=l("7u3n"),nn=l("+j5Y"),tn=function(){function n(n){this.brainService=n,this.autoLearning$=n.autoLearning$}return n.prototype.ngOnInit=function(){},n.prototype.train=function(){this.brainService.train()},n.prototype.testAgainstNewData=function(){this.brainService.updateTrainingData()},n.prototype.toggleAutoLearning=function(n){this.brainService.toggleAutoTraining(n)},n.prototype.resetPerceptron=function(){console.log(this.perceptronLayers),this.perceptronLayers?this.brainService.createMultiPerceptron(2,this.perceptronLayers):this.brainService.createPerceptron()},n.prototype.clearPoints=function(){this.brainService.clearPoints()},n}(),ln=e._2({encapsulation:0,styles:[[".brain-settings-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]{display:-ms-grid;display:grid;grid-gap:.5rem;-ms-grid-columns:(minmax(160px,1fr)) [auto-fit];grid-template-columns:repeat(auto-fit,minmax(160px,1fr));-webkit-box-pack:start;-ms-flex-pack:start;justify-content:start}"]],data:{}});function en(n){return e._27(0,[(n()(),e._4(0,0,null,null,42,"mat-card",[["appRaiseCard",""],["class","brain-settings-card mat-card"]],null,[[null,"mouseenter"],[null,"mouseleave"]],function(n,t,l){var r=!0;return"mouseenter"===t&&(r=!1!==e._16(n,2).addRaisedClass()&&r),"mouseleave"===t&&(r=!1!==e._16(n,2).unraise()&&r),r},D.b,D.a)),e._3(1,49152,null,0,R.a,[],null,null),e._3(2,540672,null,0,I.a,[e.k],null,null),(n()(),e._25(-1,0,["\n  "])),(n()(),e._4(4,0,null,0,2,"mat-card-title",[["class","mat-card-title"]],null,null,null,null,null)),e._3(5,16384,null,0,R.j,[],null,null),(n()(),e._25(-1,null,["\n    Brain Settings\n  "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._4(8,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(9,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["Train, create data, reset"])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._4(12,0,null,0,29,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(13,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(15,0,null,null,2,"button",[["color","accent"],["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.train()&&e),e},K.d,K.b)),e._3(16,180224,null,0,Z.b,[e.k,o.a,U.g],{color:[0,"color"]},null),(n()(),e._25(-1,0,["Train 10 Points"])),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(19,0,null,null,2,"button",[["color","accent"],["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.testAgainstNewData()&&e),e},K.d,K.b)),e._3(20,180224,null,0,Z.b,[e.k,o.a,U.g],{color:[0,"color"]},null),(n()(),e._25(-1,0,["Test against new data\n    "])),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(23,0,null,null,2,"button",[["color","accent"],["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.resetPerceptron()&&e),e},K.d,K.b)),e._3(24,180224,null,0,Z.b,[e.k,o.a,U.g],{color:[0,"color"]},null),(n()(),e._25(-1,0,["Reset Perceptron\n    "])),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(27,16777216,null,null,9,"mat-slide-toggle",[["class","mat-slide-toggle"],["color","primary"],["matTooltip","Each 30ms we learn 10 random point"]],[[8,"id",0],[2,"mat-checked",null],[2,"mat-disabled",null],[2,"mat-slide-toggle-label-before",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"longpress"],[null,"keydown"],[null,"touchend"]],function(n,t,l){var r=!0,u=n.component;return"longpress"===t&&(r=!1!==e._16(n,34).show()&&r),"keydown"===t&&(r=!1!==e._16(n,34)._handleKeydown(l)&&r),"touchend"===t&&(r=!1!==e._16(n,34)._handleTouchend()&&r),"ngModelChange"===t&&(r=!1!==u.toggleAutoLearning(l)&&r),r},q.b,q.a)),e._3(28,1228800,null,0,J.a,[e.k,o.a,U.g,e.h,[8,null]],{color:[0,"color"]},null),e._21(1024,null,Y.j,function(n){return[n]},[J.a]),e._3(30,671744,null,0,Y.o,[[8,null],[8,null],[8,null],[2,Y.j]],{model:[0,"model"]},{update:"ngModelChange"}),e._19(131072,h.b,[e.h]),e._21(2048,null,Y.k,null,[Y.o]),e._3(33,16384,null,0,Y.l,[Y.k],null,null),e._3(34,147456,null,0,Q.d,[nn.c,e.k,v.d,e.N,e.y,o.a,U.d,U.g,Q.b,[2,m.c],[2,Q.a]],{message:[0,"message"]},null),(n()(),e._25(35,0,["Auto-learning ","\n    "])),e._19(131072,h.b,[e.h]),(n()(),e._25(-1,null,["\n    "])),(n()(),e._4(38,0,null,null,2,"button",[["color","accent"],["mat-raised-button",""]],[[8,"disabled",0]],[[null,"click"]],function(n,t,l){var e=!0;return"click"===t&&(e=!1!==n.component.clearPoints()&&e),e},K.d,K.b)),e._3(39,180224,null,0,Z.b,[e.k,o.a,U.g],{color:[0,"color"]},null),(n()(),e._25(-1,0,["\n      Clear Points\n    "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._25(-1,0,["\n"])),(n()(),e._25(-1,null,["\n"]))],function(n,t){var l=t.component;n(t,16,0,"accent"),n(t,20,0,"accent"),n(t,24,0,"accent"),n(t,28,0,"primary"),n(t,30,0,e._26(t,30,0,e._16(t,31).transform(l.autoLearning$))),n(t,34,0,"Each 30ms we learn 10 random point"),n(t,39,0,"accent")},function(n,t){var l=t.component;n(t,15,0,e._16(t,16).disabled||null),n(t,19,0,e._16(t,20).disabled||null),n(t,23,0,e._16(t,24).disabled||null),n(t,27,1,[e._16(t,28).id,e._16(t,28).checked,e._16(t,28).disabled,"before"==e._16(t,28).labelPosition,e._16(t,33).ngClassUntouched,e._16(t,33).ngClassTouched,e._16(t,33).ngClassPristine,e._16(t,33).ngClassDirty,e._16(t,33).ngClassValid,e._16(t,33).ngClassInvalid,e._16(t,33).ngClassPending]),n(t,35,0,e._26(t,35,0,e._16(t,36).transform(l.autoLearning$))?"enabled":"disabled"),n(t,38,0,e._16(t,39).disabled||null)})}var rn=function(){function n(){this.canvasHeight=300,this.canvasWidth=300}return n.roundFloat=function(n){return n.toFixed(5)},n.prototype.ngAfterContentInit=function(){var n=this;this.scetch=new H(function(t){t.setup=function(){t.createCanvas(n.canvasWidth,n.canvasHeight)},t.draw=function(){t.background(255),n.drawPerceptronCircle(t),n.drawBiasInput(t),n.drawInputs(t)}},this.perceptronCanvas.nativeElement)},n.prototype.ngOnDestroy=function(){this.scetch.remove()},n.prototype.drawPerceptronCircle=function(t){t.push(),t.translate(this.perceptronCircleX(),this.canvasHeight/2),this.perceptron.isLearning?t.fill(255,200,200):t.fill(200,200,255);var l=this.perceptronCircleSize();t.ellipse(0,0,l,l),t.fill(0),t.textSize(l/2.5),t.textAlign(t.CENTER),t.text("\u2211",0,l/10),t.line(l/2,0,this.canvasWidth/3,0),null!=this.perceptron.lastGuess&&(t.textSize(l/4),t.textAlign(t.LEFT),t.text("Output:"+n.roundFloat(this.perceptron.lastGuess),l/2+2,-2)),t.pop()},n.prototype.perceptronCircleX=function(){return this.canvasWidth/2+this.canvasWidth/30},n.prototype.perceptronCircleSize=function(){return this.canvasWidth/6},n.prototype.drawBiasInput=function(t){t.push(),t.translate(this.perceptronCircleX(),this.canvasHeight/12),this.perceptron.isLearning?t.fill(255,200,200):t.fill(200,200,255);var l=this.canvasWidth/7.5;t.ellipse(0,0,l,l),t.fill(0),t.textSize(l/3.5),t.textAlign(t.CENTER),t.text("Bias",0,l/10),t.textAlign(t.LEFT),t.text(n.roundFloat(this.perceptron.bias),5,this.canvasHeight/10),t.line(0,l/2,0,this.canvasHeight/3),t.pop()},n.prototype.drawInputs=function(t){var l=this,e=this.canvasHeight/(this.perceptron.weights.length+1);this.perceptron.weights.forEach(function(r,u){var y=e*(u+1),s=l.canvasWidth/7.5,o=l.canvasWidth/12;t.ellipse(o,y,s,s),t.textAlign(t.CENTER),t.textSize(s/3.5),t.text("Input "+(u+1),o,y+4),t.line(o+s/2,y,l.perceptronCircleX()-l.perceptronCircleSize()/2,l.canvasHeight/2),t.textAlign(t.LEFT),null!=l.perceptron.lastInput&&t.text("in"+(u+1)+": "+n.roundFloat(l.perceptron.lastInput[u]),2*o,y-l.perceptronCircleSize()/4),t.text("w"+(u+1)+": "+n.roundFloat(r),2*o,y+l.perceptronCircleSize()/2)})},n}(),an=e._2({encapsulation:0,styles:[[""]],data:{}});function un(n){return e._27(0,[e._23(402653184,1,{perceptronCanvas:0}),(n()(),e._4(1,0,[[1,0],["perceptronCanvas",1]],null,1,"div",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n"])),(n()(),e._25(-1,null,["\n"]))],null,null)}var sn=function(){function n(n){this.brainService=n,this.width=400,this.height=400}return Object.defineProperty(n.prototype,"perceptron",{get:function(){return this.brainService.perceptrons[0][0]},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"points",{get:function(){return this.brainService.points},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"learnRate",{get:function(){return this.brainService.learnRate},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"learnedDataPoints",{get:function(){return this.brainService.learnedDataPoints},enumerable:!0,configurable:!0}),n.prototype.ngOnInit=function(){this.brainService.createPerceptron(2),this.brainService.updateTrainingData(),this.autoLearning$=this.brainService.autoLearning$},n.prototype.addPoint=function(n){var t=n.click,l=new A(n.x/this.width,n.y/this.height,function(){return"left"===t?1:0});this.brainService.addPoint(l)},n}(),on=e._2({encapsulation:0,styles:[[".perceptron-canvas[_ngcontent-%COMP%]{width:100%;height:100%}.card-container[_ngcontent-%COMP%]{margin:1rem;display:-ms-grid;display:grid;grid-gap:1rem;-ms-grid-columns:(minmax(470px,1fr)) [auto-fit];grid-template-columns:repeat(auto-fit,minmax(470px,1fr));-webkit-box-pack:start;-ms-flex-pack:start;justify-content:start;-ms-flex-line-pack:start;align-content:start}.data-card[_ngcontent-%COMP%]{min-width:470px;grid-row-start:1;grid-row-end:3}"]],data:{}});function cn(n){return e._27(0,[(n()(),e._4(0,0,null,null,59,"div",[["class","card-container"]],null,null,null,null,null)),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(2,0,null,null,30,"mat-card",[["appRaiseCard",""],["class","data-card mat-card"]],null,[[null,"mouseenter"],[null,"mouseleave"]],function(n,t,l){var r=!0;return"mouseenter"===t&&(r=!1!==e._16(n,4).addRaisedClass()&&r),"mouseleave"===t&&(r=!1!==e._16(n,4).unraise()&&r),r},D.b,D.a)),e._3(3,49152,null,0,R.a,[],null,null),e._3(4,540672,null,0,I.a,[e.k],null,null),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(6,0,null,0,2,"mat-card-title",[["class","mat-card-title"]],null,null,null,null,null)),e._3(7,16384,null,0,R.j,[],null,null),(n()(),e._25(-1,null,["A simple Perceptron"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(10,0,null,0,10,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(11,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["\n      We are using a simple perceptron model with 2 inputs (x and y coordinates).\n      "])),(n()(),e._4(13,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n      The learned classes for the given points have the simple definition x > y.\n      "])),(n()(),e._4(15,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n      The learning rate starts with 0.3 and is slowly reduced with each learned data point.\n      "])),(n()(),e._4(17,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n      Click left to add add points of class1.\n      "])),(n()(),e._4(19,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n      Click right to add add points of class2.\n    "])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(22,0,null,0,6,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(23,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(25,0,null,null,2,"app-data-view",[],null,[[null,"dataViewClicked"]],function(n,t,l){var e=!0;return"dataViewClicked"===t&&(e=!1!==n.component.addPoint(l)&&e),e},X,z)),e._3(26,4964352,null,0,B,[G],{perceptron:[0,"perceptron"],points:[1,"points"]},{dataViewClicked:"dataViewClicked"}),(n()(),e._25(-1,null,['\n        [canvasWidth]="width"\n        [canvasHeight]="height"\n      '])),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(30,0,null,0,1,"div",[],null,null,null,null,null)),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(34,0,null,null,1,"app-brain-settings",[],null,null,null,en,ln)),e._3(35,114688,null,0,tn,[G],null,null),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(37,0,null,null,21,"mat-card",[["appRaiseCard",""],["class","perceptron-card mat-card"]],null,[[null,"mouseenter"],[null,"mouseleave"]],function(n,t,l){var r=!0;return"mouseenter"===t&&(r=!1!==e._16(n,39).addRaisedClass()&&r),"mouseleave"===t&&(r=!1!==e._16(n,39).unraise()&&r),r},D.b,D.a)),e._3(38,49152,null,0,R.a,[],null,null),e._3(39,540672,null,0,I.a,[e.k],null,null),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(41,0,null,0,2,"mat-card-title",[["class","mat-card-title"]],null,null,null,null,null)),e._3(42,16384,null,0,R.j,[],null,null),(n()(),e._25(-1,null,["Perceptron"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(45,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(46,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["Here we show the current perceptron with its last inputs and outputs"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(49,0,null,0,8,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(50,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(52,0,null,null,1,"div",[],null,null,null,null,null)),(n()(),e._25(53,null,["Learnrate: ",", learned data points: ",""])),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(55,0,null,null,1,"app-perceptron",[],null,null,null,un,an)),e._3(56,1228800,null,0,rn,[],{perceptron:[0,"perceptron"]},null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._25(-1,null,["\n"])),(n()(),e._25(-1,null,["\n\n"]))],function(n,t){var l=t.component;n(t,26,0,l.perceptron,l.points),n(t,35,0),n(t,56,0,l.perceptron)},function(n,t){var l=t.component;n(t,53,0,l.learnRate,l.learnedDataPoints)})}var pn=e._0("app-perceptron-tab",sn,function(n){return e._27(0,[(n()(),e._4(0,0,null,null,1,"app-perceptron-tab",[],null,null,null,cn,on)),e._3(1,114688,null,0,sn,[G],null,null)],function(n,t){n(t,1,0)},null)},{},{},[]),hn=function(){function n(n){this.brainService=n,this.width=300,this.height=300,this.perceptronsPerLayer=[2,3,1]}return n.prototype.ngOnInit=function(){this.brainService.createMultiPerceptron(2,this.perceptronsPerLayer)},Object.defineProperty(n.prototype,"perceptrons",{get:function(){return this.brainService.perceptrons},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"inputPerceptrons",{get:function(){return this.perceptrons[0]},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"hiddenPerceptrons",{get:function(){return this.perceptrons[1]},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"outputPerceptron",{get:function(){return this.perceptrons[this.perceptrons.length-1][0]},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"learnedDataPoints",{get:function(){return this.brainService.learnedDataPoints},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"learnRate",{get:function(){return this.brainService.learnRate},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"points",{get:function(){return this.brainService.points},enumerable:!0,configurable:!0}),n.prototype.addPoint=function(n){var t=n.click,l=new A(n.x/this.width,n.y/this.height,function(){return"left"===t?1:0});this.brainService.addPoint(l)},n}(),dn=e._2({encapsulation:0,styles:[[".perceptronsContainer[_ngcontent-%COMP%]{display:-ms-grid;display:grid;-ms-grid-columns:1fr 1fr 1fr 1fr;grid-template-columns:1fr 1fr 1fr 1fr;grid-gap:1rem}.inputLayer[_ngcontent-%COMP%]{-ms-grid-column:1;-ms-grid-column-span:1;grid-column:1/span 1;-ms-grid-row:3;-ms-grid-row-span:2;grid-row:3/span 2;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.hiddenLayer[_ngcontent-%COMP%]{-ms-grid-column:2;-ms-grid-column-span:1;grid-column:2/span 1;-ms-grid-row:3;-ms-grid-row-span:2;grid-row:3/span 2}.outputLayer[_ngcontent-%COMP%]{-ms-grid-column:3;-ms-grid-column-span:1;grid-column:3/span 1;-ms-grid-row:3;-ms-grid-row-span:2;grid-row:3/span 2;-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}app-data-view[_ngcontent-%COMP%]{-ms-grid-row:1;-ms-grid-row-span:2;grid-row:1/3;-ms-grid-column:1;-ms-grid-column-span:2;grid-column:1/span 2}app-brain-settings[_ngcontent-%COMP%]{-ms-flex-item-align:start;-ms-grid-row-align:start;align-self:start;-ms-grid-column:3;-ms-grid-column-span:2;grid-column:3/span 2;-ms-grid-row:1;-ms-grid-row-span:2;grid-row:1/span 2}"]],data:{}});function gn(n){return e._27(0,[(n()(),e._4(0,0,null,null,4,null,null,null,null,null,null,null)),(n()(),e._25(-1,null,["\n        "])),(n()(),e._4(2,0,null,null,1,"app-perceptron",[],null,null,null,un,an)),e._3(3,1228800,null,0,rn,[],{perceptron:[0,"perceptron"],canvasHeight:[1,"canvasHeight"],canvasWidth:[2,"canvasWidth"]},null),(n()(),e._25(-1,null,["\n      "]))],function(n,t){n(t,3,0,t.context.$implicit,200,200)},null)}function _n(n){return e._27(0,[(n()(),e._4(0,0,null,null,4,null,null,null,null,null,null,null)),(n()(),e._25(-1,null,["\n        "])),(n()(),e._4(2,0,null,null,1,"app-perceptron",[],null,null,null,un,an)),e._3(3,1228800,null,0,rn,[],{perceptron:[0,"perceptron"],canvasHeight:[1,"canvasHeight"],canvasWidth:[2,"canvasWidth"]},null),(n()(),e._25(-1,null,["\n      "]))],function(n,t){n(t,3,0,t.context.$implicit,200,200)},null)}function fn(n){return e._27(0,[(n()(),e._4(0,0,null,null,58,"div",[["class","perceptronsContainer"]],null,null,null,null,null)),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(2,0,null,null,1,"app-data-view",[],null,[[null,"dataViewClicked"]],function(n,t,l){var e=!0;return"dataViewClicked"===t&&(e=!1!==n.component.addPoint(l)&&e),e},X,z)),e._3(3,4964352,null,0,B,[G],{perceptron:[0,"perceptron"],points:[1,"points"],canvasWidth:[2,"canvasWidth"],canvasHeight:[3,"canvasHeight"],showLinearDivider:[4,"showLinearDivider"]},{dataViewClicked:"dataViewClicked"}),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(5,0,null,null,16,"mat-card",[["class","inputLayer mat-card"]],null,null,null,D.b,D.a)),e._3(6,49152,null,0,R.a,[],null,null),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(8,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(9,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["Input layer"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(12,0,null,0,8,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(13,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(15,0,null,null,1,"div",[],null,null,null,null,null)),(n()(),e._25(16,null,["Learnrate: ",", learned data points: ",""])),(n()(),e._25(-1,null,["\n      "])),(n()(),e.Z(16777216,null,null,1,null,gn)),e._3(19,802816,null,0,h.j,[e.N,e.K,e.r],{ngForOf:[0,"ngForOf"]},null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(23,0,null,null,16,"mat-card",[["class","hiddenLayer mat-card"]],null,null,null,D.b,D.a)),e._3(24,49152,null,0,R.a,[],null,null),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(26,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(27,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["Hidden layer"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(30,0,null,0,8,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(31,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(33,0,null,null,1,"div",[],null,null,null,null,null)),(n()(),e._25(34,null,["Learnrate: ",", learned data points: ",""])),(n()(),e._25(-1,null,["\n      "])),(n()(),e.Z(16777216,null,null,1,null,_n)),e._3(37,802816,null,0,h.j,[e.N,e.K,e.r],{ngForOf:[0,"ngForOf"]},null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(41,0,null,null,13,"mat-card",[["class","outputLayer mat-card"]],null,null,null,D.b,D.a)),e._3(42,49152,null,0,R.a,[],null,null),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(44,0,null,0,2,"mat-card-subtitle",[["class","mat-card-subtitle"]],null,null,null,null,null)),e._3(45,16384,null,0,R.i,[],null,null),(n()(),e._25(-1,null,["Output layer"])),(n()(),e._25(-1,0,["\n    "])),(n()(),e._4(48,0,null,0,5,"mat-card-content",[["class","mat-card-content"]],null,null,null,null,null)),e._3(49,16384,null,0,R.d,[],null,null),(n()(),e._25(-1,null,["\n      "])),(n()(),e._4(51,0,null,null,1,"app-perceptron",[],null,null,null,un,an)),e._3(52,1228800,null,0,rn,[],{perceptron:[0,"perceptron"],canvasHeight:[1,"canvasHeight"],canvasWidth:[2,"canvasWidth"]},null),(n()(),e._25(-1,null,["\n    "])),(n()(),e._25(-1,0,["\n  "])),(n()(),e._25(-1,null,["\n  "])),(n()(),e._4(56,0,null,null,1,"app-brain-settings",[],null,null,null,en,ln)),e._3(57,114688,null,0,tn,[G],{perceptronLayers:[0,"perceptronLayers"]},null),(n()(),e._25(-1,null,["\n"])),(n()(),e._25(-1,null,["\n"]))],function(n,t){var l=t.component;n(t,3,0,l.outputPerceptron,l.points,l.width,l.height,!1),n(t,19,0,l.inputPerceptrons),n(t,37,0,l.hiddenPerceptrons),n(t,52,0,l.outputPerceptron,200,200),n(t,57,0,l.perceptronsPerLayer)},function(n,t){var l=t.component;n(t,16,0,l.learnRate,l.learnedDataPoints),n(t,34,0,l.learnRate,l.learnedDataPoints)})}var mn=e._0("app-multi-perceptron",hn,function(n){return e._27(0,[(n()(),e._4(0,0,null,null,1,"app-multi-perceptron",[],null,null,null,fn,dn)),e._3(1,114688,null,0,hn,[G],null,null)],function(n,t){n(t,1,0)},null)},{},{},[]),bn=l("6sdf"),vn=l("Mcof"),yn=l("z7Rf"),wn=l("ItHS"),kn=l("OE0E"),Pn=l("NwsS"),Sn=l("fTri"),Cn=l("AP/s"),Ln=l("TBIh"),xn=l("704W"),On=l("bkcK"),jn=l("ZuzD"),Dn=l("sqmn"),Rn=l("kJ/S"),In=l("4rwD"),Wn=l("JkvL"),Mn=l("+76Z"),Tn=l("Bp8q"),Hn=l("fAE3"),An=([{path:"",component:P,children:[{path:"perceptron",component:sn},{path:"multiPerceptron",component:hn}]}].filter(function(n){return n.path.length>0}),function(){});l.d(t,"NeuralNetworkModuleNgFactory",function(){return En});var En=e._1(r,[],function(n){return e._12([e._13(512,e.j,e.X,[[8,[u.a,O,pn,mn]],[3,e.j],e.w]),e._13(4608,h.m,h.l,[e.t,[2,h.v]]),e._13(4608,Y.v,Y.v,[]),e._13(6144,m.b,null,[h.d]),e._13(4608,m.c,m.c,[[2,m.b]]),e._13(4608,o.a,o.a,[]),e._13(4608,U.i,U.i,[o.a]),e._13(4608,U.h,U.h,[U.i,e.y,h.d]),e._13(136192,U.d,U.b,[[3,U.d],h.d]),e._13(5120,U.l,U.k,[[3,U.l],[2,U.j],h.d]),e._13(5120,U.g,U.e,[[3,U.g],e.y,o.a]),e._13(4608,bn.b,bn.b,[]),e._13(4608,c.d,c.d,[]),e._13(5120,v.d,v.b,[[3,v.d],e.y,o.a]),e._13(5120,v.g,v.f,[[3,v.g],o.a,e.y]),e._13(4608,nn.i,nn.i,[v.d,v.g,e.y,h.d]),e._13(5120,nn.e,nn.j,[[3,nn.e],h.d]),e._13(4608,nn.h,nn.h,[v.g,h.d]),e._13(5120,nn.f,nn.m,[[3,nn.f],h.d]),e._13(4608,nn.c,nn.c,[nn.i,nn.e,e.j,nn.h,nn.f,e.g,e.q,e.y,h.d]),e._13(5120,nn.k,nn.l,[nn.c]),e._13(4608,vn.d,vn.d,[o.a]),e._13(135680,vn.a,vn.a,[vn.d,e.y]),e._13(5120,Q.b,Q.c,[nn.c]),e._13(5120,yn.d,yn.a,[[3,yn.d],[2,wn.a],kn.c,[2,h.d]]),e._13(5120,Pn.a,Pn.b,[nn.c]),e._13(4608,kn.f,c.e,[[2,c.i],[2,c.n]]),e._13(4608,E,E,[]),e._13(4608,G,G,[E]),e._13(512,h.c,h.c,[]),e._13(512,Sn.a,Sn.a,[]),e._13(512,Y.s,Y.s,[]),e._13(512,Y.h,Y.h,[]),e._13(512,m.a,m.a,[]),e._13(256,c.f,!0,[]),e._13(512,c.n,c.n,[[2,c.f]]),e._13(512,o.b,o.b,[]),e._13(512,c.x,c.x,[]),e._13(512,U.a,U.a,[]),e._13(512,Z.c,Z.c,[]),e._13(512,bn.c,bn.c,[]),e._13(512,Cn.c,Cn.c,[]),e._13(512,Ln.c,Ln.c,[]),e._13(512,xn.b,xn.b,[]),e._13(512,g.b,g.b,[]),e._13(512,On.g,On.g,[]),e._13(512,v.c,v.c,[]),e._13(512,nn.g,nn.g,[]),e._13(512,vn.c,vn.c,[]),e._13(512,Q.e,Q.e,[]),e._13(512,yn.c,yn.c,[]),e._13(512,R.h,R.h,[]),e._13(512,c.o,c.o,[]),e._13(512,c.v,c.v,[]),e._13(512,jn.a,jn.a,[]),e._13(512,Dn.c,Dn.c,[]),e._13(512,c.t,c.t,[]),e._13(512,Pn.d,Pn.d,[]),e._13(512,Rn.h,Rn.h,[]),e._13(512,In.b,In.b,[]),e._13(512,J.b,J.b,[]),e._13(512,s.j,s.j,[]),e._13(512,Wn.b,Wn.b,[]),e._13(512,Mn.b,Mn.b,[]),e._13(512,Tn.b,Tn.b,[]),e._13(512,Hn.a,Hn.a,[]),e._13(512,p.o,p.o,[[2,p.t],[2,p.l]]),e._13(512,An,An,[]),e._13(512,r,r,[]),e._13(256,Q.a,{showDelay:0,hideDelay:0,touchendHideDelay:1500},[]),e._13(256,Rn.a,!1,[]),e._13(1024,p.j,function(){return[[{path:"",component:P,children:[{path:"perceptron",component:sn},{path:"multiPerceptron",component:hn}]}]]},[])])})}});