import { Module } from "@nestjs/common"
import { BbsegGuardachuvaController } from "./bbseg-guardachuva.controller"
import { GoogleModule } from "../google/google.module"

@Module({
  imports: [GoogleModule],
  controllers: [BbsegGuardachuvaController],
})
export class BbsegGuardachuvaModule {}


