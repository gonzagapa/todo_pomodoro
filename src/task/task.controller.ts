import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dtos/create-task.dto';


@Controller('task')
export class TaskController {

    //TODO: implementar metodo create y findAll

    constructor(private readonly taskService:TaskService){}

    @Post()
    create(@Body() createTask:CreateTaskDTO):CreateTaskDTO{
        this.taskService.createTask(createTask);
        return createTask;
    }

}
