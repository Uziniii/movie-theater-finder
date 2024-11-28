import type { DB } from "./db";

export function seed(db: DB) {
  try {
    const insert = db.prepare("INSERT INTO cinemas (name, url) VALUES ($name, $url)")
    const insertMany = db.transaction((cinemas) => {
      for (const cinema of cinemas) insert.run(cinema);
    });

    insertMany([
      {
        $name: "Écoles Cinéma Club",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0071.html"
      }, {
        $name: "MK2 Bibliothèque",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C2954.html",
      }, {
        $name: "MK2 Beaubourg",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0050.html"
      }, {
        $name: "Épée de bois",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=W7504.html"
      }, {
        $name: "Cinéma du Panthéon",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0076.html"
      }, {
        $name: "Max Linder Panorama",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0089.html"
      }, {
        $name: "Luminor Hotel de Ville",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0013.html"
      }, {
        $name: "Le Grand Action",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0072.html"
      }, {
        $name: "MK2 Parnasse",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0099.html"
      }, {
        $name: "Le Champo",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0073.html"
      }, {
        $name: "Filmothèque du Quartier Latin",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0020.html"
      }, {
        $name: "Reflet Medicis",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0074.html"
      }, {
        $name: "UGC Ciné Cité Les Halles",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0159.html"
      }, {
        $name: "UGC Ciné Cité Bercy",
        $url: "https://www.allocine.fr/seance/salle_gen_csalle=C0026.html"
      }
    ])
  } catch (e) {
    console.log(e)
  }
}