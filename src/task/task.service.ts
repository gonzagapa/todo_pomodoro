import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {

    private logger = new Logger('TasksService')

    constructor(
        @InjectRepository(Task)
        private readonly taskRepository:Repository<Task>){}

    async createTask(newTask:CreateTaskDTO){

        try{

            const task = this.taskRepository.create(newTask);
            return await this.taskRepository.save(task);
        }
        catch(error){
            this.logger.error(error);
            throw new InternalServerErrorException('ERRORRR')
        }

    }
}
