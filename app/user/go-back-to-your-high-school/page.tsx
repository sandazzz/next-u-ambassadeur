export default async function GoBackToYourHighSchool() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6">
      {/* Conteneur principal */}
      <div className="max-w-3xl w-full bg-backgound shadow-md rounded-lg p-8 space-y-6 border">
        {/* Titre principal */}
        <h1 className="text-3xl font-extrabold text-center text-primary">
          🎓 Retourne dans ton lycée !
        </h1>

        {/* Introduction */}
        <p className="text-primary">
          Chers Ambassadeurs, pour vous rappeler le principe, vous serez en
          charge de contacter votre ancien établissement et de vous y rendre
          dans le but de :
        </p>

        {/* Liste des missions */}
        <ul className="space-y-3 text-primary text-sm">
          <li className="flex items-center">✅ Présenter ton école</li>
          <li className="flex items-center">
            ✅ Conseiller de futurs étudiants
          </li>
          <li className="flex items-center">✅ Distribuer des brochures</li>
          <li className="flex items-center">
            ✅ Prendre les coordonnées des étudiants (coupons)
          </li>
          <li className="flex items-center">
            ✅ Faire un retour à l'administration
          </li>
        </ul>

        {/* Explication des avantages */}
        <p className="text-primary">
          Cette démarche doit être **autonome**, mais un membre de l'équipe peut
          t'accompagner si besoin. **Bonne nouvelle** : Une fois cette action
          réalisée, tu gagneras **1 crédit** ! 🎉
        </p>

        <p className="text-primary">
          Pour les établissements nécessitant un long déplacement, les **frais
          de transport** sont pris en charge par l’école. 🚌
        </p>

        {/* Call-to-action */}
        <div className="text-center">
          <a
            href="#"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            🚀 CLIQUE ICI POUR LE QUESTIONNAIRE
          </a>
        </div>

        {/* Carte avec le mail type */}
        <div className="bg-gray-100 p-5 rounded-lg border border-gray-300">
          <h2 className="text-lg font-semibold text-primary mb-3">
            📩 Modèle de mail à envoyer :
          </h2>
          <pre className="bg-white p-4 rounded-md text-gray-700 text-sm whitespace-pre-wrap border border-gray-300">
            {`Bonjour,

Je suis (Prénom - Nom), anciennement élève en classe de (Nom de la classe) au sein de votre établissement. 

Actuellement étudiant(e) en (Année + nom de la filière) au sein de l'école (Nom de l'école), je serais ravi(e) d'intervenir au sein du lycée pour partager mon expérience et présenter la formation que j'ai choisie.

En effet, la terminale est une année charnière pour les futurs bacheliers. Étant moi-même passé(e) par là, je serais heureux(se) de les accompagner dans le choix de leur formation.

Si vous organisez des forums de l'orientation, je me rendrai disponible pour représenter les métiers du digital.

Restant à votre disposition pour toutes questions,
Cordialement,
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
