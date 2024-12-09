import { AviationUser } from "./AviationUser";

export default interface AviationUserPageable {
    totalSize: number,
    content: AviationUser[]
}