export interface QueryData {
    limit?: number,
    offset?: number,
    point?: string,
    dimension?: string,
    pulau?: string,
    provinsi?: string,
    kota?: string,
    kecamatan?: string,
    desa?: string,
    tahun?: string,
    semester?: string,
    quartal?: string,
    bulan?: string,
    hari?: string,
    confidence?: string,
    satelite?: string,
}

export interface IChart {
    labels: string[]
    values: number[]
}

