import { ApiProperty } from "@nestjs/swagger";

export class ResultDto {
    @ApiProperty({
        type: Array,
        example: []
    })
    results: Array<{}>
}