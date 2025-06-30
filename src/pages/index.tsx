import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { FaPersonBooth } from "react-icons/fa"

type Video = {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  notes: string;
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        const sorted = Array.isArray(data)
          ? [...data].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          : [];

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
        ].sort();

        setVideos(sorted);
        setMonths(uniqueMonths);
        setSelectedMonth(uniqueMonths[0] || null);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setVideos([]);
      });
  }, []);

  function convertGoogleDriveUrlToEmbed(url: string) {
    const match = url.match(/\/file\/d\/([^/]+)\//);
    const id = match?.[1];
    return id ? `https://drive.google.com/file/d/${id}/preview` : url;
  }

  return (
    <>
      <Navbar />

      <main className="bg-neutral-900 text-neutral-100 min-h-screen pt-24 px-6 font-montserrat transition-colors duration-500">
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
            const [year, monthNum] = month.split("-");
            const label = new Date(`${month}-01`).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            });

            const isActive = month === selectedMonth;
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-3 py-1 rounded-full text-sm transition
                  ${isActive
                    ? "bg-amber-400 text-neutral-900 font-semibold"
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Affichage des vidéos */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos
            .filter((video) => {
              if (!selectedMonth) return true;
              const d = new Date(video.date);
              const videoMonth = `${d.getFullYear()}-${String(
                d.getMonth() + 1
              ).padStart(2, "0")}`;
              return videoMonth === selectedMonth;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // pour mettre dans l'ordre croissant
            .map((video) => (
              <div
                key={video.id}
                className="bg-neutral-800 text-neutral-100 shadow-md rounded-xl p-5 space-y-4 transform transition-transform hover:scale-[1.015] hover:shadow-amber-600/40 duration-300"
              >
                <h2 className="text-xl font-semibold text-amber-300">
                  {video.title}
                </h2>
                <p className="text-sm text-neutral-400">
                  {video.date
                    ? new Date(video.date).toLocaleDateString()
                    : "Pas de date"}
                </p>

                <div className="aspect-video rounded-lg overflow-hidden shadow-inner">
                  <iframe
                    src={convertGoogleDriveUrlToEmbed(video.videoUrl)}
                    title={video.title}
                    className="w-full h-full rounded-md"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                <p className="text-sm text-neutral-300">{video.notes}</p>
              </div>
            ))}
        </div>

        {videos.length === 0 && (
          <p className="text-center text-neutral-400 mt-10">
            Aucune vidéo disponible.
          </p>
        )}
      </main>
    </>
  );
}
