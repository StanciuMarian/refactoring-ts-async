export class StoreDto {
    id: number;
    name: string;
    storeTypeName: string;

    nameWithType(): string {
        return this.name + " - " + this.storeTypeName;
    }
}
