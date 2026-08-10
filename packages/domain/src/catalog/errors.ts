export class CatalogPolicyViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogPolicyViolation";
  }
}
