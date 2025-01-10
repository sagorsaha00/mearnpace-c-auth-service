import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Tenants } from './Tenant'

@Entity({ name: 'users' })
export class User {
   @PrimaryGeneratedColumn()
   id: number

   @Column()
   firstname: string

   @Column()
   lastname: string

   @Column({ unique: true })
   email: string
   @Column()
   password: string

   @Column()
   role: string

   @ManyToOne(() => Tenants)
   tanent: Tenants
}
