import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

export class option {
    label: string;
    content: string;
}

@Entity('question_group')
export class QuestionGroup {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'testId', type: 'int'})
    testId: number;

    @Column({name: 'partId', type: 'int'})
    partId: number;

    @Column({name: 'type', type: 'varchar', length: 255})
    type: string;

    @Column({name: 'from', type: 'int'})
    from: number;

    @Column({name: 'to', type: 'int', nullable: true})
    to: number;

    @Column({name: 'content', type: 'text'})
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