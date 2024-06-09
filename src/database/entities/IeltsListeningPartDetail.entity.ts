import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('ielts_listening_part_detail')
export class IeltsListeningPartDetail {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number;

    @Column({name: 'partId', type: 'int', nullable: false})
    partId: number;

    @Column({name: 'audioSrc', type: 'varchar', length: 10000})
    audioSrc: string

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