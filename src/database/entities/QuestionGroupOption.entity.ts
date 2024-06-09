import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('question_group_option')
export class QuestionGroupOption {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'questionGroupId', type: 'int'})
    questionGroupId: number;

    @Column({name: 'label', type: 'varchar', length: 50})
    label: string

    @Column({name: 'content', type: 'varchar', length: 10000})
    content: string

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