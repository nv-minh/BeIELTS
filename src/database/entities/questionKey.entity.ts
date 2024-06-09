import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('question_key')
export class QuestionKey {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'testId', type: 'int'})
    testId: number;

    @Column({name: 'partId', type: 'int'})
    partId: number;
    
    @Column({name: 'questionGroupId', type: 'int', nullable: true})
    questionGroupId: number;

    @Column({name: 'questionNumber', type: 'int'})
    questionNumber: number;

    @Column({name: 'key', type: 'varchar', length: '255', nullable: true})
    key: string;

    @Column({name: 'content', type: 'varchar', length: '10000', nullable: true})
    content: string;

    @Column({name: 'createdAt'})
    createdAt: Date;

    @Column({name: 'updatedAt'})
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