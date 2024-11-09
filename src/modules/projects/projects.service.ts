import {HttpStatus, NotFoundException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/projectResponse.dto';
import { ContributeToProjectDto } from './dto/contribute-to-project.dto';
import { response, extractPaginationData, extractSortingData, convertParams } from '../../common/helpers';
import { ProjectRepository } from './repositories/project.repository';
import { Project } from './entities/project.entity';
import { query } from 'express';


@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async createProject(createProjectDto: CreateProjectDto) {
    const project = new Project({
      title: createProjectDto.title,
      description: createProjectDto.description,
      goal: createProjectDto.goal,
      raised: 0
    });

    const savedProject = await this.projectRepository.createProject(project);
    return response(HttpStatus.CREATED, 'Project created successfully', savedProject);
  }

  async findAll(query: QueryOptions) {
    //Intialisation de la pagination
    query = extractPaginationData(query)
    query = extractSortingData(query)
    query = convertParams(query)

    const projects = await this.projectRepository.findAll(query);
    return response(HttpStatus.OK, 'Projects retrieved successfully', projects);
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findById(id);
    if(!project){
      throw new NotFoundException(`Project of id: ${id} not found`);
    }
    const projectResponse = new ProjectResponseDto(project);
    return response(HttpStatus.OK, 'Project retrieved successfully', projectResponse);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository.findById(id)
    if(!project){
      throw new NotFoundException(`Project of id: ${id} not found`);
    }
    Object.assign(project, updateProjectDto);
    const updatedProject = await this.projectRepository.update(id, project);
    return response(HttpStatus.OK, 'Project updated successfully', updatedProject);
  }

  async contribute(id: string, contributeToProjectDto: ContributeToProjectDto) {
    const project = await this.projectRepository.findById(id)
    if(!project){
      throw new NotFoundException(`Project of id: ${id} not found`);
    }
        // Check if project has reached its goal
        if (project.raised >= project.goal) {
          return response(
            HttpStatus.BAD_REQUEST, 
            'Cannot contribute to this project as it has reached its goal'
          );
        }
        const newRaisedAmount = project.raised + contributeToProjectDto.raised;
        await this.projectRepository.updateRaiseAmount(id, newRaisedAmount);
        const RaisedProject = await this.projectRepository.findById(id);
    return response(HttpStatus.OK, 'Project contributed successfully', RaisedProject);
  }

  async remove(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.delete(id);
    return response(HttpStatus.OK, 'Project deleted successfully');
  }

  async isProjectFunded(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return response(
      HttpStatus.OK, 
      'Project funding status retrieved', 
      { isFunded: project.raised >= project.goal }
    );
  }
  
}
