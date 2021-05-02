export default class SearchOptionUnit {
  constructor(
    public readonly name: string,
    public readonly min: number,
    public readonly max: number,
    public readonly range: number[]
  ) {}
}
