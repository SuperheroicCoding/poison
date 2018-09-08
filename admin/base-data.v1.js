const defaultShaders = require('./default-shaders.v1').defaultShaders;

/**
 *
 * @param: db: admin.firestore.Firestore a firestore db
 */
async function initBaseData(db) {
  const defaultShadersCol = db.collection('angularExamples/shaderExamples/defaultShaders');
  const defaultShadersQuery = await defaultShadersCol.orderBy('id').get();
  const deletePromises = defaultShadersQuery.docs.map(shaderDoc => {
      return shaderDoc.ref.delete();
    }
  );

  await Promise.all(deletePromises);
  console.log('defaultShaders deleted');

  console.log('start upload default shaders');
  const uploadPromises = defaultShaders
    .map((shader, index) => ({id: index, ...shader}))
    .map((shader) =>
      defaultShadersCol.add(shader)
    );
  await Promise.all(uploadPromises);

  console.log('Added default shaders to angularExamples/shaderExamples/defaultShaders');
}

module.exports = {initBaseData};

