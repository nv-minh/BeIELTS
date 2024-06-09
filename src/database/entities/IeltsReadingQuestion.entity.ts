import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ielts_reading_question')
export class IeltsReadingQuestion {
    @PrimaryGeneratedColumn({name: 'id', type: 'int'})
    id: number

    @Column({name: 'passageId', type: 'int', nullable: false})
    passageId: number

    @Column({name: 'from', type: 'int', nullable: false})
    from: number

    @Column({name: 'to', type: 'int', nullable: false})
    to: number

    @Column({name: 'type', type: 'varchar'})
    type: string 

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