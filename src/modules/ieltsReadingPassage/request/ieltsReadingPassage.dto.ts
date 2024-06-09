import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class IeltsReadingPassageDto{
    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    testId: number

    @ApiProperty({
        type: Number,
        example: 1
    })
    @IsNumber()
    passageNumber: number 

    @ApiProperty({
        type: String,
        example: "AUSTRALIA’S PLATYPUS"
    })
    @IsString()
    title: string 

    @ApiProperty({
        type: String,
        example: '["Of all the creatures on the earth, the Australian platypus, Omithorbynchusparadoxus, is perhaps one of the most mysterious and reclusive. Derived from the Latin platys meaning ‘flat and broad’ and pous meaning ‘foot’, the platypus has long been an iconic symbol of Australia. Upon being discovered in Australia in the 1700s, sketches of this unusual creature were made and sent back to England whereupon they were considered by experts to be a hoax. Indeed, the incredible collection of its body parts – broad, flat tail, rubbery snout, webbed feet and short dense fur – make it one of the world’s most unusual animals.","Officially classified as a mammal, the egg-laying platypus is mostly active during the night, a nocturnal animal. As if this combination of characteristics and behaviours were not unusual enough, the platypus is the only Australian mammal known to be venomous. The male platypus has a sharply pointed, moveable spur on its hind foot which delivers a poison capable of killing smaller animals and causing severe pain to humans. The spur – about 2 centimetres in length – is quite similar to the fang of a snake and, if provoked, is used as a means of defence. Those who have been stung by a platypus’ spur report an immediate swelling around the wound followed by increased swelling throughout the affected limb. Excruciating, almost paralysing pain in the affected area accompanies the sting which, in some victims has been known to last for a period of months. One report from a victim who was stung in the palm of the hand states that “…the spur could not be pulled out of the hand until the platypus was killed.” During the breeding season, the amount of venom in the male platypus increases. This has led some zoologists to theorise that the poisonous spur is primarily for asserting dominance amongst fellow-males. To be stung by a male platypus is a rare event with only a very small number of people being on the receiving end of this most reclusive creature.","In the same area of the hind foot where the male has the poisonous spur, the female platypus only develops two buds which drop off in their first year of life never to appear again. The female platypus produces a clutch of one to three eggs in late winter or spring, incubating them in an underground burrow. The eggs are 15-18 millimetres long and have a whitish, papery shell like those of lizards and snakes. The mother is believed to keep the eggs warm by placing them between her lower belly and curled-up tail for a period of about 10 or 11 days as she rests in an underground nest made of leaves or other vegetation collected from the water. The baby platypus drinks a rich milk which is secreted from two round patches of skin midway along the mother’s bell)’. It is believed that a baby platypus feeds by slurping up milk with rhythmic sweeps of its stubby bill. When the juveniles first enter the water at the age of about four months, they are nearly (80-90%) as long as an adult. Male platypus do not help to raise the young.","In Australia, the platypus is officially classified as ‘Common but Vulnerable’. As a species, it is not currently considered to be endangered. However, platypus populations are believed to have declined or disappeared in many catchments 1, particularly in urban and agricultural landscapes. In most cases, the specific underlying reasons for the reduction in numbers remain unknown. Platypus surveys have only been carried out in a few catchments in eastern Australia. It is therefore impossible to provide an accurate estimate of the total number of platypus remaining in the wild. Based on recent studies, the average platypus population density along relatively good quality streams in the foothills of Victoria’s Great Dividing Range is only around one to two animals per kilometre of channel. Because platypus are predators near the top of the food chain and require large amounts of food to survive (up to about 30% of a given animal’s body weight each day), it is believed that their numbers are most often limited by the availability of food, mainly in the form of bottom-dwelling aquatic invertebrates such as shrimps, worms, yabbies, pea-shell mussels, and immature and adult aquatic insects. Small frogs and fish eggs are also eaten occasionally, along with some terrestrial insects that fall into the water from overhanging vegetation.","1: Catchments are an area of land drained by a creek or river system, or a place set aside for collecting water which runs off the surface of the land.","Until the early twentieth century, platypus were widely killed for (heir fur. The species is now protected by law throughout Australia. Platypus are wild animals with specialised living requirements. It is illegal for members of the public to keep them in captivity. A platypus which has been accidentally captured along a stream or found wandering in an unusual place should never be taken home and treated as a pet, even for a brief time. The animal will not survive the experience. Only a small number of Australian zoos and universities hold a permit to maintain platypus in captivity for legitimate display or research purposes. Current Australian government policy does not allow’ this species to be taken overseas for any reason."]'
    })
    @IsString() 
    paragraphs: string
}

export class UpdateIeltsReadingPassageDto extends IeltsReadingPassageDto{
    @ApiProperty({
        type: Number,
        example:1
    })
    @IsNotEmpty()
    id: number

}