import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto, AddMilestoneDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(clientAddress: string, createProjectDto: CreateProjectDto): Promise<Project> {
    this.logger.log(`Creating project for client ${clientAddress}`);

    const lastProject = await this.projectRepository.find({
      order: { projectId: 'DESC' },
      take: 1,
    });

    const nextProjectId = lastProject.length > 0 ? lastProject[0].projectId + 1 : 1;

    const project = this.projectRepository.create({
      projectId: nextProjectId,
      clientAddress,
      freelancerAddress: createProjectDto.freelancerAddress,
      title: createProjectDto.title,
      description: createProjectDto.description,
      totalAmount: createProjectDto.totalAmount,
      tokenAddress: createProjectDto.tokenAddress,
      status: 'active',
      releasedAmount: 0,
    });

    return this.projectRepository.save(project);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Project[]; total: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByProjectId(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { projectId } });

    if (!project) {
      throw new NotFoundException(`Project with projectId ${projectId} not found`);
    }

    return project;
  }

  async findByClientAddress(address: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { clientAddress: address },
      order: { createdAt: 'DESC' },
    });
  }

  async findByFreelancerAddress(address: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { freelancerAddress: address },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string): Promise<Project> {
    const project = await this.findOne(id);
    project.status = status;
    return this.projectRepository.save(project);
  }

  async updateReleasedAmount(id: number, amount: number): Promise<Project> {
    const project = await this.findOne(id);
    project.releasedAmount += amount;
    return this.projectRepository.save(project);
  }

  async getStats(address: string): Promise<any> {
    const asClient = await this.findByClientAddress(address);
    const asFreelancer = await this.findByFreelancerAddress(address);

    const totalSpent = asClient.reduce((sum, p) => sum + p.releasedAmount, 0);
    const totalEarned = asFreelancer.reduce((sum, p) => sum + p.releasedAmount, 0);

    return {
      asClient: {
        count: asClient.length,
        totalSpent,
      },
      asFreelancer: {
        count: asFreelancer.length,
        totalEarned,
      },
    };
  }
}