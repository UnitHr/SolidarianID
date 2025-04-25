import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['followerId', 'followedId'], { unique: true })
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerId: string;

  @Column()
  followerFullName: string;

  @Column()
  followerEmail: string;

  @Column()
  followedId: string;

  @Column()
  followedFullName: string;

  @Column()
  followedEmail: string;

  @Column({ type: 'timestamp' })
  followedAt: Date;
}
