import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../types/task.types";

@Entity({name: 'tasks'})
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    title: string;

    @Column({length: 500, nullable:true})
    description?: string;

    @Column({type: 'enum', enum: TaskStatus, default:TaskStatus.PENDING})
    status: TaskStatus;
}