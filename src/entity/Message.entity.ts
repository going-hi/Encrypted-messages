import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    message: string

    @Column({unique: true})
    code: string

    @Column('varchar', {length: 200, nullable: true})
    description: string

    @Column('text')
    password: string

    @Column({default: 0})
    views: number

    @Column()
    iv: string
}