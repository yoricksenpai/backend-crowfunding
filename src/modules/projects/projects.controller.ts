import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {ContributeToProjectDto} from './dto/contribute-to-project.dto';
import {response} from '../../common/helpers'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      console.log('Received project data:', createProjectDto); // Ajoutez ce log
      return await this.projectsService.createProject(createProjectDto)
    } catch(error) {
      console.error('Project creation error:', error); // Ajoutez ce log
      return response(
        HttpStatus.BAD_REQUEST,
        `Error creating project: ${error.message}`, 
        error
      )
    }
}

  @Get()
  async findAll(@Query() query:QueryOptions) {
    try{
      return await this.projectsService.findAll(query)
    } catch(error){
      return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error fetching projects', error)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try{
      return this.projectsService.findOne(id);
    } catch(error){
      return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving project', error)
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    try{
      return this.projectsService.update(id, updateProjectDto);
    } catch(error){
      return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error updating project', error)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      return await this.projectsService.remove(id);
    } catch(error){
      return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error deleting project', error)
    }
  }

  @Post(':id/contribute')
  async contribute(@Param('id') id: string, @Body() contributeToProjectDto: ContributeToProjectDto) {
    try{
      return await this.projectsService.contribute(id, contributeToProjectDto);
    } catch(error){
      return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error contributing to project', error)
    }
  }

  @Get(':id/status')
    async getProjectStatus(@Param('id') id:string){
      try{
        return await this.projectsService.isProjectFunded(id)
      }catch(error){
        return response(HttpStatus.INTERNAL_SERVER_ERROR, 'Error retrieving the project status', error)
      }
    }
  
}
