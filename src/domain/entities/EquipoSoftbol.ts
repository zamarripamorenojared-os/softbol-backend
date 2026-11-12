export class EquipoSoftbol {
  constructor(
    public readonly id: string,
    public nombre: string,
    public torneoId: string,
    public abreviatura?: string,
    public categoriaId?: string,
    public logoUrl?: string
  ) {}
}
