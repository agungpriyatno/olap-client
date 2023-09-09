import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiString } from 'src/app/shared/utilities/api-string';
import { QueryData } from '../model/query';

@Injectable({
  providedIn: 'root'
})
export class OlapService {
  private http = inject(HttpClient)

  query(target: string | null, query?: QueryData): Observable<any[]> {
    let url: string
    if (target != null) {
      url = apiString(["query", target])
    } else {
      url = apiString("query")
    }
    return this.http.get<any[]>(url, { params: this.generateParams(query) })
  }


  private generateParams(query?: QueryData): HttpParams | undefined  {

    if (query == undefined) {
      return undefined
    }
    
    const params = new HttpParams()
      .set("point", query?.point ?? "")
      .append("dimension", query?.dimension ?? "")
      .append("pulau", query?.pulau ?? "")
      .append("provinsi", query?.provinsi ?? "")
      .append("kota", query?.kota ?? "")
      .append("kecamatan", query?.kecamatan ?? "")
      .append("tahun", query?.tahun ?? "")
      .append("semester", query?.semester ?? "")
      .append("kuartal", query?.quartal ?? "")
      .append("bulan", query?.bulan ?? "")
      .append("hari", query?.hari ?? "")
      .append("confidence", query?.confidence ?? "")
      .append("satelite", query?.satelite ?? "")

    return params
  }
}
