import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
    private region: string
    private s3: S3Client
    constructor(
        private readonly configService: ConfigService
    ){
        this.region = this.configService.get<string>('AWS_S3_REGION')
        this.s3 = new S3Client({
            region: this.region
        })
    }

    async upload(file: Express.Multer.File){
        const bucketName = process.env.AWS_S3_BUCKET_NAME
        const input: PutObjectCommandInput = {
            Body: file.buffer,
            Bucket: bucketName,
            Key: (new Date().toLocaleTimeString().split(":").join("_") + file.originalname.trim()).split(" ").join("_"),
            ContentType: file.mimetype,
            ACL: 'public-read'
        }
        try {
            const response: PutObjectCommandOutput = await this.s3.send(new PutObjectCommand(input))
            if (response.$metadata.httpStatusCode === 200) {
                return {
                    url: `https://${bucketName}.s3.${this.region}.amazonaws.com/${input.Key}`
                }
            }
            throw new Error("Upload failed")
        } catch (error) {
            throw new Error("Upload failed")
        }
    }

    async uploadMultipleFiles(files: Array<Express.Multer.File>){
        const urls = await Promise.all(files.map(async (file) => {
            const bucketName = process.env.AWS_S3_BUCKET_NAME
            const input: PutObjectCommandInput = {
                Body: file.buffer,
                Bucket: bucketName,
                Key: file.originalname.trim().split(" ").join("_") + Date.now().toString(),
                ContentType: file.mimetype,
                ACL: 'public-read'
            }
            try {
                const response: PutObjectCommandOutput = await this.s3.send(new PutObjectCommand(input))
                if (response.$metadata.httpStatusCode === 200) {
                    return {
                        url: `https://${bucketName}.s3.${this.region}.amazonaws.com/${input.Key}`
                    }
                }
                throw new Error("Upload failed")
            } catch (error) {
                throw new Error("Upload failed")
            }
        }))
        return urls
    }
}