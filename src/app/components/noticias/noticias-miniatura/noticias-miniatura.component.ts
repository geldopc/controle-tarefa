import { Component, OnInit, Input } from "@angular/core";
import { Noticia } from "../../../objects/entidades/Noticia";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-noticias-miniatura",
  templateUrl: "./noticias-miniatura.component.html",
  styleUrls: ["./noticias-miniatura.component.css"]
})
export class NoticiasMiniaturaComponent implements OnInit {
  @Input() noticia: Noticia;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // console.log("noticia miniatura" + JSON.stringify(this.noticia));
  }

  lerNoticia(item: Noticia) {
    this.router.navigate(["noticias/leitura"], {
      queryParams: item
    });
  }

  converterData(data: Date) {
    switch (data.getMonth()) {
      case 0: {
        return "JAN";
      }
      case 1: {
        return "FEV";
      }
      case 2: {
        return "MAR";
      }
      case 3: {
        return "ABR";
      }
      case 4: {
        return "MAI";
      }
      case 5: {
        return "JUN";
      }
      case 6: {
        return "JUL";
      }
      case 7: {
        return "AGO";
      }
      case 8: {
        return "SET";
      }
      case 9: {
        return "OUT";
      }
      case 10: {
        return "NOV";
      }
      case 11: {
        return "DEZ";
      }
    }
  }
}
