import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, AddMilestoneDto, ReleaseMilestoneDto, SubmitMilestoneDto } from './dto/create-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    // In production, get client address from authenticated wallet
    const clientAddress = req.headers['x-wallet-address'] || 'temp-client-address';
    return this.projectsService.createProject(clientAddress, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.projectsService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get('projectId/:projectId')
  @ApiOperation({ summary: 'Get project by projectId' })
  async findByProjectId(@Param('projectId') projectId: string) {
    return this.projectsService.findByProjectId(+projectId);
  }

  @Get('client/:address')
  @ApiOperation({ summary: 'Get projects by client address' })
  async findByClient(@Param('address') address: string) {
    return this.projectsService.findByClientAddress(address);
  }

  @Get('freelancer/:address')
  @ApiOperation({ summary: 'Get projects by freelancer address' })
  async findByFreelancer(@Param('address') address: string) {
    return this.projectsService.findByFreelancerAddress(address);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update project status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.projectsService.updateStatus(+id, status);
  }

  @Get('stats/:address')
  @ApiOperation({ summary: 'Get statistics for a user' })
  async getStats(@Param('address') address: string) {
    return this.projectsService.getStats(address);
  }
}

export { ProjectsService };