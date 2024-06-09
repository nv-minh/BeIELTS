import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('ielts_writing_part_detail')
export class IeltsWritingPartDetail {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'partId', type: 'int', nullable: false})
    partId: number;

    @Column({name: 'content', type: 'varchar', length: 10000})
    content: string

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