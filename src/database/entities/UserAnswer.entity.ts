import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('user_answer')
export class UserAnswer {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'userId', type: 'int'})
    userId: number;

    @Column({name: 'testId', type: 'int'})
    testId: number;

    @Column({name: 'partId', type: 'int'})
    partId: number;

    @Column({name: 'partNumber', type: 'int', nullable: true})
    partNumber: number;

    @Column({name: 'questionId', type: 'int', nullable: true})
    questionId: number;

    @Column({name: 'questionNumber', type: 'int', nullable: true})
    questionNumber: number;

    @Column({name: 'question', type: 'text', nullable: true})
    question: string;

    @Column({name: 'answer', type: 'text', nullable: true})
    answer: string;

    @Column({name: 'key', type: 'text', nullable: true})
    key: string;

    @Column({name: 'isCorrect', type: 'boolean', nullable: true})
    isCorrect: boolean;

    @Column({name: 'testResultId', type: 'int', nullable: true})
    testResultId: number;
    
    @Column({name: 'score', type: 'float', nullable: true})
    score: number;

    @Column({name: 'comment', type: 'text', nullable: true})
    comment: string;

    @Column({name: 'reviewerName', type: 'text', nullable: true})
    reviewerName: string;

    @Column({name: 'reviewerId', type: 'int', nullable: true})
    reviewerId: Number;

    @Column({name: 'createdAt', nullable: true})
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