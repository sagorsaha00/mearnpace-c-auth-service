import {
   Column,
   CreateDateColumn,
   Entity,
   ManyToOne,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'refreshTokens' })
export class RefreshToken {
   @PrimaryGeneratedColumn()
   id: number

   @Column({ type: 'timestamp' })
   expriseAt: Date

   @ManyToOne(() => User)
   user: User

   @UpdateDateColumn()
   updatedAt: number

   @CreateDateColumn()
   CreatedAt: number
}
