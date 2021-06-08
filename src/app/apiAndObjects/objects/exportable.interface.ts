export interface Exportable {
  getExportObject(): Record<string, unknown>;
  getExportFileName(): string;
}
