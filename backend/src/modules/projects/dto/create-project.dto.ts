import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'GABC123...', description: 'Freelancer Stellar address' })
  @IsString()
  @IsNotEmpty()
  freelancerAddress: string;

  @ApiProperty({ example: 'Build Landing Page', description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Create a responsive landing page with animations', description: 'Project description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5000000, description: 'Total amount in stroops (1 XLM = 10,000,000 stroops)' })
  @IsNumber()
  @Min(1)
  totalAmount: number;

  @ApiProperty({ example: 'GABC123...', description: 'Token address (XLM = native)' })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;
}

export class AddMilestoneDto {
  @ApiProperty({ example: 'Design Homepage', description: 'Milestone title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Create homepage wireframe and design', description: 'Milestone description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1000000, description: 'Milestone amount in stroops' })
  @IsNumber()
  @Min(1)
  amount: number;
}

export class ReleaseMilestoneDto {
  @ApiProperty({ example: 1, description: 'Project ID' })
  @IsNumber()
  @Min(1)
  projectId: number;

  @ApiProperty({ example: 1, description: 'Milestone ID' })
  @IsNumber()
  @Min(1)
  milestoneId: number;
}

export class SubmitMilestoneDto {
  @ApiProperty({ example: 1, description: 'Project ID' })
  @IsNumber()
  @Min(1)
  projectId: number;

  @ApiProperty({ example: 1, description: 'Milestone ID' })
  @IsNumber()
  @Min(1)
  milestoneId: number;
}