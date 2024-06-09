import { Controller, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
        
    }
    
    @Post('single-file')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
            ]
        })
    ) file: Express.Multer.File){
        return await this.uploadService.upload(file)
    }

    @Post('multiple-file')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultipleFiles(@UploadedFiles(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
            ]
        })
    ) files: Array<Express.Multer.File>){
        return await this.uploadService.uploadMultipleFiles(files)
    }
}   