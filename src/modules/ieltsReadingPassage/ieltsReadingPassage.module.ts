import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IeltsReadingPassage } from "src/database/entities";
import { IeltsReadingPassageController } from "./ieltsReadingPassage.controller";
import { IeltsReadingPassageService } from "./ieltsReadingPassage.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([IeltsReadingPassage])
    ],
    providers:[IeltsReadingPassageService],
    controllers:[IeltsReadingPassageController]
})
export class IeltsReadingPassageModule{
    
}