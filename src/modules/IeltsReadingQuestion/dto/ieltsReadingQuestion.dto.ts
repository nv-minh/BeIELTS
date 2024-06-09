import { ApiProperty } from "@nestjs/swagger";

export class CreateIeltsReadingQuestionDto {

    @ApiProperty({
        type: Number,
        example: 1
    })
    testId: number
    
    @ApiProperty({
        type: Number,
        example: 1
    })
    passageId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    from: number

    @ApiProperty({
        type: Number,
        example: 5
    })
    to: number

    @ApiProperty({
        type: String,
        example: 'YES_NO_NOT_GIVEN'
    })
    type: string
    
    @ApiProperty({
        type: String,
        example: '[]'
    })
    answers: string
    
    // Type: YES_NO_NOT_GIVEN
    @ApiProperty({
        type: String,
        example: '["The appearance of the platypus caused experts to doubt it was real.","The amount of venom in a male platypus changes during the year.","Most platypus live in Eastern Australia.","Snake venom and platypus venom are very similar.","Because their environment is specialised, platypus cannot be kept as pets."]'
    })
    listOfQuestions: string

    // Type: SUMMARY_NOTE_COMPLETION
    @ApiProperty({
        type: String,
        example: "NO MORE THAN THREE WORDS"
    })
    require: string

    @ApiProperty({
        type: String,
        example: "Male and Female Platypus"
    })
    title: string

    @ApiProperty({
        type: String,
        example: '["Platypus are unique Australian animals. Although all platypus   share many similarities, the male and female are somewhat different from each other. For example, on the hind feet, the male has a","while the young female has",". In the","the mother keeps her eggs warm and, once born, supplies her"]'
    })
    summary: string


    @ApiProperty({
        type: String,
        example: ". On the other hand, the male platypus does not help raise the young at all."
    })
    remaining: string
    
    //Type: SENTENCE_COMPLETION
    // require
    @ApiProperty({
        type: String,
        example: '[{"content": "Even though the platypus is not endangered, it is considered","remaining": "."},{"content": "Platypus numbers in", "remaining": "areas have declined in many catchments."},{"content": "Even though the platypus is not endangered it is considered","remaining": "."},{"content": "Platypus captivity for research and study purposes requires a","remaining": "."}]'
    })
    listOfSentences: string

    // Type: MATCHING_HEADINGS
    @ApiProperty({
        type: String,   
        example: '["Research into short periods of sleep","Famous people, short sleepers","Measuring sleep movement","Sleep experiments over the past century","Monitoring the effects of sleep deprivation","Antarctic and Arctic sleep means quality sleep","Challenging research in reduced normal sleeping hours","Are we getting enough sleep?","The impact of noise on sleep","Sleep experiments in an isolated area"]'
    })
    listOfHeadings: string

    @ApiProperty({
        type: String,
        example: '["Paragraph B","Paragraph C","Paragraph D","Paragraph E","Paragraph F"]'
    })
    listOfParagraphs: string

    // Type: MATCHING_INFORMATION
    @ApiProperty({
        type: String,
        example: '["David Joske","Stanley Limpton","Tim Oswald","Dr. Peter Suedfeld"]'
    })
    listOfObjects: string

    // listOfStatements: string


    // Type: LIST_SELECTION || MULTIPLE_CHOICE
    @ApiProperty({
        type: String,
        example: "The list below lists some health issues associated with lack of sleep. Which TWO of these health issues are mentioned by the writer?"
    })
    question: string

    @ApiProperty({
        type: String,
        example: '["heart problems","nervous disorders","dizziness","depression","problems with mental state","increased blood pressure"]'
    })
    listOfAnswers: string

    // Type: MATCHING_ENDINGS
    @ApiProperty({
        type: String, 
        example: '["is quite popular due to it not being too affected by temperature and location.","is being tried via an evaporation process.","is not energy efficient.","is best for poorer countries.","is made up of both clouds and water vapour.","is increased when temperatures fall rapidly."]'
    })
    listOfEndings: string

    @ApiProperty({
        type: String,
        example: '["Turning salt water into drinking water","Large-scale fresh water production through evaporation","Water available in the atmosphere","The use of dew as a water source","The amount of water collected from dew"]'
    })
    listOfStatements: string

    // Type: TRUE_FALSE_NOT_GIVEN
    // listOfQuestions

}