import { Component, inject } from '@angular/core';
import { IChart, QueryData } from '../core/model/query';
import { OlapService } from '../core/services/olap.service';
import { Type } from '../shared/components/modal-time/modal-time.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';


@Component({
  selector: 'app-olap',
  templateUrl: './olap.component.html',
  styleUrls: ['./olap.component.css']
})
export class OlapComponent {
// INJECT SERVICE
private service = inject(OlapService)

loading: boolean = false
offset: number = 0
limit: number = 10
data: Data[] = []

// NAMPUNG DATA CONFIDENCE SEMENTARA
dataConfidence: any[] = []

// NAMPUNG DATA SATELITE SEMENTARA
dataSatelite: any[] = []


loadMore() {
  this.offset += this.limit
  this.getDataLocation("location")
}

//INSIAL

ngOnInit(): void {
  // this.loading = true
  this.getDataLocation("location")
}

//DRILL DOWN

getChild(indexes: number[], query: QueryData, tipe: Type) {
  console.log(query);

  this.service.query("location", query).subscribe({
    next: (res) => {
      var chart: IChart = {
        labels: [],
        values: [],
      }
      let hasil: Data[] = []
      res.forEach((d) => {
        let param = { ...query }
        chart.labels.push(d[0])
        chart.values.push(d[1])

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
      this.setChart(chart)
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

// GET DATA SATELITE YANG TERSEDIA

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

// GET DATA CONFIDENCE YANG TERSEDIA

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

// SETELAH PILIH SETELITE ATAU CONFIDENCE

getData(indexes: number[], query?: QueryData, select?: string, queue?: QueryData, tipe?: Type) {
  if (query != undefined) {
    console.log(query);
    this.loading = true
    this.service.query("location", query).subscribe({
      next: (res) => {
        var chart: IChart = {
          labels: [],
          values: [],
        }

        res.forEach((d) => {
          // console.log(d);
          
          if (d[0].toString() === select) {
            chart.labels.push(d[0])
            chart.values.push(d[1])

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
        this.loading = false
      this.setChart(chart)

      },
      error: (err) => {
        this.loading = false

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

// PILIH SATELIT

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

// PILIH CONFIDENCE

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

//SUBMIT WAKTU

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
    this.loading = true
    this.service.query("location", param).subscribe({
      next: (res) => {
        var chart: IChart = {
          labels: [],
          values: [],
        }
        res.forEach((d) => {
          chart.labels.push(d[0])
          chart.values.push(d[1])
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
        this.loading = false
        this.setChart(chart)
      },
      error: (err) => {
        this.loading = false
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

//INISIAL

getDataLocation(target: string) {
  this.loading = true
  const params: QueryData = {
    limit: this.limit,
    offset: this.offset,
  }
  this.service.query(target, params).subscribe({
    next: (res) => {
      var chart: IChart = {
        labels: [],
        values: [],
      }
      res.forEach((d) => {
        chart.labels.push(d[0])
        chart.values.push(d[1])
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
      this.loading = false

      this.setChart(chart)

    },
    error: (err) => {
      this.loading = false
      console.log(err);
    }
  })
}

public barChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  // We use these empty structures as placeholders for dynamic theming.
  scales: {
    x: {},
    y: {
      min: 0,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};
public barChartType: ChartType = 'bar';

public barChartData?: ChartData<'bar'>

setChart(data: IChart) {
  this.barChartData = {
    labels: data.labels,
    datasets: [
      { data: data.values, label: 'Lokasi' },
    ],
  }
}
}

interface Data {
  data: string | number
  query: QueryData
  modal: boolean
  total: number
  child: Data[]
}
