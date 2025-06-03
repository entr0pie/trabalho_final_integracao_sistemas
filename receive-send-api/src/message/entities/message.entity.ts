// src/message/entities/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  message: string;

  @Column()
  userIdSend: number;

  @Column()
  userIdReceive: number;

  @CreateDateColumn()
  createdAt: Date;
}
