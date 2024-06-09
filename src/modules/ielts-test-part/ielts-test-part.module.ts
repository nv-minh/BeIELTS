import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IeltsTestPartService } from "./ielts-test-part.service";
import { IeltsTestPartController } from "./ielts-test-part.controller";
import { UploadService } from "../upload-aws-s3/upload.service";


@Module({
    providers:[IeltsTestPartService, UploadService],
    controllers:[IeltsTestPartController]
})
export class IeltsTestPartModule{
    
}