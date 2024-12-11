import { Controller, Get } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {
    constructor(private readonly analyzeService: AnalyzeService) { }

    @Get('age-gender-distribution')
    async getAgeDistribution() {
        return this.analyzeService.getAgeGenderDistribution();
    }


    @Get('height-distribution')
    async getHeightDistribution() {
        return this.analyzeService.getHeightDistribution();
    }
}
