const defaultShaders = require('./default-shaders.v1').defaultShaders;

console.log(defaultShaders);

/**
 *
 * @param: db: admin.firestore.Firestore a firestore db
 */
async function initBaseData(db) {
  const collection = db.collection('angularExamples');
  const defaultShadersRef = collection.doc('shaderExamples');
  await defaultShadersRef.delete();
  const data = {defaultShaders};
  await defaultShadersRef.set(data);
}

module.exports = {initBaseData};

