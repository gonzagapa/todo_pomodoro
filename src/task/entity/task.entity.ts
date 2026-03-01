import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../types/task.types";

@Entity({name: 'tasks'})
export class Task {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 255})
    title: string;

    @Column({length: 500, nullable:true})
    description?: string;

    @Column({type: 'enum', enum: TaskStatus, default:TaskStatus.PENDING})
    status: TaskStatus; 

    @Column({type: 'int', default: 0, nullable:true})
    priority: number;

    @Column({type: 'timestamp', default:() =>'CURRENT_TIMESTAMP'})
    createdAt:Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt:Date


}