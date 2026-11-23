import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/auth.guard.js';
import { ApiErrors, ApiJwtAuth } from '../common/swagger/api-docs.decorators.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import {
  ExpensePageDto,
  ExpenseResponseDto,
} from './dto/expense-responses.dto.js';
import { ExpensesService } from './expenses.service.js';
import { ExpenseOwnerGuard } from './guards/expense-owner.guard.js';

// Toutes les routes de ce contrôleur commencent par /wallets/:walletId/expenses
// et exigent un jeton JWT (JwtAuthGuard) : c'est déjà configuré.
@Controller('wallets/:walletId/expenses')
@ApiTags('expenses')
@UseGuards(JwtAuthGuard)
@ApiJwtAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les dépenses d’un porte-monnaie' })
  @ApiOkResponse({ type: ExpensePageDto })
  @ApiErrors({ 403: 'Accès refusé.', 404: 'Porte-monnaie introuvable.' })
  findAll(
    @Param('walletId') walletId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.expensesService.findAll(walletId, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Déclarer une dépense' })
  @ApiCreatedResponse({ type: ExpenseResponseDto })
  @ApiErrors({
    400: 'Données invalides.',
    403: 'Accès refusé.',
    404: 'Porte-monnaie introuvable.',
    409: 'Porte-monnaie clôturé.',
  })
  create(
    @Param('walletId') walletId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(walletId, userId, dto);
  }

  @Delete(':id')
  @UseGuards(ExpenseOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une dépense' })
  @ApiNoContentResponse({ description: 'Dépense supprimée.' })
  @ApiErrors({
    403: 'Accès refusé.',
    404: 'Dépense ou porte-monnaie introuvable.',
    409: 'Ce porte-monnaie est clôturé.',
  })
  async remove(
    @Param('walletId') walletId: string,
    @Param('id') id: string,
  ) {
    await this.expensesService.remove(walletId, id);
  }
}
