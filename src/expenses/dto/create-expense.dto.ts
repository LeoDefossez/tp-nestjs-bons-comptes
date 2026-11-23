import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { MAX_AMOUNT_CENTS } from '../../common/amounts.js';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ maxLength: 100, example: 'Billets de train' })
  title: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    type: 'integer',
    description: 'Montant en centimes (4599 = 45,99 €).',
    minimum: 1,
    maximum: MAX_AMOUNT_CENTS,
    example: 4599,
  })
  amount: number;

  @IsISO8601({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @ApiProperty({
    description: 'Date de la dépense (AAAA-MM-JJ).',
    format: 'date',
    example: '2026-10-25',
  })
  date: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description:
      'Dépenseur (membre du porte-monnaie). Par défaut : l’utilisateur connecté.',
    format: 'uuid',
  })
  paidById?: string;
}
