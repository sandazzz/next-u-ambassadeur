import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);

  if (session) {
    return (
      <div className="divide-y divide-muted w-full flex flex-col justify-center items-center">
        {<pre>{JSON.stringify(session, null, 2)}</pre>}
      </div>
    );
  }
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Titre principal */}
      <h1 className=" text-2xl font-bold text-center text-primary leading-snug">
        Next-U Ambassadeur
      </h1>

      {/* Section Charte de l'Ambassadeur */}
      <section className="bg-background p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold text-primary mb-4">
          La charte de l&apos;ambassadeur
        </h2>
        <div className="space-y-4 text-primary leading-relaxed text-sm">
          <p>
            Être ambassadeur de son école est un rôle engageant et sérieux.
            L&apos;étudiant(e) représente son établissement lors
            d&apos;événements comme les salons, portes ouvertes et concours.
            Il/elle partage son expérience avec de futurs étudiants.
          </p>
          <p>
            Chaque mois, une activité conviviale (patinoire, laser game,
            bowling...) est organisée pour remercier les ambassadeurs.
          </p>
          <p>
            L&apos;ambassadeur doit aussi respecter des obligations, comme
            prévenir en avance en cas d&apos;absence ou de retard, pour
            permettre une meilleure organisation des événements.
          </p>
          <p>
            Les inscriptions se font via les formulaires disponibles sur la
            plateforme. Pour toute demande, merci de contacter
            l&apos;administration.
          </p>
        </div>
      </section>
    </div>
  );
}
