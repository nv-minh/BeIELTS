import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IeltsTest } from "src/database/entities";
import { IeltsTestService } from "./ielts-test.service";
import { IeltsTestController } from "./ielts-test.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([IeltsTest])
    ],
    providers: [IeltsTestService],
    controllers: [IeltsTestController]
})
export class IeltsTestModule {

}
