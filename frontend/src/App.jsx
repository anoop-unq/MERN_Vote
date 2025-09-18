// App.js
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AppContextProvider } from './context/AppContext';
import { PollProvider } from './context/PollContext';
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import PollList from "./pages/PollList";
import PollView from "./pages/PollView";
import CreatePoll from "./pages/CreatePoll";
import MyPolls from "./pages/MyPolls";
import { DumpyPolls } from "./components/DumpyPolls";
import { PublicPollProvider } from "./context/PublicPollContext";
import PollChart from "./components/PollChart";
import VotersList from "./components/VotersList";
import EditPoll from "./components/EditPoll";
import Home from "./pages/Home";
import ViewUsers from "./pages/ViewUsers";
function App() {
  return (
    <AppContextProvider>
      <PollProvider>
        <PublicPollProvider>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="light"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/email-verify" element={<EmailVerify/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/home" element={<HomePage />}/>
            <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="/edit-profile/:id" element={<EditProfile />}/>
            <Route path="/view-user/:userId" element={<ViewUsers />}/>
            
            {/* Poll Routes */}
            <Route path="/polls" element={<PollList />} />
            <Route path="/poll" element={<DumpyPolls />}/>
            <Route path="/polls/create" element={<CreatePoll />} />
            <Route path="/polls/:id" element={<PollView />} />
            <Route path="/my-polls" element={<MyPolls />} />
            <Route path="/chart/:id" element={<PollChart />}/>
            <Route path="/poll/:id/voters" element={<VotersList />} />
            <Route path="/polls/edit/:userId" element={<EditPoll />} />
          </Routes>
        </div>
         </PublicPollProvider>
      </PollProvider>
    </AppContextProvider>
  );
}

export default App;