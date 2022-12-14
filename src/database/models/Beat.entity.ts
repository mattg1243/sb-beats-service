import { Entity, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import Model from './Model.entity';
import { GenreTags } from '../../utils/genreTags';

@Entity('beats')
export default class Beat extends Model {
  @Column()
  name: string;

  @Column({ nullable: true })
  artwork: string;
  // id of artist in User table
  @Column()
  artist: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  tempo: number;

  @Column({ nullable: true, array: true })
  genreTags: GenreTags;

  @Column({ nullable: true, array: true })
  otherTags: string;

  @Column()
  clipPath: string;

  @Column()
  wavPath: string;

  @Column({ default: false })
  licensed: boolean;
}
