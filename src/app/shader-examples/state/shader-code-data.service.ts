import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {map, shareReplay, take, tap} from 'rxjs/operators';
import {ShaderCode} from './shader-code.model';
import {AuthenticationService} from '../../core/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ShaderCodeDataService {
  private shaders: Observable<ShaderCode[]>;

  private userShadersCol: AngularFirestoreCollection<ShaderCode>;
  private defaultShadersCol: AngularFirestoreCollection<ShaderCode>;

  constructor(private afs: AngularFirestore, private authentication: AuthenticationService) {
    const orderByIdQuery = ref => ref.orderBy('id');
    this.defaultShadersCol = this.afs.collection<ShaderCode>(
      '/angularExamples/shaderExamples/defaultShaders',
      orderByIdQuery
    );

    const uid = this.authentication.uid; // must be logged in
    this.userShadersCol = this.afs.collection<ShaderCode>(
      `angularExamples/shaderExamples/${uid}`,
      orderByIdQuery
    );
  }

  streamShaders(): Observable<ShaderCode[]> {
    if (this.shaders == null) {
      const defaultShaders = this.defaultShadersCol.valueChanges();
      const userShaders = this.userShadersCol.stateChanges(['added']).pipe(
        map(documentChanges => documentChanges.map(change => change.payload.doc.data()))
      );

      const mapDefaultAndUserShaders = map(([defaults, users]: [ShaderCode[], ShaderCode[]]) =>
        defaults.map(defaultShader => {
          const shaderCode = users.find(sha => sha.id === defaultShader.id);
          return shaderCode != null ? shaderCode : defaultShader;
        })
      );
      this.shaders = combineLatest(defaultShaders, userShaders).pipe(
        mapDefaultAndUserShaders,
        shareReplay(1));
    }
    return this.shaders;
  }

  async updateShader(shader: ShaderCode, newCode: string) {
    const shaderByIdQuery = this.afs.collection<ShaderCode>(
      `angularExamples/shaderExamples/${this.authentication.uid}`,
      ref => ref.where('id', '==', shader.id)
    );
    console.log('update shader');
    const batch = this.afs.firestore.batch();
    const newShader = {...shader, ...{code: newCode}};

    const deleteOldShadersAndUpdateInBatch = shaderByIdQuery.get({}).pipe(
      take(1),
      tap(ref => ref.docs.forEach(doc => doc.ref.delete())),
      tap(ignored => {
        const newUid = this.afs.createId();
        const firestoreDocument = this.afs.doc(
          `angularExamples/shaderExamples/${this.authentication.uid}/${newUid}`
        );
        firestoreDocument.ref.set(newShader);
      }),
    );

    return deleteOldShadersAndUpdateInBatch.toPromise();
  }
}
