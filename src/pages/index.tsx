import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";


type Video = {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  notes: string;
};

export default function Home() {
  // État pour stocker les vidéos récupérées depuis l'API
  const [videos, setVideos] = useState<Video[]>([]);
  // État pour stocker la liste des mois des vidéos
  const [months, setMonths] = useState<string[]>([]);
  // État pour savoir quel mois est actuellement sélectionné
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // useEffect exécuté une seule fois au chargement du composant 
  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {

        // On trie les vidéos par ordre croissant (les plus récentes en premier)
        const sorted = Array.isArray(data)
          ? [...data].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          : [];
        
        // On extrait tous les mois uniques des vidéos au format "YYYY-MM"
        const uniqueMonths = [
          ...new Set(
            sorted.map((video) => {
              const d = new Date(video.date);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                2,
                "0"
              )}`;
            })
          ),
        ]

        // On met à jour les états avec les résultats
        setVideos(sorted);
        setMonths(uniqueMonths);
        setSelectedMonth(uniqueMonths[0] || null); // Par défaut, on sélectionne le premier mois
      })
      .catch((err) => {
        // En cas d’erreur dans la requête, on affiche l’erreur et on vide la liste
        console.error("Erreur fetch:", err);
        setVideos([]);
      });
  }, []);

  // Fonction utilitaire qui transforme une URL Google Drive classique en URL intégrable (embed)
    function convertGoogleDriveUrlToEmbed(url: string) {
        // expression régulière (regex) pour essayer d’extraire l’ID du fichier dans l’URL.

        // Exemple :

        // Entrée : https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing

        // ID extrait : 1A2B3C4D5E6F7G8H9I0J
        const match = url.match(/\/file\/d\/([^/]+)\//);

        // si l'URL a bien matché le regex , on récupère la première capture (l'ID)
        const id = match?.[1];
        return id ? `https://drive.google.com/file/d/${id}/preview` : url;
    }

  return (
    <>

      {/* Barre de navigation persistante en haut */}

      <Navbar />

      {/* Contenu principal de la page */}

      <main className="bg-neutral-900 text-neutral-100 min-h-screen pt-24 px-6 font-montserrat transition-colors duration-500">

        {/* Titre principal et sous-titre */}

        <div className="text-center mb-10">
          <h1 className="inline-block px-6 py-2 border border-amber-400 rounded-xl text-amber-400 text-4xl font-playfair font-bold drop-shadow-md">
            Lindy Videos
          </h1>
          <p className="text-sm text-neutral-400 mt-2 italic tracking-wider">
            Dancing is a conversation — here's what was said
          </p>
        </div>


        {/* Filtres par mois */}

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {months.map((month) => {

           
            // Label lisible (ex : "March 2025")
            const label = new Date(`${month}-01`).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            });

            // Vérifie si ce bouton est celui du mois actuellement sélectionné
            const isActive = month === selectedMonth;
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)} // Changement de filtre au clic
                className={`px-3 py-1 rounded-full text-sm transition
                  ${isActive
                    ? "bg-amber-400 text-neutral-900 font-semibold" // Actif = bouton doré
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600" // Inactif == bouton gris
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

         {/* === Grille des vidéos === */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos
          // Filtrage des vidéos en fonction du mois sélectionné
            .filter((video) => {
              if (!selectedMonth) return true; // Si aucun mois sélectionné, on affiche tout
              const d = new Date(video.date);
              const videoMonth = `${d.getFullYear()}-${String(
                d.getMonth() + 1
              ).padStart(2, "0")}`;
              return videoMonth === selectedMonth;
            })
            // Affichage de chaque vidéo filtrée
            .map((video) => (
              <div
                key={video.id}
                className="bg-neutral-800 text-neutral-100 shadow-lg rounded-2xl p-6 space-y-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-amber-500/40"
              >
                {/* Titre + date */}
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-playfair font-bold text-amber-300 tracking-wide">
                    {video.title}
                  </h2>
                  <p className="text-xs text-neutral-400 italic">
                    {video.date
                      ? new Date(video.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : "No date"}
                  </p>
                </div>
                
                {/* Lecteur vidéo embarqué depuis Google Drive */}
                <div className="aspect-video rounded-xl overflow-hidden shadow-inner border border-neutral-700">
                  <iframe
                    src={convertGoogleDriveUrlToEmbed(video.videoUrl)}
                    title={video.title}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                
                {/* Notes/commentaires liés à la vidéo */}
                <p className="text-center text-sm text-neutral-400 font-serif leading-relaxed">
                  {video.notes}
                </p>
              </div>
            ))}
        </div>

         {/* Message si aucune vidéo à afficher */}
        {videos.length === 0 && (
          <p className="text-center text-neutral-400 mt-10">
            No video available.
          </p>
        )}
      </main>
    </>
  );
}
