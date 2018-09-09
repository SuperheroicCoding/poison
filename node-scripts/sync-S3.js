const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const ONE_WEEK = 60 * 60 * 24 * 14;

const credentials = new AWS.SharedIniFileCredentials();

const myConfig = new AWS.Config({
  credentials,
  region: 'eu-west-1'
});

var s3 = new AWS.S3();

const bucket = 'superheroiccoding.de';
const prefix = 'angularExamples/';
const args = process.argv.slice(2);
const excludeAssets = args.some((elem) => elem.indexOf('excludeAssets') > -1);

deleteFromBucket(bucket, prefix)
  .then(() => uploadFolderToBucket('distS3/', bucket, prefix))
  .then(() => invalidateIndex());

console.log('excludeAssets:', excludeAssets);

function deleteFromBucket(bucket, prefix) {
  return new Promise((resolve, reject) => {

    s3.listObjects({Bucket: bucket, Prefix: prefix}, (err, data) => {
        if (err) {
          console.error('There was an error listing ' + prefix + ' objects', err.message);
          return reject(err);
        }
        const objects = data.Contents
          .filter((object) => excludeAssets ? object.Key.indexOf('assets')  < 0 : true)
          .map(function (object) {
            return {Key: object.Key};
          });

        if (objects.length === 0) {
          console.log('No objects found under ' + prefix);
          return resolve(objects);
        }

        s3.deleteObjects({
          Bucket: bucket,
          Delete: {Objects: objects}
        }, (err, data) => {
          if (err) {
            console.error('There was an error deleting ', +prefix + ' objects', err.message, err.stack);
            return reject(err);
          }
          console.log('Successfully deleted ' + prefix + ' from bucket', data.Deleted.reduce((prev, object) => prev + '\n' + object.Key, ''));
          return resolve(objects);
        });
      }
    );
  });
}


// async version with basic error handling
function getAllFilesFor(currentDirPath) {
  const files = fs.readdirSync(currentDirPath);

  return files.reduce((prevFiles, name) => {
      const filePath = path.join(currentDirPath, name);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        return [...prevFiles, filePath];
      }
      if (stat.isDirectory()) {
        return [...prevFiles, ...getAllFilesFor(filePath)];
      }
      return prevFiles;
    }, []
  );
}


function uploadFolderToBucket(folder, bucket, prefix) {

  const allFiles = getAllFilesFor(folder)
    .filter((file) => excludeAssets ? file.indexOf('assets')  < 0 : true);
  return uploadFilesInBatches(allFiles, folder, bucket, prefix, 0)
}

function uploadFilesInBatches(allFiles, folder, bucket, prefix, startIndex) {
  let batch = allFiles.slice(startIndex, startIndex + 5);
  if (batch.length > 0) {
    const promises = batch.

    map((filePath) => {
      // read file contents
      return new Promise((resolveInner, rejectInner) => {
        fs.readFile(filePath, (error, fileContent) => {
          // if unable to read file contents, throw exception
          if (error) {
            console.log('error reading file', filePath);
            return rejectInner(error);
          }

          const fileName = filePath.replace(/\\/g, '/').replace(folder, prefix);
          const cacheControl = getCacheControlFor(fileName);
          const contentType = getContentTypeFor(fileName);

          s3.upload({
            ACL: 'public-read',
            Bucket: bucket,
            Key: fileName,
            Body: fileContent,
            ContentType: contentType,
            CacheControl: cacheControl
          }, (err, data) => {
            if (err) {
              console.error(`Error uploading '${fileName}'!`, err.stack);
              return rejectInner(err);
            }
            console.log(`Successfully uploaded '${fileName}' with content-type: ${contentType} and cache-control: ${cacheControl}!`);
            resolveInner(data);
          });
        });
      });
    });
    return Promise.all(promises)
      .then(data => {
        console.log('success upload batch of 5 files');
        return uploadFilesInBatches(allFiles, folder, bucket, prefix, startIndex + 5);
      });
  }
  console.log('success uploaded all batches');
  return 'finish';
}

/**
 *
 * @param fileName {string}
 * @returns {string}
 */
function getContentTypeFor(fileName) {
  const fileEnding = fileName.substring(fileName.lastIndexOf('.'));

  if (fileEnding === '.html') return 'text/html';
  if (fileEnding === '.css') return 'text/css';
  if (fileEnding === '.json') return 'application/json';
  if (fileEnding === '.js') return 'application/x-javascript';
  if (fileEnding === '.png') return 'image/png';
  if (fileEnding === '.jpg') return 'image/jpg';
  if (fileEnding === '.jpeg') return 'image/jpeg';
  if (fileEnding === '.svg') return 'image/svg+xml';
  if (fileEnding === '.ico') return 'image/x-icon';
  return 'application/octet-stream';
}

/**
 *
 * @param fileName {string}
 * @returns {string}
 */
function getCacheControlFor(fileName) {

  if (fileName.indexOf('ngsw.json') > 0) {
    return 'no-cache, no-store, must-revalidate';
  }
  return 'public, max-age=' + ONE_WEEK;
}

function invalidateIndex() {
  const callerReference = '' + Math.random();
  new AWS.CloudFront().createInvalidation({
    DistributionId: 'EW5AZB46F9YF1', InvalidationBatch: {
      Paths: {Quantity: 2, Items: ['/index.html', '/ngsw.json']},
      CallerReference: callerReference
    }
  }, (err, data) => {
    if (err) {
      return console.log('Error creating invalidation', err);
    }
    return console.log('Successfully invalidated index.html', JSON.stringify(data));
  });
}
