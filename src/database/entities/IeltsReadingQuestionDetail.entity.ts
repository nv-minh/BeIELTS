import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ielts_reading_question_detail')
export class IeltsReadingQuestionDetail {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number

    @Column({name: 'questionId', type: 'int', nullable: false})
    questionId: number

    @Column({name: 'title', type: 'varchar'})
    title: string

    @Column({name: 'content', type: 'varchar', length:10000})
    content: string

    @Column({name: 'createdAt',  nullable: true})
    createdAt: Date;

    @Column({name: 'updatedAt', nullable: true})
    updatedAt: Date;
    
    @BeforeInsert()
    public updateCreateDates() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    @BeforeUpdate()
    public updateUpdateDates() {
        this.updatedAt = new Date()
    }
}