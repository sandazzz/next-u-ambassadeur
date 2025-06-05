import {
  GraduationCap,
  Info,
  Mail,
  Users,
  Award,
  CheckCircle,
  MapPin,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AmbassadorLanding() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Instagram-style Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-accent px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold">Programme Ambassadeur</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <Tabs defaultValue="charte" className="w-full">
          {/* Stories-style Navigation as TabsList */}
          <div className="bg-background border-b border-accent px-4 py-4">
            <TabsList className="flex gap-4 overflow-x-auto scrollbar-hide bg-transparent p-0 h-auto">
              <TabsTrigger
                value="charte"
                className="flex flex-col items-center gap-2 min-w-0 bg-transparent p-0 border-0 shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Info className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <span className="text-xs font-medium text-purple-600">
                  Charte
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="lycee"
                className="flex flex-col items-center gap-2 min-w-0 bg-transparent p-0 border-0 shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-600">
                  Mission
                </span>
              </TabsTrigger>
              <div className="flex flex-col items-center gap-2 min-w-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Award className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Rewards
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 min-w-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 p-0.5">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Community
                </span>
              </div>
            </TabsList>
          </div>

          <TabsContent value="charte">
            <div className="bg-background border-b border-accent">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">next-u</p>
                    <p className="text-xs text-gray-500">
                      La Charte de l&apos;Ambassadeur
                    </p>
                  </div>
                </div>

                <Card className="border-2 border-accent bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Info className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        La Charte de l&apos;Ambassadeur
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm text-gray-700">
                      <p>
                        Être ambassadeur de son école est un{" "}
                        <strong>rôle engageant et sérieux</strong>. Tu
                        représentes ton établissement lors d&apos; événements
                        comme les salons, portes ouvertes et concours.
                      </p>

                      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="font-medium text-yellow-800">
                          🎉 Chaque mois, une activité conviviale est organisée
                          pour remercier les ambassadeurs !
                        </p>
                      </div>

                      <p>
                        L&apos;ambassadeur doit respecter ses obligations :
                        prévenir en cas d&apos;absence pour une meilleure
                        organisation des événements.
                      </p>

                      <div className="bg-blue-100 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">
                          📝 Inscriptions via les formulaires sur la plateforme
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6" />
                    <MessageCircle className="h-6 w-6" />
                    <Share className="h-6 w-6" />
                  </div>
                  <Bookmark className="h-6 w-6" />
                </div>
                <p className="font-semibold text-sm mt-3">892 j&apos;aime</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lycee">
            <div className="bg-background border-b border-accent">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">next-u</p>
                    <p className="text-xs text-gray-500">
                      Mission Retour au Lycée
                    </p>
                  </div>
                </div>

                <Card className="border-2 border-accent bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Mission : Retour au Lycée
                      </h3>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">
                      Contacte ton ancien établissement et rends-toi sur place
                      pour :
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        "Présenter ton école",
                        "Conseiller de futurs étudiants",
                        "Distribuer des brochures",
                        "Prendre les coordonnées",
                        "Faire un retour",
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                        Cette démarche doit être <strong>autonome</strong>, mais
                        un membre de l&apos;équipe peut t&apos;accompagner si
                        besoin. <strong>Bonne nouvelle</strong> : Une fois cette
                        action réalisée, tu gagneras <strong>1 crédit</strong>{" "}
                        🎉
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        Pour les établissements nécessitant un long déplacement,
                        les <strong>frais de transport</strong> sont pris en
                        charge par l&apos;école. 🚌
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-xl mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                          <Award className="h-4 w-4" />
                          <span>Récompense : 1 crédit ! 🎉</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>Frais de transport pris en charge 🚌</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl">
                      🚀 Accéder au Questionnaire
                    </Button>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <Card className="border-0 bg-gray-50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Mail className="h-6 w-6 text-blue-500" />
                        <h3 className="text-lg font-bold text-gray-800">
                          Modèle de Mail
                        </h3>
                      </div>

                      <div className="bg-white p-4 rounded-xl border text-xs text-gray-700 leading-relaxed font-mono">
                        <div className="space-y-2">
                          <p>
                            <strong>Objet :</strong> Intervention - Ancien élève
                          </p>
                          <p>
                            <strong>À :</strong> direction@lycee.fr
                          </p>
                          <hr className="my-3" />
                          <div className="space-y-3 text-xs">
                            <p>Bonjour,</p>
                            <p>
                              Je suis (Prénom - Nom), anciennement élève en
                              classe de (Nom de la classe) au sein de votre
                              établissement.
                            </p>
                            <p>
                              Actuellement étudiant(e) en (Année + filière) à
                              (Nom de l&apos;école), je serais ravi(e)
                              d&apos;intervenir pour partager mon expérience.
                            </p>
                            <p>
                              Restant à votre disposition,
                              <br />
                              Cordialement,
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6" />
                    <MessageCircle className="h-6 w-6" />
                    <Share className="h-6 w-6" />
                  </div>
                  <Bookmark className="h-6 w-6" />
                </div>
                <p className="font-semibold text-sm mt-3">1,567 j&apos;aime</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
