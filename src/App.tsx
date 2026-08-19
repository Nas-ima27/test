// src/App.tsx
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext"; // NOUVEAU
import { LoginPage } from "@/features/auth/LoginPage"; // NOUVEAU
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"; // NOUVEAU
import { AppLayout } from "@/components/layout/AppLayout";
import { StagiaireLayout } from "@/components/layout/StagiaireLayout";
import { EncadrantLayout } from "@/components/layout/EncadrantLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { UsersPage } from "@/features/users/UsersPage";
import { StagiairesPage } from "@/features/stagiaires/StagiairesPage";
import { StagiaireDetailPage } from "@/features/stagiaires/StagiaireDetailPage";
import { EncadrantsPage } from "@/features/encadrants/EncadrantsPage";
import { EncadrantDetailPage } from "@/features/encadrants/EncadrantDetailPage";
import { SujetsPage } from "@/features/sujets/SujetsPage";
import { SujetDetailPage } from "@/features/sujets/SujetDetailPage";
import { CandidaturesPage } from "@/features/candidatures/CandidaturesPage";
import { BibliothequePage } from "@/features/rapports/BibliothequePage";
import { RapportDetailPage } from "@/features/rapports/RapportDetailPage";
import { ParametresPage } from "@/features/parametres/ParametresPage";
import { MonTableauDeBordPage as StagiaireDashboard } from "@/features/espace-stagiaire/MonTableauDeBordPage";
import { SujetsDisponiblesPage } from "@/features/espace-stagiaire/SujetsDisponiblesPage";
import { MesCandidaturesPage } from "@/features/espace-stagiaire/MesCandidaturesPage";
import { MonStagePage } from "@/features/espace-stagiaire/MonStagePage";
import { MonRapportPage } from "@/features/espace-stagiaire/MonRapportPage";
import { MonProfilPage as StagiaireProfilPage } from "@/features/espace-stagiaire/MonProfilPage";
import { MonTableauDeBordPage as EncadrantDashboard } from "@/features/espace-encadrant/MonTableauDeBordPage";
import { MesSujetsPage } from "@/features/espace-encadrant/MesSujetsPage";
import { MonSujetDetailPage } from "@/features/espace-encadrant/MonSujetDetailPage";
import { CandidaturesRecuesPage } from "@/features/espace-encadrant/CandidaturesRecuesPage";
import { MesStagiairesPage } from "@/features/espace-encadrant/MesStagiairesPage";
import { MonStagiaireDetailPage } from "@/features/espace-encadrant/MonStagiaireDetailPage";
import { MonProfilPage as EncadrantProfilPage } from "@/features/espace-encadrant/MonProfilPage";

export default function App() {
  return (
    <AuthProvider> {/* NOUVEAU — englobe toute l'application */}
      <Routes>
        <Route path="/login" element={<LoginPage />} /> {/* NOUVEAU */}

        {/* Espace Admin/RH — protégé */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin"]}> {/* NOUVEAU */}
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="utilisateurs" element={<UsersPage />} />
          <Route path="stagiaires" element={<StagiairesPage />} />
          <Route path="stagiaires/:id" element={<StagiaireDetailPage />} />
          <Route path="encadrants" element={<EncadrantsPage />} />
          <Route path="encadrants/:id" element={<EncadrantDetailPage />} />
          <Route path="sujets" element={<SujetsPage />} />
          <Route path="sujets/:id" element={<SujetDetailPage />} />
          <Route path="candidatures" element={<CandidaturesPage />} />
          <Route path="bibliotheque" element={<BibliothequePage />} />
          <Route path="bibliotheque/:id" element={<RapportDetailPage />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Route>

        {/* Espace Stagiaire — protégé */}
        <Route
          path="espace-stagiaire"
          element={
            <ProtectedRoute allowedRoles={["Stagiaire"]}> {/* NOUVEAU */}
              <StagiaireLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StagiaireDashboard />} />
          <Route path="sujets" element={<SujetsDisponiblesPage />} />
          <Route path="candidatures" element={<MesCandidaturesPage />} />
          <Route path="mon-stage" element={<MonStagePage />} />
          <Route path="rapport" element={<MonRapportPage />} />
          <Route path="bibliotheque" element={<BibliothequePage />} />
          <Route path="bibliotheque/:id" element={<RapportDetailPage />} />
          <Route path="profil" element={<StagiaireProfilPage />} />
        </Route>

        {/* Espace Encadrant — protégé */}
        <Route
          path="espace-encadrant"
          element={
            <ProtectedRoute allowedRoles={["Encadrant"]}> {/* NOUVEAU */}
              <EncadrantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EncadrantDashboard />} />
          <Route path="sujets" element={<MesSujetsPage />} />
          <Route path="sujets/:id" element={<MonSujetDetailPage />} />
          <Route path="candidatures" element={<CandidaturesRecuesPage />} />
          <Route path="stagiaires" element={<MesStagiairesPage />} />
          <Route path="stagiaires/:id" element={<MonStagiaireDetailPage />} />
          <Route path="bibliotheque" element={<BibliothequePage />} />
          <Route path="bibliotheque/:id" element={<RapportDetailPage />} />
          <Route path="profil" element={<EncadrantProfilPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}