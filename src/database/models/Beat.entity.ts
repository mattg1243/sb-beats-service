import { Entity, Column } from 'typeorm';
import Model from './Model.entity';

@Entity('beats')
export default class Beat extends Model {
  @Column()
  title: string;
  // S3 bucket key
  @Column({ nullable: true })
  artworkKey: string;
  // S3 bucket key
  @Column()
  audioKey: string;
  // id of artist in User table
  @Column()
  artistID: string;
  // naemof artist in User table
  @Column()
  artistName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  tempo: number;

  @Column()
  key: string;
  // TODO: makes this only accept valid genre tags
  // tag fields are formatted as comma seperated values
  @Column({ type: 'simple-array' })
  genreTags: string[];

  @Column({ type: "simple-array", nullable: true })
  otherTags: string[];

  @Column({ default: false })
  licensed: boolean;
}
