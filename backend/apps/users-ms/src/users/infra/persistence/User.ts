import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('date')
  birthDate: Date;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: false })
  showAge: boolean;

  @Column({ type: 'boolean', default: false })
  showEmail: boolean;

  @Column()
  role: string;

  @Column({ nullable: true })
  githubId?: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_followers',
    joinColumn: { name: 'followed_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'follower_id', referencedColumnName: 'id' },
  })
  // eslint-disable-next-line no-use-before-define
  followers: User[];
}
