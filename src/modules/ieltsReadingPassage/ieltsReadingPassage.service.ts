import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions } from "nestjs-typeorm-paginate";
import { IeltsReadingPassage } from "src/database/entities/IeltsReadingPassage.entity";
import { getArrayPaginationBuildTotal, getOffset } from "src/shared/Utils";
import { DataSource, Repository } from "typeorm";
import { IeltsReadingPassageDto, UpdateIeltsReadingPassageDto } from "./request/ieltsReadingPassage.dto";

@Injectable()
export class IeltsReadingPassageService{
    constructor(
        @InjectRepository(IeltsReadingPassage)
        private ieltsReadingPassageRepo: Repository<IeltsReadingPassage>,
        @InjectDataSource()
        private dataSource: DataSource
    ){

    }
    async getIeltsReadingPassageById(id:number){
        const ieltsReadingPassage = await this.ieltsReadingPassageRepo.findOne({
            where:{
                id
            }
        })
        if(!ieltsReadingPassage) return {message:"Id is not exist"}
        return ieltsReadingPassage
    }

    async getList(filter, paginationOptions: IPaginationOptions){
        let offset = getOffset(paginationOptions)
        let limit = Number(paginationOptions.limit)
        let queryBuilder = this.dataSource
                        .createQueryBuilder(IeltsReadingPassage, 'ielts_reading_passage')
                        .select("*")
                        .orderBy("passageNumber","ASC")
                        .limit(limit)
                        .offset(offset)
        let queryCount = this.dataSource
                        .createQueryBuilder(IeltsReadingPassage,'ielts_reading_passage')
                        .select("Count (1) as Total")
        if(filter.testId){
            queryBuilder.andWhere(`testId = :testId`, {testId: filter.testId})
            queryCount.andWhere(`testId = :testId`, {testId: filter.testId})
        }

        const Passage = await queryBuilder.execute()
        const PassageCountList = await queryCount.execute()

        const{items, meta} = getArrayPaginationBuildTotal<IeltsReadingPassage>(Passage, PassageCountList, paginationOptions )
        return{
            results: items,
            pagination: meta
        }
    }

    async delete(id){
        const passage = await this.ieltsReadingPassageRepo.findOne({
            where:{
                id
            }
        })
        if (!passage) return {
            error: "Id is not exist"
        }
        return await this.ieltsReadingPassageRepo.delete(id)
    }
}
