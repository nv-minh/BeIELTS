import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('test_result')
export class TestResult {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'userId', type: 'int'})
    userId: number;

    @Column({name: 'testId', type: 'int'})
    testId: number;

    @Column({name: 'bandScore', type: 'float', nullable: true})
    bandScore: number;

    @Column({name: 'numberOfCorrectAnswers', type: 'int', nullable: true})
    numberOfCorrectAnswers: number;

    @Column({name: 'totalQuestions', type: 'int', nullable: true})
    totalQuestions: number;

    @Column({name: 'status', type: 'varchar', nullable: true})
    status: string;

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