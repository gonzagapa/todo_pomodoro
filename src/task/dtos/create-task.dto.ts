import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../types/task.types";

export class CreateTaskDTO {
        @IsString()
        title: string;


        @IsString()
        @IsOptional()
        description?: string;

        @IsEnum(TaskStatus)
        @IsOptional()
        status: TaskStatus; 
        
        @IsNumber()
        @IsOptional()
        priority?: number;
}