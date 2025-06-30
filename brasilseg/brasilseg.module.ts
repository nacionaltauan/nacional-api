import { Module } from "@nestjs/common"
import { BrasilsegController } from "./brasilseg.controller"
import { GoogleModule } from "../google/google.module"

@Module({
  imports: [GoogleModule],
  controllers: [BrasilsegController],
})
export class BrasilsegModule {}
