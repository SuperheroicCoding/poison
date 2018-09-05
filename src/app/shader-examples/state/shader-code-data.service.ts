import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {filter, map, shareReplay} from 'rxjs/operators';
import {createShaderCode, ShaderCode} from './shader-code.model';

interface DefaultShaderDoc {
  defaultShaders: Partial<ShaderCode>[];
}

interface ShaderExamplesCollectionType {
  shaderExamples: DefaultShaderDoc;
}

@Injectable({
  providedIn: 'root'
})
export class ShaderCodeDataService {
  private shaders: Observable<ShaderCode[]>;

  constructor(private afs: AngularFirestore) {
  }

  streamShaders(): Observable<ShaderCode[]> {
    if (this.shaders == null) {
      const angularExamplesCol = this.afs.collection<ShaderExamplesCollectionType>('angularExamples');
      const shaderExamplesDoc = angularExamplesCol.doc<DefaultShaderDoc>('shaderExamples').valueChanges();
      this.shaders = shaderExamplesDoc.pipe(
        filter(data => data != null),
        map(data => data.defaultShaders),
        map(shaders =>
            shaders.map(createShaderCode),
          shareReplay(1),
        ));
    }
    return this.shaders;
  }

}
