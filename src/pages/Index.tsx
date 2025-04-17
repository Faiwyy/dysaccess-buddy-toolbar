
import React from "react";
import ToolbarManager from "../components/ToolbarManager";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-dysaccess-light-blue to-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-dysaccess-text dyslexic-friendly">DysAccess</h1>
        <p className="text-xl text-dysaccess-text dyslexic-friendly max-w-md">
          Barre d'outils pour faciliter l'autonomie des enfants dyslexiques
        </p>
      </div>
      
      {/* Instructions d'utilisation */}
      <div className="max-w-2xl p-6 bg-white rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-dysaccess-text dyslexic-friendly">
          Comment utiliser DysAccess
        </h2>
        <ul className="space-y-3 text-dysaccess-text dyslexic-friendly">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-dysaccess-blue text-white rounded-full mr-3 flex-shrink-0">1</span>
            <span>La barre d'outils flottante affiche les raccourcis vers tes applications.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-dysaccess-purple text-white rounded-full mr-3 flex-shrink-0">2</span>
            <span><strong>Clique et fais glisser sur Buddy</strong> (la mascotte) pour déplacer la barre où tu veux à l'écran.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">3</span>
            <span>Clique sur le bouton d'engrenage violet pour ajouter ou supprimer des applications.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-400 text-white rounded-full mr-3 flex-shrink-0">4</span>
            <span>Tu peux ajouter des applications installées sur ton ordinateur ou des sites web.</span>
          </li>
        </ul>
      </div>
      
      {/* La barre d'outils (rendue initialement au centre de la page) */}
      <ToolbarManager />
      
      {/* Note en bas de page pour les orthophonistes */}
      <div className="fixed bottom-4 text-sm text-dysaccess-text opacity-80 mt-8 dyslexic-friendly">
        Développé pour l'Hôpital Paris Est Val de Marne (site Saint-Maurice)
      </div>
    </div>
  );
};

export default Index;
