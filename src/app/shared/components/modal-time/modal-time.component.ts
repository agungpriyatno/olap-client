import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryData } from 'src/app/core/model/query';
import { OlapService } from 'src/app/core/services/olap.service';

export type Time = "tahun" | "semester" | "quartal" | "bulan" | "hari"
export type Type = "pulau" | "provinsi" | "kota" | "kecamatan" | "desa"
export interface TimeData {
  index: number,
  data?: QueryData
  tipe: Type
}

@Component({
  selector: 'app-modal-time',
  templateUrl: './modal-time.component.html',
  styleUrls: ['./modal-time.component.css']
})
export class ModalTimeComponent implements OnInit {
  @Input({ required: true }) query!: QueryData
  @Input({ required: true }) value!: string
  @Input({ required: true }) index!: number
  @Input({ required: true }) tipe!: Type
  @Output() onSelect = new EventEmitter<TimeData>()
  private service: OlapService = inject(OlapService)
  private fb: FormBuilder = inject(FormBuilder)
  private params: QueryData = {}

  ngOnInit(): void {
    this.params = { ...this.query }
    console.log(this.params);

    this.params.dimension = "time"
    if (this.params.tahun != "" && this.params.tahun != undefined) {
      this.tahun?.setValue(this.params.tahun ?? "")
    }

    if (this.params.semester != "" && this.params.semester != undefined) {
      this.semester?.setValue(this.params.semester ?? "")
    }

    if (this.params.quartal != "" && this.params.quartal != undefined) {
      this.quartal?.setValue(this.params.quartal ?? "")
    }

    if (this.params.bulan != "" && this.params.bulan != undefined) {
      this.bulan?.setValue(this.params.bulan ?? "")
    }

    if (this.params.hari != "" && this.params.hari != undefined) {
      this.hari?.setValue(this.params.hari ?? "")
    }
    // console.log(this.query);
  }

  selectTahun = false
  selectSemester = false
  selectQuartal = false
  selectBulan = false
  selectHari = false

  dataTahun: any[] = []
  dataSemester: any[] = []
  dataQuartal: any[] = []
  dataBulan: any[] = []
  dataHari: any[] = []

  //FROM GRUOP

  form = this.fb.group({
    tahun: [""],
    semester: [""],
    quartal: [""],
    bulan: [""],
    hari: [""],
  })

  // FORM

  get tahun() {
    return this.form.get("tahun")
  }

  get semester() {
    return this.form.get("semester")
  }

  get quartal() {
    return this.form.get("quartal")
  }

  get bulan() {
    return this.form.get("bulan")
  }

  get hari() {
    return this.form.get("hari")
  }

  // BATAL
  back() {
    this.onSelect.emit({
      index: this.index,
      data: undefined,
      tipe: this.tipe
    })
  }


// GET DATA WAKTU
  getData(type: Time) {
    let data = { ...this.params }
    console.log(data);


    switch (type) {
      case "tahun":
        data.tahun = ""
        data.point = this.value
        break;
      case "semester":
        data.point = this.value
        data.semester = ""
        data.tahun = this.tahun?.value ?? ""
        break;
      case "quartal":
        data.quartal = ""
        data.point = this.value
        data.tahun = this.tahun?.value ?? ""
        data.semester = this.semester?.value ?? ""
        break;
      case "hari":
        data.hari = ""
        data.point = this.value
        data.bulan = this.bulan?.value ?? ""
        data.tahun = this.tahun?.value ?? ""
        data.semester = this.semester?.value ?? ""
        data.quartal = this.quartal?.value ?? ""
        break;
      case "bulan":
        data.bulan = ""
        data.point = this.value
        data.tahun = this.tahun?.value ?? ""
        data.semester = this.semester?.value ?? ""
        data.quartal = this.quartal?.value ?? ""
        break;
    }

    switch (this.tipe) {
      case "pulau":
        data.pulau = ""
        break;
      case "provinsi":
        data.provinsi = ""
        break;
      case "kota":
        data.kota = ""
        break;
      case "kecamatan":
        data.kecamatan = ""
        break;
    }

    this.service.query("location", data).subscribe({
      next: (res) => {
        console.log(data);

        switch (type) {
          case "tahun":
            this.dataTahun = res
            break;
          case "semester":
            this.dataSemester = res
            break;
          case "quartal":
            this.dataQuartal = res
            break;
          case "bulan":
            this.dataBulan = res
            break;
          case "hari":
            this.dataHari = res
            break;
        }
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  // SAAT MEMILIH WAKTU
  // PROSES PENGISIAN FORM

  onSelectData(type: Time, data: string | number): void {
    switch (type) {
      case "tahun":
        this.tahun?.setValue(data.toString())
        this.semester?.setValue("")
        this.quartal?.setValue("")
        this.bulan?.setValue("")
        this.hari?.setValue("")
        this.selectTahun = false
        break;
      case "semester":
        this.semester?.setValue(data.toString())
        this.quartal?.setValue("")
        this.bulan?.setValue("")
        this.hari?.setValue("")
        this.selectSemester = false
        break;
      case "quartal":
        this.quartal?.setValue(data.toString())
        this.bulan?.setValue("")
        this.hari?.setValue("")
        this.selectQuartal = false
        break;
      case "bulan":
        this.bulan?.setValue(data.toString())
        this.hari?.setValue("")
        this.selectBulan = false
        break;
      case "hari":
        this.hari?.setValue(data.toString())
        this.selectHari = false
        break;
    }
  }

  onSubmit() {
    this.query.tahun = this.tahun?.value ?? ""
    this.query.semester = this.semester?.value ?? ""
    this.query.quartal = this.quartal?.value ?? ""
    this.query.bulan = this.bulan?.value ?? ""
    this.query.hari = this.hari?.value ?? ""

    console.log(this.query);
    
    this.onSelect.emit({
      data: this.query,
      index: this.index,
      tipe: this.tipe,
    })
  }

}
