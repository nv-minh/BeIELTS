import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('ielts_reading_passage')
export class IeltsReadingPassage {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'partId', type: 'int', nullable: false})
    partId: number;

    @Column({name: 'title', type: 'varchar'})
    title: string

    @Column({name: 'paragraphs', type: 'varchar', length: 10000})
    paragraphs: string

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