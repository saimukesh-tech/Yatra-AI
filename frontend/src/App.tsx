import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/Home/HomePage'
import { ExplorePage } from '@/pages/Explore/ExplorePage'
import { PlanTripPage } from '@/pages/PlanTrip/PlanTripPage'
import { PlanningPage } from '@/pages/Planning/PlanningPage'
import { ItineraryPage } from '@/pages/Itinerary/ItineraryPage'
import { GroupMatchPage } from '@/pages/GroupMatch/GroupMatchPage'
import { TransportPage } from '@/pages/Transport/TransportPage'
import { SavedTripsPage } from '@/pages/SavedTrips/SavedTripsPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { HowItWorksPage } from '@/pages/HowItWorks/HowItWorksPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/plan" element={<PlanTripPage />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/group-match" element={<GroupMatchPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/trips" element={<SavedTripsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
