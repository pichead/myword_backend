import { PartialType } from '@nestjs/swagger';
import { CreateUserWordDto } from './create-user-word.dto';

export class UpdateUserWordDto extends PartialType(CreateUserWordDto) {}
