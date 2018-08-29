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
  private angularExamplesCol: AngularFirestoreCollection<ShaderExamplesCollectionType>;

  constructor(afs: AngularFirestore) {
    this.angularExamplesCol = afs.collection<ShaderExamplesCollectionType>('angularExamples');
    const shaderExamplesDoc = this.angularExamplesCol.doc<DefaultShaderDoc>('shaderExamples').valueChanges();
    this.shaders$ = shaderExamplesDoc.pipe(
      filter(data => data != undefined),
      map(data => data.defaultShaders),
      shareReplay(1)
    );
  }

}
