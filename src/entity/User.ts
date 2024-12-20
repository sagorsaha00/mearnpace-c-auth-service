import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number

   @Column({ nullable: true })
   firstname: string

   @Column({ nullable: true })
   lastname: string

   @Column({ nullable: true })
   email: string
   @Column({ nullable: true })
   password: string
}
