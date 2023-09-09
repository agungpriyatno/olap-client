import { Component, OnInit, inject } from '@angular/core';
import { QueryData } from './core/model/query';
import { OlapService } from './core/services/olap.service';
import { Type } from './shared/components/modal-time/modal-time.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private service = inject(OlapService)
  headers: string[] = []
  data: Data[] = []

  dataConfidence: any[] = []
  dataSatelite: any[] = []

  ngOnInit(): void {
    this.getDataLocation("location")
  }

  getChild(indexes: number[], query: QueryData, tipe: Type) {
    console.log(query);

    this.service.query("location", query).subscribe({
      next: (res) => {
        let hasil: Data[] = []
        res.forEach((d) => {
          let param = { ...query }

          switch (tipe) {
            case "provinsi":
              param.provinsi = d[0]
              break;
            case "kota":
              param.kota = d[0]
              break;
            case "kecamatan":
              param.kecamatan = d[0]
              break;
            case "desa":
              param.desa = d[0]
              break;
          }

          hasil.push({
            data: d[0],
            total: d[1],
            modal: false,
            query: param,
            child: []
          })
          console.log(param);
          console.log(hasil);


        })
        switch (indexes.length) {
          case 1:
            this.data[indexes[0]].child = hasil
            break;
          case 2:
            this.data[indexes[0]].child[indexes[1]].child = hasil
            break;
          case 3:
            this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child = hasil
            break;
          case 4:
            this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child = hasil
            break;
          case 5:
            this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child[indexes[4]].child = hasil
            break;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getSatelite(query: QueryData, tipe: Type) {
    var q = { ...query }
    q.dimension = "satelite"
    switch (tipe) {
      case "pulau":
        q.pulau = ""
        q.point = query.pulau
        break;
      case "provinsi":
        q.provinsi = ""
        q.point = query.provinsi
        break;
      case "kota":
        q.kota = ""
        q.point = query.kota
        break;
      case "kecamatan":
        q.kecamatan = ""
        q.point = query.kecamatan
        break;
      case "desa":
        q.point = query.desa
        break;
    }
    q.satelite = ""
    this.service.query("location", q).subscribe({
      next: (res) => {
        this.dataSatelite = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getConfidence(query: QueryData, tipe: Type) {
    var q = { ...query }
    q.dimension = "confidence"
    switch (tipe) {
      case "pulau":
        q.pulau = ""
        q.point = query.pulau
        break;
      case "provinsi":
        q.provinsi = ""
        q.point = query.provinsi
        break;
      case "kota":
        q.kota = ""
        q.point = query.kota
        break;
      case "kecamatan":
        q.kecamatan = ""
        q.point = query.kecamatan
        break;
      case "desa":
        q.point = query.desa
        break;
    }
    q.confidence = ""
    // console.log(q);

    this.service.query("location", q).subscribe({
      next: (res) => {
        this.dataConfidence = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getData(indexes: number[], query?: QueryData, select?: string, queue?: QueryData, tipe?: Type) {
    if (query != undefined) {
      console.log(query);
      this.service.query("location", query).subscribe({
        next: (res) => {
          res.forEach((d) => {
            // console.log(d);


            if (d[0].toString() === select) {
              // query.pulau = d[0],
              //   this.data[index] = {
              //     data: d[0],
              //     total: d[1],
              //     modal: false,
              //     query: query,
              //     child: []
              //   }

              let param = { ...query }
              switch (tipe) {
                case "pulau":
                  param.pulau = queue?.pulau
                  break;
                case "provinsi":
                  param.pulau = queue?.pulau
                  param.provinsi = queue?.provinsi
                  break;
                case "kota":
                  param.pulau = queue?.pulau
                  param.provinsi = queue?.provinsi
                  param.kota = queue?.kota
                  break;
                case "kecamatan":
                  param.pulau = queue?.pulau
                  param.provinsi = queue?.provinsi
                  param.kota = queue?.kota
                  param.kecamatan = queue?.kecamatan
                  break;
                default:
                  param.pulau = queue?.pulau
                  param.provinsi = queue?.provinsi
                  param.kota = queue?.kota
                  param.kecamatan = queue?.kecamatan
                  break;
              }
              // console.log(param);

              let hasil: Data = {
                data: d[0],
                total: d[1],
                modal: false,
                query: param,
                child: []
              }
              switch (indexes.length) {
                case 1:
                  this.data[indexes[0]] = hasil
                  break;
                case 2:
                  this.data[indexes[0]].child[indexes[1]] = hasil
                  break;
                case 3:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]] = hasil
                  break;
                case 4:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]] = hasil
                  break;
                case 5:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child[indexes[4]] = hasil
                  break;
              }
            }

          })
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      switch (indexes.length) {
        case 1:
          this.data[indexes[0]].modal = false
          break;
        case 2:
          this.data[indexes[0]].child[indexes[1]].modal = false
          break;
        case 3:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].modal = false
          break;
        case 4:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].modal = false
          break;
        case 5:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child[indexes[4]].modal = false
          break;
      }
    }
  }

  onSatelite(indexes: number[], query: QueryData, event: any, tipe: Type) {
    let param = { ...query }
    param.satelite = event.value;
    switch (tipe) {
      case "pulau":
        param.pulau = ""
        break;
      case "provinsi":
        param.provinsi = ""
        break;
      case "kota":
        param.kota = ""
        break;
      case "kecamatan":
        param.kecamatan = ""
        break;
    }
    this.getData(indexes, param, query[tipe!], query, tipe)
    this.dataSatelite = []
  }

  onConfidence(indexes: number[], query: QueryData, event: any, tipe: Type) {
    // console.log(query);

    let param = { ...query }
    param.confidence = event.value;
    switch (tipe) {
      case "pulau":
        param.pulau = ""
        break;
      case "provinsi":
        param.provinsi = ""
        break;
      case "kota":
        param.kota = ""
        break;
      case "kecamatan":
        param.kecamatan = ""
        break;
    }
    this.getData(indexes, param, query[tipe!], query, tipe)
    this.dataConfidence = []
  }

  onFilter(indexes: number[], query?: QueryData, tipe?: Type) {
    let param = { ...query }
    if (query != undefined) {
      switch (tipe) {
        case "pulau":
          param.pulau = ""
          break;
        case "provinsi":
          param.provinsi = ""
          break;
        case "kota":
          param.kota = ""
          break;
        case "kecamatan":
          param.kecamatan = ""
          break;
        case "desa":
          param.desa = ""
          break;
      }
      console.log(query);

      this.service.query("location", param).subscribe({
        next: (res) => {
          res.forEach((d) => {
            if (d[0].toString() === query[tipe!]?.toString()) {
              let param = { ...query }
              let hasil: Data = {
                data: d[0],
                total: d[1],
                modal: false,
                query: param,
                child: []
              }
              switch (indexes.length) {
                case 1:
                  this.data[indexes[0]] = hasil
                  break;
                case 2:
                  this.data[indexes[0]].child[indexes[1]] = hasil
                  break;
                case 3:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]] = hasil
                  break;
                case 4:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]] = hasil
                  break;
                case 5:
                  this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child[indexes[4]] = hasil
                  break;
              }
            }
          })
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      switch (indexes.length) {
        case 1:
          this.data[indexes[0]].modal = false
          break;
        case 2:
          this.data[indexes[0]].child[indexes[1]].modal = false
          break;
        case 3:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].modal = false
          break;
        case 4:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].modal = false
          break;
        case 5:
          this.data[indexes[0]].child[indexes[1]].child[indexes[2]].child[indexes[3]].child[indexes[4]].modal = false
          break;
      }
    }
  }

  getDataLocation(target: string) {
    this.service.query(target).subscribe({
      next: (res) => {
        res.forEach((d) => {
          this.data.push({
            data: d[0],
            total: d[1],
            modal: false,
            query: {
              pulau: d[0]
            },
            child: []
          })
        })

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}

interface Data {
  data: string | number
  query: QueryData
  modal: boolean
  total: number
  child: Data[]
}

