const fs = require('fs')
const glob = require('glob')
const mime = require('mime')
const AWS = require('aws-sdk')

const AWS_BUCKET = 'jira-dashboard'
const AWS_REGION = 'eu-central-1'

const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
	console.log('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required')
	process.exit(1)
}

const s3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION,
	signatureVersion: 'v4'
})

glob('**/*', {cwd: __dirname + '/dist', nodir: true}, (err, files) => {
	if (err) throw err

	files.forEach(file => {
		fs.readFile('./dist/' + file, (err, data) => {
			if (err) throw err

			let params = {
				Bucket: AWS_BUCKET,
				Key: file,
				Body: data,
				ContentType: mime.lookup(file)
			}

			if (file !== 'index.html') {
				params.CacheControl = 'public, max-age=31536000'
			}

			s3.putObject(params, err => console.log(err ? err : file))
		})
	})
})
