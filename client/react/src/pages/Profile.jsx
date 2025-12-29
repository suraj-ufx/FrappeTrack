import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";


function Profile() {
  const { fetchProfile } = useAuthStore()
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();

  }, []);


  async function loadProfile() {
    const data = await fetchProfile();
    console.log(`fetch profile`, data)
    setProfile(data);
    setLoading(false);
  }
  // function fetchProfile(params) {

  // }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // if (!profile) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-red-500">
  //       Failed to load profile
  //     </div>
  //   );
  // }

  const { name, email, username, employee } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={employee?.image || "/assets/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            {name || "—"}
          </h2>
        </div>

        {/* Fields */}
        <ProfileField label="Email" value={email} />
        <ProfileField label="Username" value={username} />
        <ProfileField label="Employee ID" value={employee?.name} />
        <ProfileField label="Designation" value={employee?.designation} />
        <ProfileField label="Date of Birth" value={employee?.date_of_birth} />

      </div>
    </div>
  );
}

export default Profile

function ProfileField({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">
        {value || "—"}
      </span>
    </div>
  );
}
