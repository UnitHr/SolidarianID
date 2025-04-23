import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['followerId', 'followedId'], { unique: true })
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerId: string;

  @Column()
  followedId: string;

  @Column()
  followerFullName: string;

  @Column()
  followerEmail: string;

  @Column({ type: 'timestamp' })
  followedAt: Date;
}
