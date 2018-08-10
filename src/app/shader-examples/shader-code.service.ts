import {Injectable} from '@angular/core';
import {ShaderDef} from './shaders-def';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {filter, map, shareReplay, tap} from 'rxjs/operators';

type DefaultShaderDoc = { defaultShaders: ShaderDef[] };
type ShaderExamplesCollectionType = { shaderExamples: DefaultShaderDoc };

@Injectable({
  providedIn: 'root'
})
export class ShaderCodeService {
  shaders$: Observable<ShaderDef[]>;
  private shaderExamplesCol: AngularFirestoreCollection<ShaderExamplesCollectionType>;

  constructor(afs: AngularFirestore) {

    this.shaderExamplesCol = afs.collection<ShaderExamplesCollectionType>('angularExamples');
    this.shaders$ = this.shaderExamplesCol.doc<DefaultShaderDoc>('shaderExamples').valueChanges().pipe(
      filter(data => data != undefined),
      map(data => data.defaultShaders),
      shareReplay(1)
    );
  }

}
